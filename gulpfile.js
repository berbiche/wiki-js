"use strict";
const fork    = require('child_process').fork;
const del     = require('del');
const fs      = require('fs');
const gulp    = require('gulp');
const flatten = require('gulp-flatten');
const sass    = require('gulp-sass');
const ts      = require('gulp-typescript');
const gutil   = require('gulp-util');
const merge   = require('merge-stream');
const config  = require('./config.json');
const chalk   = gutil.colors;

/////////////////////////
/*        Tasks        */
/////////////////////////
const compile = gulp.parallel(compile_js, compile_sass, compile_server);
compile.description = 'Compile the source files of the application';

const copy = gulp.parallel(copy_html, copy_lib);
copy.description = 'Copy libraries and html files to the server directory';

const build = gulp.series(clean, gulp.parallel(compile, copy));
build.description = 'Build the project';

const run_watch = gulp.parallel(run_express, watch);
run_watch.description = 'Start the Express server and watch for changes to files';

clean.description = 'Clean the dist directory of its content except for lib';
function clean() {
    return del(['dist/*', '!dist/lib', '!dist/src/favicon.ico']);
}

gulp.task('build', build);
gulp.task('clean', clean);
gulp.task('compile', compile);
gulp.task('copy', copy);
gulp.task('run', run_express);
gulp.task('run:watch', run_watch);

/////////////////////////
/*      Variables      */
/////////////////////////
// The instance of the Express server, used to kill the child process
const tsClientSrc = ts.createProject('./src/tsconfig.json');
const tsServerSrc = ts.createProject('./server/tsconfig.json');
const startTime   = Date.now();
// maps the output.locations with output.prefix to a new object
const outputDir   = Object.entries(config.output.locations)
    .reduce((obj, [key, value]) =>
        Object.defineProperty(obj, key, {'value': `${config.output.prefix}/${value}`})
    , {});

/////////////////////////
/*      Functions      */
/////////////////////////
// Compile the typescript code of src
function compile_js() {
    return (fs.existsSync(outputDir.client + '/app')
        ? gulp.src('src/**/*.ts', { 'since': startTime })
        : gulp.src('src/**/*.ts'))
        .pipe(tsClientSrc())
        .js.pipe(gulp.dest(outputDir.client));
}

// Compile the typescript for the server to dist/server
function compile_server() {
    return (fs.existsSync(outputDir.server)
        ? gulp.src('server/**/*.ts', { 'since': startTime })
        : gulp.src('server/**/*.ts'))
        .pipe(tsServerSrc())
        .js.pipe(gulp.dest(outputDir.server));
};

// Compile the sass to dist/src/base.css
function compile_sass() {
    return gulp.src('src/styles/base.scss')
        .pipe(sass.sync({'outputStyle': 'compressed'}))
        .pipe(gulp.dest('dist/src/css'));
};

// Copy the required libraries to dist/lib
function copy_lib(cb) {
    if (fs.existsSync(outputDir.libraries)) {
        gutil.log(`Skipping ${chalk.cyan("'copy:lib'")} -> `+
            `${chalk.green("'dist/lib'")} already exists`);
        cb();
        return;
    }

    let tmp1 = gulp.src('node_modules/rxjs/**/*.js', { 'base': 'node_modules' })
        .pipe(gulp.dest('./dist/lib'));
    let tmp2 = gulp.src([
            '@angular/**/bundles/*.min.js',
            '@angular/material/bundles/*.js',
            '@angular/material/core/theming/prebuilt/deeppurple-amber.css',
            'ui-router-ng2/_bundles/ui-router-ng2.min.js',
            'reflect-metadata/Reflect.js',
            'zone.js/dist/zone.min.js',
            'core-js/client/core.min.js',
            'systemjs/dist/system.js'
        ], { 'cwd': 'node_modules'})
        .pipe(flatten())
        .pipe(gulp.dest(outputDir.libraries));
    return merge(tmp1, tmp2);
}

// Copy the html files to dist/src/**
function copy_html() {
    return (fs.existsSync(outputDir.client)
        ? gulp.src('src/**/*.html', { 'since': startTime })
        : gulp.src('src/**/*.html'))
        .pipe(gulp.dest(outputDir.client));
};

// Watch for changes
function watch() {
    const onchange = (path) => gutil.log(`Path ${chalk.green(path)} changed`);
    gulp.watch('src/**/*.scss', gulp.series(compile_sass))
        .on('change', onchange);
    gulp.watch('src/**/*.ts', gulp.series(compile_js))
        .on('change', onchange);
    gulp.watch('src/**/*.html', gulp.series(copy_html))
        .on('change', onchange);
    gulp.watch('server/**/*.ts', gulp.series(compile_server, run_express))
        .on('change', onchange);
}

//////////////////////////
/*    Express Server    */
//////////////////////////
// defines properties to be used by the ChildProcess instance
class ServerWrapper {
    constructor() {
        throw new Error('ServerWrapper is meant to be used as a static class');
    }

    static start() {
        // create a child_process running the express server
        this.server = fork('dist/server/wiki.js', {
                'env': process.env,
                'cwd': __dirname,
                'silent': true
        }).on('message', (data) => {
            gutil.log(chalk.green('[server] ')
                + chalk.blue(data));
        }).on('exit', (code, sig) => {
            gutil.log(chalk.green('[server] ')
                + 'Exited with: [code => '
                + chalk.red('%d')
                + ', sig => '
                + chalk.red('%s')
                + ']', code, sig);
            //if the error code > 0 or sig is not null exit the process
            if (typeof code === 'number' && code !== 0) process.exit(1);
        }).on('error', (err) => {
            gutil.log(arguments);
            gutil.log(chalk.red(err));
            this.server = undefined;
        });
    }

    static restart() {
        // restart the child_process
        this.kill();
        gutil.log(chalk.green('[server] ')
            + chalk.blue('Restarting the server'));
        this.start();
    }

    static kill() {
        // kill the child process
        if (this.server) {
            this.server.disconnect();
            this.server.kill('SIGTERM');
            this.server = undefined;
        }
    }
}

run_express.description = 'Start the Express server';
function run_express(cb) {
    if (ServerWrapper.server === undefined) {
        ServerWrapper.start();
    } else {
        ServerWrapper.restart();
    }
    cb();
    return;
};
