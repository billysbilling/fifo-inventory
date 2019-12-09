'use strict';

let gulp    = require('gulp'),
    jsdoc   = require("gulp-jsdoc3"),
    del     = require('del'),
    sass    = require('gulp-sass'),
    concat  = require('gulp-concat'),
    uglify  = require('gulp-uglify'),
    minify  = require('gulp-clean-css'),
    merge   = require('merge-stream'),

    // UI files
    path_to_public  = __dirname+"/public",
    path_to_assets  = path_to_public+"/assets",

    // Server docs
    path_to_routes  = __dirname+"/controllers",
    path_to_models  = __dirname+"/models",
    path_to_libs    = __dirname+"/lib",

    path_to_docs    = __dirname+'/docs/server';

let js_src = [
    path_to_assets+'/js/jquery.js',
    path_to_assets+'/js/lodash.js',

    path_to_assets+'/js/angular.js',
    path_to_assets+'/js/angular-animate.js',

    path_to_assets+'/libs/router/*.js',

    path_to_assets+'/libs/bootstrap/*.js',

    path_to_assets+'/libs/flash/*.js',

    path_to_assets+'/libs/moment/moment.js',
    path_to_assets+'/libs/moment/angular-moment.js',

    path_to_public+'/app.js',

    path_to_public+'/ng.modules/**/*.js',
    path_to_public+'/ng.directives/**/*.js',
    path_to_public+'/ng.filters/**/*.js',
    path_to_public+'/ng.services/**/*.js'
];

let scss_src = [
    path_to_assets+'/libs/bootstrap/*.scss',
    path_to_assets+'/scss/*.scss',
    path_to_assets+'/libs/flash/*.scss'
];

let jsdoc_server_src = [
    path_to_routes + "/*.js",
    path_to_models + "/*.js",
    path_to_libs + "/*.js"
];

gulp.task('default', ['build']);

gulp.task('watcher', ['build'], () => {
    gulp.watch(js_src, ['js']);
    gulp.watch(jsdoc_server_src, ['docs']);
    //gulp.watch(css_src, ['css']);
    gulp.watch(scss_src, ['css']);

    gulp.watch(js_src, ['js']);
});

gulp.task('clean_docs', () => {
    console.log("Clean ", path_to_docs);
    return del(path_to_docs+"/*");
});

gulp.task('docs', ['clean_docs'], () => {
    console.log("generate docs for ");

    let config = {
        opts: {
            destination: path_to_docs
        },
        plugins: ['plugins/markdown'],
        templates: {
            cleverLinks: false,
            monospaceLinks: false,
            "default": {
                "outputSourceFiles": true
            },

            outputSourceFiles: true,
            outputSourcePath: true,

            path: 'ink-docstrap',
            theme: 'cerulean',
            navType: 'vertical',
            linenums: true,
            dateFormat: 'MMMM Do YYYY, h:mm:ss a'
        }
    };

    gulp.src(__dirname + "/routes/packs.js")
    gulp.src(jsdoc_server_src)
        .pipe(jsdoc(config, function() {
            console.log("Documentation has been generated to "+config.opts.destination);
        }))
});

gulp.task('build', ['js', 'css'], () => {
    console.log("JS and CSS have been built.");
});

gulp.task('js', () => {
    gulp.src(js_src)
        .pipe(concat('all.min.js'))
        // .pipe(uglify())
        .pipe(gulp.dest(path_to_assets+'/js'));
});

gulp.task('css', () => {
    let scss_stream = gulp.src(scss_src)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.scss'))

    // var css_stream = gulp.src(css_src)
    //     .pipe(concat('style.css'));

    // merge(scss_stream, css_stream)
        .pipe(concat('all.min.css'))
        .pipe(minify())
        .pipe(gulp.dest(path_to_assets+'/css'));
});