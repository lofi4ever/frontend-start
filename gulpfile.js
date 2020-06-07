const { src, dest, watch, parallel } = require('gulp');
const { path } = require('./config.js');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');

sass.compiler = require('node-sass');

function styles() {
  return src(path.styles.input)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(dest(path.styles.output))
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

function test() {
  console.log('works');
  styleLibs();
  watch(path.styles.input, { ignoreInitial: false }, styles);
  watch(path.scripts.input, { ignoreInitial: false }, scripts);
}

exports.default = test;