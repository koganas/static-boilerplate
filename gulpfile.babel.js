'use strict'

const gulp = require('gulp')
const imagemin = require('gulp-imagemin')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const include = require('gulp-include')
const browsersync = require('browser-sync').create()
const { src, series, parallel, dest, watch } = require('gulp')
const cfg = require('./gulp.config')

/** css */
const postcss = require('gulp-postcss')
const preCSS = require('precss')
const rucksack = require('rucksack-css')
const cssnano = require('cssnano')
const cssPresetEnv = require('postcss-preset-env')
const customProperties = require('postcss-custom-properties')
const customSelector = require('postcss-custom-selectors')
const autoprefixer = require('autoprefixer')
const processors = [preCSS(), cssPresetEnv(), rucksack(), customSelector(), customProperties(), cssnano(), autoprefixer()]

/** js */
const eslint = require('gulp-eslint')
const webpack = require('webpack-stream')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

function handleError(err) {
  console.log(err.toString())
  this.emit('end')
}

function buildHtml() {
  return src(`${cfg.src.main}/*.html`)
    .pipe(include())
      .on('error', handleError)
    .pipe(gulp.dest(cfg.dist.main))
}

function imgTask() {
  return src(`${cfg.src.img}/*`).pipe(imagemin()).pipe(gulp.dest(cfg.dist.img))
}

function jsTask() {
  return src(`${cfg.src.js.main}/**/*.js`)
    .pipe(sourcemaps.init())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(
      webpack({
        mode: 'production',
        module: {
          rules: [
            {
              test: /\.js$/,
              loader: 'babel-loader',
              options: {
                babelrc: false,
                presets: ['@babel/preset-env']
              }
            }
          ]
        },
        entry: `${cfg.src.js.main}/app`,
        output: {
          filename: 'app.js'
        },
        plugins: [new UglifyJsPlugin()]
      })
    )
      .on('error', handleError)
    .pipe(sourcemaps.write('.'))
    .pipe(dest(cfg.dist.js))
}

function cssTask() {
  return src(`${cfg.src.css}/**/*.css`)
    .pipe(sourcemaps.init())
    .pipe(concat('style.css'))
    .pipe(postcss(processors))
      .on('error', handleError)
    .pipe(sourcemaps.write('.'))
    .pipe(dest(cfg.dist.css))
}

function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: cfg.dist.main
    }
  })

  cb()
}

function browsersyncReload(cb) {
  browsersync.reload()
  cb()
}


function watchTask() {
  watch([
    `${cfg.src.main}/**/*.html`],
    { interval: 1000 },
    series(buildHtml, browsersyncReload)
  )
  watch([
    `${cfg.src.css}/**/*.css`, `${cfg.src.js.main}/**/*.js`],
    { interval: 1000 },
    series(parallel(cssTask, jsTask), browsersyncReload)
  )
}

exports.cssTask = cssTask
exports.jsTask = jsTask
exports.imgTask = imgTask
exports.buildHtml = buildHtml

exports.default = series(
  parallel(buildHtml, imgTask, jsTask, cssTask),
  browsersyncServe,
  watchTask
)