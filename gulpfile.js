/* =========================================================
 Import
========================================================= */
/* ---------------------------------------------------------
 common
--------------------------------------------------------- */
const gulp = require('gulp');
const browser = require('browser-sync');
const ssi = require('browsersync-ssi');
const del = require('del');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const runSequence = require('run-sequence');

/* ---------------------------------------------------------
 pug
--------------------------------------------------------- */
const pug = require('gulp-pug');

/* ---------------------------------------------------------
 es6
--------------------------------------------------------- */
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfigDev = require('./webpack.config.dev');
const webpackConfigProd = require('./webpack.config.prod');

/* ---------------------------------------------------------
 sass
--------------------------------------------------------- */
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const gcmq = require('gulp-group-css-media-queries');
const sassGlob = require('gulp-sass-glob');
const purgecss = require('gulp-purgecss');

/* ---------------------------------------------------------
 image
--------------------------------------------------------- */
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');

/* ---------------------------------------------------------
 styleguide
--------------------------------------------------------- */
const styleguide = require('sc5-styleguide');

/* =========================================================
 settings
========================================================= */
const paths = {
  sass: [
    './_src/assets/sass/*.scss',
    './_src/assets/sass/**/*.scss',
    './_src/assets/sass/**/**/*.scss'
  ],
  sassDev: './_dev/assets/css/',
  sassDist: './_dist/assets/css/',
  css: ['./_dist/assets/css/*.css'],
  pug: [
    './_src/*.pug',
    './_src/**/*.pug',
    './_src/**/**/*.pug',
    '!./_src/_*.pug',
    '!./_src/**/_*.pug',
    '!./_src/**/**/_*.pug'
  ],
  html: ['./_src/*.html', './_src/**/*.html'],
  htmlDist: ['./_dist/*.html', './_dist/**/*.html'],
  pugDev: './_dev/',
  pugDist: './_dist/',
  es: ['./_src/assets/es/*.js', './_src/assets/es/**/*.js'],
  esDev: './_dev/assets/js/',
  esDist: './_dist/assets/js/',
  js: ['./_src/assets/js/*.js', './_src/assets/js/**/*.js'],
  image: ['./_src/assets/images/**/*'],
  imageDev: './_dev/assets/images/',
  imageDist: './_dist/assets/images/',
  dist: './_dist/',
  styleguide: './_styleguide/',
  styleguideRoot: '/styleguide_test'
};

