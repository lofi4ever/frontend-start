const { src, dest, watch, parallel } = require('gulp');
const { paths, isLocal } = require('./config.js');
const path = require('path');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const webpackCompiler = require('webpack');
const webpackStream = require('webpack-stream');
const gulpif = require('gulp-if');

let browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

function styles() {
  return src(paths.styles.input)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(dest(paths.styles.output))
    .pipe(gulpif(isLocal, browserSync.stream()))
}

function styleLibs() {
  return src(paths.styles.libs)
    .pipe(concat('libs.css'))
    .pipe(dest(paths.styles.output))
}

function scripts() {
  return src(paths.scripts.input)
    .pipe(webpackStream({
      mode: 'development',
      output: {
        filename: paths.scripts.filename,
      },
      devtool: 'source-map',
      plugins: [
        new webpackCompiler.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          'window.jQuery': 'jquery' //for fancybox to work
        })
      ],
      resolve: {
        alias: {
          NodeModules: path.resolve(__dirname, 'node_modules')
        }
      },
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader',
            query: {
              presets: ['@babel/preset-env']
            }
          }
        ]
      }
    }, webpackCompiler))
    .pipe(dest(paths.scripts.output))
}

function watcher() {
  watch([paths.scripts.src], { ignoreInitial: false }, scripts);
  watch(paths.styles.input, { ignoreInitial: false }, styles);
  if(isLocal) {
    browserSync.init({
      server: {
        baseDir: "./"
      },
      notify: false
    });
    watch(paths.scripts.outputFile).on("change", browserSync.reload);
    watch('*.html').on("change", browserSync.reload);
  }
}

function dev() {
  styleLibs();
  watcher();
}

exports.default = dev;