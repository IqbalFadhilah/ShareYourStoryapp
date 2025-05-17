const common = require('./webpack.common.js')
const { merge } = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin') // Tambahkan ini
const path = require('path')

module.exports = merge(common, {
  mode: 'production',
  output: {
    publicPath: '/ShareYourStoryapp/',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    // Tambahkan plugin ini
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public/app.webmanifest'),
          to: 'app.webmanifest'
        },
        {
          from: path.resolve(__dirname, '../scripts/sw.js'),
          to: 'sw.js'
        },
        {
          from: path.resolve(__dirname, '../public/images'),
          to: 'images'
        }
      ]
    })
  ]
})