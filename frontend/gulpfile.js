'use strict';

const gulp = require('gulp');
const exec = require('child_process').exec;
const logger = require('fancy-log');
const webpack = require('webpack');
const webst = require('./scripts/webpack-stats.js');
const webpackConfig = require('./webpack.config.js');

gulp.task('build-js', function (callback) {
  webpack(webpackConfig, function (err, stats) {
    if (err) throw err;
    webst.logStats(logger, stats);
    callback();
  });
});

gulp.task('build-css', function (callback) {
  exec('npm run build:css', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    callback(err);
  });
});

gulp.task('default', ['build-js', 'build-css']);