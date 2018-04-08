var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var baseConfig = require('./webpack.config.js');

module.exports = webpackMerge(baseConfig, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
});