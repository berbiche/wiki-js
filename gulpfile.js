"use strict";
const spawn  = require('child_process').spawn;
const del    = require('del');
const fs     = require('fs');
const gulp   = require('gulp-help')(require('gulp'), {'hideEmpty': true});
const concat = require('gulp-concat');
// const debug  = require('gulp-debug');
const inject = require('gulp-inject');
const sass   = require('gulp-sass');
const ts     = require('gulp-typescript');
const gutil  = require('gulp-util');
const path   = require('path');
const run    = require('run-sequence');

const tsSrc    = ts.createProject('src/tsconfig.json');
const tsServer = ts.createProject('server/tsconfig.json');
const colors   = gutil.colors;

/////////////////////////
/*     Clean tasks     */
/////////////////////////
// Clean up the dist folder
gulp.task('clean', 'Clean the dist directory of its content', () => {
    return del(['dist'], {'ignore': 'dist/libs'});
});
// Clean the css only
gulp.task('clean:css', false, () => {
    return del(['dist/src/app/base.css']);
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
    let result = tsSrc.src()
        .pipe(tsSrc());
    return result.js.pipe(gulp.dest('dist/src'));
});
// Compile the typescript for the server to dist/server
gulp.task('compile:server', false, () => {
    let result = gulp.src('server/**/*.ts')
        .pipe(tsServer());
    return result.js.pipe(gulp.dest('dist/server'));
});
// Compile the sass to dist/src/app.css
gulp.task('compile:sass', false, () => {
    return gulp.src('src/styles/base.scss')
        .pipe(sass.sync({'outputStyle': 'compressed'}))
        .pipe(gulp.dest('dist/src/css'));
});

/////////////////////////
/*      Copy tasks     */
/////////////////////////
// Copy the required libraries to dist/lib
gulp.task('copy:lib', false, () => {
    if (fs.existsSync('dist/lib')) {
        gutil.log(colors.green('Skipping copy:lib -> dist/lib already exists'));
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
gulp.task('inject:lib', false, ['copy:lib'], () => {
    let target = gulp.src('./dist/src/index.html');
    let source = gulp.src('./dist/lib/**/*.js', {'read': false});
    return target
        .pipe(inject(source, {'starttag': '<!-- inject:lib -->'}))
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
    run('clean:html', 'copy:html', 'inject:lib', cb);
});
gulp.task('build:server', false, (cb) => {
    run('clean:server', 'compile:server', 'run', cb);
});
// Build the project
gulp.task('build', 'Build the application', (cb) => {
    run('clean', [
            'compile:server',
            'compile:js',
            'compile:sass',
            'copy:lib',
            'copy:html'
        ],
        'inject:lib', 'run', cb);
});

/////////////////////////
/*        Watch        */
/////////////////////////
// Watch for changes
gulp.task('watch', false, () => {
    gulp.watch('src/**/*.scss', ['build:sass']);
    gulp.watch('src/**/*.ts', ['build:js']);
    gulp.watch('src/**/*.html', ['build:html']);
    gulp.watch('server/**/*.ts', () => { run('build:server', 'watch'); });
});

/////////////////////////
/*         Run         */
/////////////////////////
// Run the application
gulp.task('run', 'Run the application and watch for changes', (cb) => {
    run('run:express', 'watch', cb);
});
// The instance of express server
let server = undefined;
let serverTimer = undefined;
gulp.task('run:express', false, () => {
    if (server === undefined) {
        gutil.log(colors.green('[server] ') + 'Starting');
        start();
    } else {
        restart();
    }

    // Event handlers
    function stdout(data) {
        gutil.log(colors.green('[server] ') + colors.blue(data));
    }
    function stderr(data) {
        gutil.log(colors.green('[server] ') + colors.red(data));
    }
    function error(err) {
        if (err instanceof Error)
            throw err;
        gutil.log(colors.red(err));
        kill();
    }
    function exit(code, sig) {
        gutil.log(colors.green('[server] ') +
            'exited with: ' +
            colors.red('[code => %d, sig => %s]'), code, sig);
        serverTimer && clearTimeout(serverTimer);
        removeEvent();
        server = undefined;
        //if the error code or sig is not null exit the process
        if (code !== 0) process.exit(1);
        // else restart the server
        start();
    }
    // end Event handlers

    function start() {
        // create a child_process running the express server
        server = spawn(
            'node',
            ['dist/server/wiki.js'],
            {'env': process.env}
        );
        setEvent();
    }

    function restart() {
        // restart the child_process
        kill();
        gutil.log(colors.blue('Restarting the server'));
        start();
    }

    function kill() {
        // kill the child process
        if (server) {
            server.kill('SIGTERM');
            serverTimer = setTimeout(() => {
                server.kill('SIGKILL'); //die fucker
                removeEvent();
                server = undefined;
            }, 2000);
        }
    }

    function removeEvent() {
        if (server) {
            server.stdout.removeListener('data', stdout);
            server.stderr.removeListener('err', stderr);
            server.removeListener('exit', exit);
            server.removeListener('error', error);
        }
    }

    function setEvent() {
        server.stdout.setEncoding('utf8');
        server.stderr.setEncoding('utf8');
        server.stdout.on('data', stdout);
        server.stderr.on('data', stderr);
        // when the server exist
        server.once('exit', exit);
        // when the server has a problem
        server.once('error', error);
    }
});
