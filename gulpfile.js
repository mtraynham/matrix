var gulp = require('gulp'),
    browserify = require('browserify'),
    bump = require('gulp-bump'),
    coffeeify = require('coffeeify'),
    coffeeLint = require('gulp-coffeelint'),
    es6ify = require('es6ify'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    streamify = require('gulp-streamify'),
    uglify = require('gulp-uglify'),
    watchify = require('watchify');

gulp.task('lint', function () {
    return gulp.src('src/*.coffee')
        .pipe(coffeeLint('.coffeelint.json'))
        .pipe(coffeeLint.reporter())
        .pipe(coffeeLint.reporter('fail'));
});

gulp.task('build', function () {
    var coffeeBundler = browserify({
        basedir: __dirname,
        entries: ['./src/coffee/index.coffee'],
        extensions: ['.coffee'],
        debug: global.isDevelopment ? true : false,
        cache: {},
        packageCache: {},
        fullPaths: false
    }).transform(coffeeify);

    var es6Bundler = browserify({
        basedir: __dirname,
        entries: ['./src/es6/vector.jsx'], // TODO SHOULD BE index.jsx
        extensions: ['.jsx'],
        debug: global.isDevelopment ? true : false,
        cache: {},
        packageCache: {},
        fullPaths: false
    }).add(es6ify.runtime)
        .transform(es6ify);

    var bundleCoffee = function () {
        return coffeeBundler
            .bundle()
            .pipe(source('matrix.js'))
            .pipe(gulp.dest('./'))
            .pipe(streamify(uglify()))
            .pipe(rename('matrix.min.js'))
            .pipe(gulp.dest('./'));
    };

    var bundleEs6 = function () {
        return es6Bundler
            .bundle()
            .pipe(source('matrix.jsx'))
            .pipe(gulp.dest('./'));
            // .pipe(streamify(uglify()))
            // .pipe(rename('matrix.min.jsx'))
            // .pipe(gulp.dest('./'));
    };

    if (global.isWatching) {
        coffeeBundler = watchify(coffeeBundler);
        coffeeBundler.on('update', bundleCoffee);
        es6Bundler = watchify(es6Bundler);
        es6Bundler.on('update', bundleEs6);
    }
    return [bundleCoffee(), bundleEs6()];
});

gulp.task('setWatch', function () {
    global.isWatching = true;
});

gulp.task('setDevelopment', function () {
    global.isDevelopment = true;
});

var bumpFn = function (type) {
    gulp.src(['./bower.json', './package.json'])
        .pipe(bump({type: type}))
        .pipe(gulp.dest('./'));
};

// Default Task
gulp.task('default', ['setDevelopment', 'lint', 'build']);
gulp.task('watch', ['setDevelopment', 'setWatch', 'lint', 'build']);
gulp.task('release', ['lint', 'build']);
gulp.task('bump:major', function () {
    bumpFn('major');
});
gulp.task('bump:minor', function () {
    bumpFn('minor');
});
gulp.task('bump:patch', function () {
    bumpFn('patch');
});