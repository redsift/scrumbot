/* globals __dirname */

'use strict';

const webpack = require('webpack'),
  path = require('path');

module.exports = {
  cache: true,
  devtool: 'source-map',
  entry: {
    controller: ['./src/scripts/controller.js'],
    view: ['./src/scripts/view.js'],
  },
  output: {
    filename: '[name].umd-es2015.min.js',
    path: path.join(__dirname, 'public', 'dist', 'js'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    // NOTE: To utilize tree shaking we set 'module' and 'jsnext:main' entry points
    // before the (typically) bundled entrypoints 'browser' and 'main'. If you use a
    // package from within 'node_modules' which defines 'module' and 'jsnext:main'
    // because it supports ES modules but also needs to be transpiled to ES5 compatible
    // code make sure to add it to the 'module.rules.include' section below
    // (e.g. as with 'node_modules/@redsift').
    mainFields: ['jsnext:main', 'module', 'browser', 'main'],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    // new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/@redsift'),
        ],
        use: {
          loader: 'babel-loader?cacheDirectory',
        }
      }            
    ],
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  }
};