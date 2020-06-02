const HtmlWebPackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: modulePath => /node_modules/.test(modulePath),
        use: [
          {
            loader: 'babel-loader'
          },
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: process.env.NODE_ENV !== 'production'
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          }
        ]
      }, {
        test: /\.mp4$/,
        use: [
          {
            loader: 'file-loader',
            options: { limit: 10000 },
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './public/index.html',
      filename: './index.html'
    }),
    new Dotenv({
      path: './.env',
      safe: true
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    })
  ],
  node: {
    fs: 'empty'
  },
  optimization: {
    minimize: false
  },
  output: {
    publicPath: '/',
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    disableHostCheck: true,
    historyApiFallback: true
  }
};
