"use strict";
const spawn  = require('child_process').spawn;
const del    = require('del');
const fs     = require('fs');
const gulp   = require('gulp-help')(require('gulp'), {'hideEmpty': true});
const concat = require('gulp-concat');
const inject = require('gulp-inject');
const sass   = require('gulp-sass');
const ts     = require('gulp-typescript');
const gutil  = require('gulp-util');
const path   = require('path');
const run    = require('run-sequence');

const tsSrc    = ts.createProject('src/tsconfig.json');
const tsServer = ts.createProject('server/tsconfig.json');
const colors   = gutil.colors;

// The instance of express server
let server = undefined;

/////////////////////////
/*     Clean tasks     */
/////////////////////////
// Clean up the dist folder
gulp.task('clean', 'Clean the dist directory of its content', () => {
    return del(['dist'], {'ignore': 'dist/libs'});
});
// Clean the css only
gulp.task('clean:css', false, () => {
    return del(['dist/src/app.css']);
});
// Clean the html
gulp.task('clean:html', false, () => {
    return del(['dist/src/**/*.html']);
});
// Clean the client javascript
gulp.task('clean:js', false, () => {
    return del(['dist/src/**/*.js']);
});
// Clean the server
gulp.task('clean:server', false, () => {
    return del(['dist/server']);
});

/////////////////////////
/*    Compile tasks    */
/////////////////////////
// Compile the typescript code of src
gulp.task('compile:js', false, () => {
    let result = tsSrc.src();
    return result.js.pipe(gulp.dest('dist/src'));
});
// Compile the typescript for the server to dist/server
gulp.task('compile:server', false, () => {
    let result = tsServer.src();
    return result.js.pipe(gulp.dest('dist/server'));
});
// Compile the sass to dist/src/app.css
gulp.task('compile:sass', false, () => {
    return gulp.src('src/styles/base.scss')
        .pipe(sass.sync({'outputStyle': 'compressed'}))
        .pipe(gulp.dest('dist/src/app.css'));
});

/////////////////////////
/*      Copy tasks     */
/////////////////////////
// Copy the required libraries to dist/lib
gulp.task('copy:libs', false, () => {
    if (fs.existsSync('dist/lib')) {
        gutil.log(colors.green('Skipping copy:libs -> dist/lib already exists'));
        return;
    }
    return gulp.src([
        '@angular/**/bundles/*.min.js',
        '@angular/material/bundles/*.js',
        'ui-router-ng2/_bundles/ui-router-ng2.min.js',
        'zone.js/dist/zone.min.js',
        'core-js/client/core.min.js',
        'systemjs/dist/system-production.js',
        'rxjs/bundles/Rx.min.js'
    ], { 'cwd': 'node_modules/**' })
    .pipe(gulp.dest('dist/lib/'));
});
// Copy the html files to dist/src
gulp.task('copy:html', false, () => {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist/src'));
});
// Inject javascript libraries in index.html
gulp.task('inject:libs', false, () => {
    let target = gulp.src('dist/src/index.html');
    let source = gulp.src('dist/libs/*.js', {'read': false});
    return target.pipe(inject(source))
        .pipe(gulp.dest('dist/src'));
});

/////////////////////////
/*     Build tasks     */
/////////////////////////
// Replace the css in dist with newly compiled css
gulp.task('build:sass', false, (cb) => {
    run('clean:css', 'compile:sass', cb);
});
// Replace the javascript with the new javascript of src
gulp.task('build:js', false, (cb) => {
    run('clean:js', 'compile:js', cb);
});
// Replace the html with the new html of src
gulp.task('build:html', false, (cb) => {
    run('clean:html', 'copy:html', 'inject:libs', cb);
});
gulp.task('build:server', false, (cb) => {
    run('clean:server', 'compile:server', cb);
});
// Build the project
gulp.task('build', 'Build the application', () => {
    run('clean',
        [
            'compile:server',
            'compile:client',
            'compile:sass',
            'copy:libs',
            'copy:html',
            'inject:libs'
        ]);
});

/////////////////////////
/*         Run         */
/////////////////////////
// Run the application
gulp.task('run', 'Run the application and watch for changes', ['build:server'], () => {
    const timer;
    function start() {
        // create a child_process running the express server
        server = spawn(
            'node',
            ['dist/server/app.js'],
            {'cwd': path.resolve('dist/server'), 'env': process.env}
        );
        setEvent();
    }

    function restart() {
        // restart the child_process
        gutil.log(colors.blue('Restarting the server'));
        kill();
        start();
    }

    function kill() {
        // kill the child process
        if (server) {
            server.kill('SIGTERM');
            timer = setTimeout(() => {
                server.kill('SIGKILL'); //die fucker
                removeEvent();
                server = undefined;
            }, 500);
        }
    }

    function removeEvent() {
        if (server) {
            server.stdout.removeListener('data');
            server.stderr.removeListener('err');
            server.removeListener('exit');
            server.removeListener('error');
        }
    }

    function setEvent() {
        server.stdout.setEncoding('utf8');
        server.stderr.setEncoding('utf8');

        server.stdout.on('data', (data) => {
            gutil.log(colors.green('[server]')+ colors.blue(data));
        });

        server.stderr.on('data', (err) => {
            gutil.log(colors.green('[server]') + colors.red(err));
        });

        // when the server exist
        server.once('exit', (code, sig) => {
            gutil.log(colors.green('[server]') +
                'exited with: ' +
                colors.blue('[code => %d, sig => %s]', code, sig));
            if (timer) {
                clearTimeout(timer);
            }
            removeEvent();
            server = undefined;
        });

        // when the server has a problem
        server.once('error', (err) => {
            gutil.log(colors.red(err));
            kill();
        });
    }

    if (server === undefined) {
        gutil.log(colors.blue('Starting the server'));
        start();
    } else {
        restart();
    }

    gulp.watch('src/**/*.scss', ['build:sass']);
    gulp.watch('src/**/*.ts', ['build:js']);
    gulp.watch('src/**/*.html', ['build:html']);
    gulp.watch('server/**/*.ts', ['build:server']);
});
