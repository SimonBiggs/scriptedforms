var webpack = require('webpack');
var path = require('path');
var exec = require('child_process').exec;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

// function puts(error, stdout, stderr) {
//   console.log(stdout);
// }

// function EchoOnFinishPlugin() { }

// EchoOnFinishPlugin.prototype.apply = function(compiler) {

//   compiler.plugin('after-emit', function(compilation, callback) {
//     exec('echo "\nWebpack build complete"', puts)
//     callback();
//   }.bind(this));
// };


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
    publicPath: '../static/',
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
      { test: /\.svg$/, use: 'svg-url-loader' }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['scriptedforms', 'misc-vendors', 'jupyterlab', 'angular', 'polyfills']
    }),
    new ExtractTextPlugin('[name].css')
    // new EchoOnFinishPlugin()
  ]
};
