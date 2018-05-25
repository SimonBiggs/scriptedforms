var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'angular': './src/vendors/angular.ts',
    'jupyterlab': './src/vendors/jupyterlab.ts',
    'misc': './src/vendors/misc.ts',
    'scriptedforms': './src/main.ts'
  },
  output: {
    path: __dirname + '/lib/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [   
      {
        test: /\.ts$/, 
        loaders: [
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: 'tsconfig.json' }
          },
          'angular2-template-loader'
        ]
      },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(woff|woff2|ttf|eot)$/, use: 'file-loader' },
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['scriptedforms', 'misc', 'jupyterlab', 'angular', 'polyfills']
    }),
    new ExtractTextPlugin('[name].css')
  ]
};
