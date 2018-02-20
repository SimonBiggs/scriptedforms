var webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'angular': './src/vendors/angular.ts',
    'jupyterlab': './src/vendors/jupyterlab.ts',
    'misc-vendors': './src/vendors/misc-vendors.ts',
    'scriptedforms': './src/main.ts'
  },
  output: {
    path: __dirname + '/lib/',
    publicPath: '/scriptedforms/',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
    rules: [      
      {
        test: /\.ts$/, loaders: {
          loader: 'awesome-typescript-loader',
          options: { configFileName: 'tsconfig.json' }
        }
      },
      { test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      { test: /\.(woff|woff2|ttf|eot)$/, use: 'file-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['scriptedforms', 'misc-vendors', 'jupyterlab', 'angular', 'polyfills']
    })
  ]
};
