"use strict";
const spawn   = require('child_process').spawn;
const del     = require('del');
const fs      = require('fs');
const flatten = require('gulp-flatten');
const gulp    = require('gulp-help')(require('gulp'), {'hideEmpty': true});
// const concat = require('gulp-concat');
// const debug  = require('gulp-debug');
// const inject = require('gulp-inject');
const sass    = require('gulp-sass');
const ts      = require('gulp-typescript');
const gutil   = require('gulp-util');
const newer   = require('gulp-newer');
const merge   = require('merge-stream');
const path    = require('path');
const run     = require('run-sequence');

const tsSrc    = ts.createProject('src/tsconfig.json');
const tsServer = ts.createProject('server/tsconfig.json');
const chalk    = gutil.colors;

// The instance of the Express server
// Used to kill the process
let server = undefined;

/////////////////////////
/*        Other        */
/////////////////////////
// On process exit, kill the server
process.once('exit', exit);
// Same as above
process.once('SIGINT', exit);
// Same as above
process.once('SIGBREAK', exit);

function exit(code) {
    server && server.kill('SIGKILL');
    code && gutil.log('Exiting process with code ' + chalk.red(`${code}`));
    process.exit();
}

/////////////////////////
/*     Clean task      */
/////////////////////////
// Clean up the dist folder
gulp.task('clean', 'Clean the dist directory of its content', () => {
    return del(['dist/*', '!dist/lib']);
});

/////////////////////////
/*    Compile tasks    */
/////////////////////////
// Compile the typescript code of src
gulp.task('compile:js', false, () => {
    const dest = 'dist/src';
    let result = gulp.src('src/**/*.ts')
        .pipe(newer(dest, { 'ext': '.js' }))
        .pipe(tsSrc());
    return result.js.pipe(gulp.dest(dest));
});
// Compile the typescript for the server to dist/server
gulp.task('compile:server', false, () => {
    const dest = 'dist/server';
    let result = gulp.src('server/**/*.ts')
        .pipe(newer(dest, { 'ext': '.js' }))
        .pipe(tsServer());
    return result.js.pipe(gulp.dest(dest));
});
// Compile the sass to dist/src/base.css
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
        gutil.log(`Skipping ${chalk.cyan("'copy:lib'")} -> `+
            `${chalk.green("'dist/lib'")} already exists`);
        cb();
    }

    let tmp1 = gulp.src([
        '@angular/**/bundles/*.min.js',
        '@angular/material/bundles/*.js',
        '@angular/material/core/theming/prebuilt/deeppurple-amber.css',
        'ui-router-ng2/_bundles/ui-router-ng2.min.js',
        'reflect-metadata/Reflect.js',
        'zone.js/dist/zone.min.js',
        'core-js/client/core.min.js',
        'systemjs/dist/system.js'
    ], { 'cwd': 'node_modules/**' })
    .pipe(flatten())
    .pipe(gulp.dest('dist/lib/'));

    let tmp2 = gulp.src('rxjs/**/*.js', { 'cwd': 'node_modules/**' })
        .pipe(gulp.dest('dist/lib/'));

    return merge(tmp1, tmp2);
});
// Copy the html files to dist/src/**/
gulp.task('copy:html', false, () => {
    const dest = 'dist/src';
    return gulp.src('src/**/*.html')
        .pipe(newer(dest))
        .pipe(gulp.dest(dest));
});

/////////////////////////
/*      Build task     */
/////////////////////////
// Build the project
gulp.task('build', 'Build the application', (cb) => {
    run('clean', [
        'compile:server',
        'compile:js',
        'compile:sass',
        'copy:lib',
        'copy:html'
    ],  cb);
});
/////////////////////////
/*        Watch        */
/////////////////////////
// Watch for changes
gulp.task('watch', false, (cb) => {
    gulp.watch('src/**/*.scss', ['compile:sass'], cb);
    gulp.watch('src/**/*.ts', ['compile:js'], cb);
    gulp.watch('src/**/*.html', ['copy:html'], cb);
    gulp.watch('server/**/*.ts', () => { run('compile:server', 'run'); }, cb);
});

/////////////////////////
/*         Run         */
/////////////////////////
// Run the application
gulp.task('run', 'Run the application and watch for changes', (cb) => {
    return run('run:express', 'watch', cb);
});
// starts the server and handles process exit
gulp.task('run:express', false, () => {
    if (server === undefined) {
        start();
    } else {
        restart();
    }

    // Event handlers
    function stdout(data) {
        gutil.log(chalk.green('[server] ') + chalk.blue(typeof data === 'string' ? data.trim() : data));
    }
    function stderr(data) {
        gutil.log(chalk.green('[server] ') + chalk.red(typeof data === 'string' ? data.trim() : data));
    }
    function error(err) {
        if (err instanceof Error)
            throw err;
        gutil.log(chalk.red(err));
        kill();
    }
    function exit(code, sig) {
        gutil.log(chalk.green('[server] ') +
            'Exited with: ' +
            chalk.red('[code => %d, sig => %s]'), code, sig);
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
            {
                'env': process.env,
                'cwd': __dirname
            }
        );
        setEvent();
    }

    function restart() {
        // restart the child_process
        kill();
        gutil.log(chalk.green('[server] ') + chalk.blue('Restarting the server'));
        start();
    }

    function kill() {
        // kill the child process
        if (server) {
            server.kill('SIGTERM');
            removeEvent();
            server = undefined;
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
