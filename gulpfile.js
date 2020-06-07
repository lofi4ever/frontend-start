const { src, dest, watch, parallel } = require('gulp');
const { path } = require('./config.js');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

sass.compiler = require('node-sass');

function styles() {
  return src(path.style.input)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(dest(path.style.output))
}

function styleLibs() {
  return src(path.style.libs)
    .pipe(concat('libs.css'))
    .pipe(dest(path.style.output))
}

function test() {
  console.log('works');
  styleLibs();
  watch(path.style.input, { ignoreInitial: false }, styles);
}

exports.default = test;