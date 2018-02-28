// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.

var path = require('path');
var webpack = require('./webpack.config');

module.exports = function (config) {
  config.set({
    basePath: '.',
    frameworks: ['mocha'],
    reporters: ['mocha'],
    client: {
      mocha: {
        timeout : 10000, // 10 seconds - upped from 2 seconds
        retries: 3 // Allow for slow server on CI.
      }
    },
    plugins: [
      require('karma-chrome-launcher'),
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-firefox-launcher'),
      require('karma-webpack'),
      require('karma-sourcemap-loader')
    ],
    files: [
      {pattern: path.resolve('./build/injector.js'), watched: false},
      {pattern: 'src/*.spec.ts', watched: false}
    ],
    preprocessors: {
      'build/injector.js': ['webpack'],
      'src/*.spec.ts': ['webpack', 'sourcemap']
    },
    mime: {
      'text/x-typescript': ['ts','tsx']
    },
    webpack: webpack,
    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only'
    },
    browserNoActivityTimeout: 31000, // 31 seconds - upped from 10 seconds
    browserDisconnectTimeout: 31000, // 31 seconds - upped from 2 seconds
    browserDisconnectTolerance: 2,
    port: 9876,
    colors: true,
    singleRun: true,
    logLevel: config.LOG_INFO
  });
};