/* =========================================================
 Task
========================================================= */
/* ---------------------------------------------------------
 pug src
--------------------------------------------------------- */
gulp.task('pug', function() {
  const option = {
    pretty: true
  };
  gulp
    .src(paths.pug)
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      })
    )
    .pipe(pug(option))
    .pipe(gulp.dest(paths.pugDev))
    .pipe(browser.reload({ stream: true }));
});
/* ---------------------------------------------------------
 pug dist
--------------------------------------------------------- */
gulp.task('pug_dist', function() {
  const option = {
    pretty: true
  };
  gulp
    .src(paths.pug)
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      })
    )
    .pipe(pug(option))
    .pipe(gulp.dest(paths.pugDist));
});
/* ---------------------------------------------------------
 webpack src
--------------------------------------------------------- */
gulp.task('webpack', function() {
  return webpackStream(webpackConfigDev, webpack)
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      })
    )
    .pipe(gulp.dest(paths.esDev))
    .pipe(browser.reload({ stream: true }));
});
/* ---------------------------------------------------------
 webpack dist
--------------------------------------------------------- */
gulp.task('webpack_dist', function() {
  return webpackStream(webpackConfigProd, webpack)
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>')
      })
    )
    .pipe(gulp.dest(paths.esDist));
});
/* ---------------------------------------------------------
 sass src
--------------------------------------------------------- */
gulp.task('sass', function() {
  gulp
    .src(paths.sass)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(autoprefixer({ browsers: ['last 3 versions'], cascade: false }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.sassDev))
    .pipe(browser.reload({ stream: true }));
});
/* ---------------------------------------------------------
 sass dist
--------------------------------------------------------- */
gulp.task('sass_dist', function() {
  gulp
    .src(paths.sass)
    .pipe(plumber())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(autoprefixer({ browsers: ['last 3 versions'], cascade: false }))
    .pipe(gcmq())
    .pipe(gulp.dest(paths.sassDist));
});
/* ---------------------------------------------------------
 sass purgecss
--------------------------------------------------------- */
gulp.task('purgecss', () => {
  return gulp
    .src(paths.css)
    .pipe(purgecss({ content: paths.htmlDist }))
    .pipe(cleanCSS())
    .pipe(gulp.dest(paths.sassDist));
});
/* ---------------------------------------------------------
 image src
--------------------------------------------------------- */
gulp.task('imagemin', function() {
  gulp
    .src(paths.image)
    .pipe(changed(paths.imageDev))
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 7 }),
        ,
        imagemin.jpegtran({
          quality: 85,
          progressive: true
        }),
        imagemin.svgo(),
        imagemin.optipng(),
        imagemin.gifsicle()
      ])
    )
    .pipe(gulp.dest(paths.imageDev))
    .pipe(browser.reload({ stream: true }));
});
/* ---------------------------------------------------------
 image dist
--------------------------------------------------------- */
gulp.task('imagemin_dist', function() {
  gulp
    .src(paths.image)
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 7 }),
        ,
        imagemin.jpegtran({
          quality: 85,
          progressive: true
        }),
        imagemin.svgo(),
        imagemin.optipng(),
        imagemin.gifsicle()
      ])
    )
    .pipe(gulp.dest(paths.imageDist));
});
/* ---------------------------------------------------------
 server
--------------------------------------------------------- */
gulp.task('server', function() {
  browser({
    server: {
      baseDir: paths.pugDev,
      middleware: [
        ssi({
          baseDir: __dirname + '/src',
          ext: '.html'
        })
      ]
    },
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }
  });
});
/* ---------------------------------------------------------
 reload
--------------------------------------------------------- */
gulp.task('reload', function() {
  browser.reload({ stream: true });
});
/* ---------------------------------------------------------
 clean
--------------------------------------------------------- */
gulp.task('clean', function() {
  return del.sync(['./_dist']);
});
/* ---------------------------------------------------------
 clean Style Guide
--------------------------------------------------------- */
gulp.task('sg-clean', function() {
  return del.sync(['./_styleguide']);
});
/* ---------------------------------------------------------
 Styleguide src
--------------------------------------------------------- */
gulp.task('sg-generate', function() {
  return gulp
    .src(paths.sass)
    .pipe(plumber())
    .pipe(
      styleguide.generate({
        title: 'Styleguide',
        server: true,
        port: 5000,
        rootPath: paths.styleguide,
        overviewPath: paths.styleguide + 'overview.md',
        enablePug: true
      })
    )
    .pipe(gulp.dest(paths.styleguide))
    .pipe(browser.reload({ stream: true }));
});
/* ---------------------------------------------------------
 Styleguide dist
--------------------------------------------------------- */
gulp.task('sg-generate-dist', function() {
  return gulp
    .src(paths.sass)
    .pipe(plumber())
    .pipe(
      styleguide.generate({
        title: 'Styleguide',
        rootPath: paths.styleguide,
        overviewPath: paths.styleguide + 'overview.md',
        enablePug: true,
        appRoot: paths.styleguideRoot
      })
    )
    .pipe(gulp.dest(paths.styleguide))
    .pipe(browser.reload({ stream: true }));
});
/* ---------------------------------------------------------
 Styleguide
--------------------------------------------------------- */
gulp.task('sg-style', function() {
  return gulp
    .src(paths.sass)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sassGlob())
    .pipe(sass())
    .pipe(cleanCSS())
    .pipe(autoprefixer({ browsers: ['last 3 versions'], cascade: false }))
    .pipe(sourcemaps.write('./'))
    .pipe(styleguide.applyStyles())
    .pipe(gulp.dest(paths.styleguide))
    .pipe(browser.reload({ stream: true }));
});

/* =========================================================
 Task main
========================================================= */
/* ---------------------------------------------------------
 gulp default
--------------------------------------------------------- */
gulp.task(
  'default',
  ['server', 'sass', 'webpack', 'pug', 'imagemin', 'reload'],
  function() {
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.es, ['webpack']);
    gulp.watch(paths.pug, ['pug']);
    gulp.watch(paths.image, ['imagemin']);
    gulp.watch([paths.html, paths.js], ['reload']);
  }
);
/* ---------------------------------------------------------
 gulp dist
--------------------------------------------------------- */
gulp.task('dist', function(callback) {
  return runSequence(
    'clean',
    ['sass_dist', 'webpack_dist', 'pug_dist', 'imagemin_dist'],
    'purgecss',
    callback
  );
});

/* ---------------------------------------------------------
 gulp sg (styleguide)
--------------------------------------------------------- */
gulp.task('sg', ['sg-generate', 'sg-style'], function() {
  gulp.watch('_styleguide/overview.md', ['sg-generate', 'sg-style']);
  gulp.watch(paths.sass, ['sg-generate', 'sg-style']);
});
/* ---------------------------------------------------------
 gulp sg-dist (styleguide-dist)
--------------------------------------------------------- */
gulp.task('sg-dist', ['sg-generate-dist', 'sg-style']);
