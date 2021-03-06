'use strick'
let path = require('path')
let webpack = require('webpack')
let ExtractTextPlugin = require("extract-text-webpack-plugin")
module.exports = {
  entry: {
    // 入口文件
    app: './src/client/app.js'
  },
  output: {
    // 输出目录
    path: path.resolve(__dirname, '../dist/static'),
    publicPath: '/static/',
    filename: '[name].min.js',
    chunkFilename: "[name].min.js"
  },
  resolveLoader: {
    root: path.join(__dirname, 'node_modules')
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'react-hot!babel?presets[]=react'
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader')
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.(png|jpg|gif|svg|ttf)$/,
      loader: 'url',
      query: {
        limit: 10000
      }
    }]
  },
  plugins: [
    new ExtractTextPlugin("[name].[contenthash].css", {
      allChunks: true,
      disable: false
    })
  ]
}
