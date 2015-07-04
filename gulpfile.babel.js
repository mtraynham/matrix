import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import {Instrumenter} from 'isparta';
import jshintStylish from 'jshint-stylish';
import webpackStream from 'webpack-stream';
import {build as webBuild, test as webTest, uglify as webUglify} from './webpack';

const $ = gulpLoadPlugins();

const webpack = (src, opts, dest) =>
    gulp.src(src)
        .pipe(webpackStream(opts))
        .pipe(gulp.dest(dest));

const test = () =>
    gulp.src(['test/unit/*.ts'], {read: false})
        .pipe($.mocha());

const bump = (type) =>
    gulp.src(['./bower.json', './package.json'])
        .pipe($.bump({type: type}))
        .pipe(gulp.dest('./'));

// Lint Task
gulp.task('lintjs', () =>
    gulp.src(['gulpfile.babel.js', 'webpack/**/*.js'])
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.jshint.reporter(jshintStylish)));

gulp.task('lintts', () =>
    gulp.src(['index.ts', 'lib/**/*.ts', 'test/**/*.ts'])
        .pipe($.tslint())
        .pipe($.tslint.report('verbose')));

gulp.task('lint', ['lintjs', 'lintts']);

// Build Task
gulp.task('build', ['lint'],
    webpack.bind(this, 'index.js', webBuild, 'dist/'));

// Uglify Task
gulp.task('uglify', ['lint'],
    webpack.bind(this, 'index.js', webUglify, 'dist/'));

// Test Task
gulp.task('test', ['lint'],
    test.bind(this));

// Coverage Task
gulp.task('coverage', ['lint'], () =>
    gulp.src(['lib/**/*.ts', 'index.ts'])
        .pipe($.istanbul({instrumenter: Instrumenter}))
        .pipe($.istanbul.hookRequire())
        .on('finish', () =>
            test()
                .pipe($.istanbul.writeReports()) // Creating the reports after tests runned
                .on('end', () =>
                    gulp.src('coverage/lcov.info')
                        .pipe($.coveralls()))));

// Browser Test Tasks
gulp.task('test-browser-build', ['lint'], () =>
    webpack(['test/**/*.ts'], webTest, './.tmp')
        .pipe($.livereload()));

gulp.task('test-browser', ['test-browser-build'], () => {
    $.livereload.listen({port: 35729, host: 'localhost', start: true});
    gulp.src('test/runner.html')
        .pipe($.open('<%file.path%>'));
    gulp.watch(['lib/**/*.ts', 'test/**/*.ts'], ['test-browser-build']);
});

// Bump Tasks
gulp.task('bump:major', bump.bind(this, 'major'));
gulp.task('bump:minor', bump.bind(this, 'minor'));
gulp.task('bump:patch', bump.bind(this, 'patch'));

// Default Task
gulp.task('default', ['build', 'uglify']);
