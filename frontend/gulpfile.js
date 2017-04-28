'use strict';

var gulp = require('gulp');
var RSBundler = require('@redsift/redsift-bundler');

// The definitions for this Sift's bundles
var bundles = require('./bundle.config.js');

gulp.task('bundle-js', RSBundler.loadTask(gulp, 'bundle-js', bundles('js')));
gulp.task('bundle-css', RSBundler.loadTask(gulp, 'bundle-css', bundles('css')));

gulp.task('default', ['bundle-js', 'bundle-css'], function() {
  console.log('Bundling complete');
});
