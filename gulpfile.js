const { src, dest, watch, parallel } = require('gulp');
const { path, isLocal } = require('./config.js');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const gulpif = require('gulp-if');

let browserSync;

if(isLocal) {
  browserSync = require('browser-sync').create();
}

sass.compiler = require('node-sass');

function styles() {
  return src(path.styles.input)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(dest(path.styles.output))
    .pipe(gulpif(isLocal, browserSync.stream()))
}

function styleLibs() {
  return src(path.styles.libs)
    .pipe(concat('libs.css'))
    .pipe(dest(path.styles.output))
}

function scripts() {
  return src(path.scripts.input)
    .pipe(webpackStream({
      output: {
        filename: 'scripts.js',
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ['env']
            }
          }
        ]
      }
    }))
    .pipe(dest(path.scripts.output))
}

function watcher() {
  watch(path.scripts.input, { ignoreInitial: false }, scripts);
  watch(path.styles.input, { ignoreInitial: false }, styles);
  if(isLocal) {
    browserSync.init({
      server: {
        baseDir: "./"
      },
      notify: false
    });
    watch(path.scripts.output).on("change", browserSync.reload);
    watch('*.html').on("change", browserSync.reload);
  }
}

function dev() {
  styleLibs();
  watcher();
}

exports.default = dev;