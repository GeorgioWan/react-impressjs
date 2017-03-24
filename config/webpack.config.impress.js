var webpack = require('webpack');
var paths = require('./paths');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var publicPath = '/';

module.exports = {
  entry: [
    //index: paths.componentPath
    //Impress: paths.impressPath,
    //Step: paths.stepPath
    require.resolve('./polyfills'),
    paths.appIndexJs,
  ],
  output: {
    path: paths.appDist,
    pathinfo: true,
    filename: '[name].js',
    publicPath: publicPath
  },
  resolve: {
    fallback: paths.nodePaths,
    extensions: ['.js', '.json', '.jsx', ''],
    alias: {
      'react-native': 'react-native-web'
    }
  },
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: paths.appSrc,
      }
    ],
    loaders: [
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/,
          /\.sass$/,
          /\.scss$/
          
        ],
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        loader: 'babel',
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
      },
      // Scss
      {
        test: /\.s[ac]ss$/,
        include: paths.appSrc,
        loader: ExtractTextPlugin.extract(['css', 'sass'])
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.svg$/,
        loader: 'file',
        query: {
          name: 'static/media/[name].[hash:8].[ext]'
        }
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].css")
  ]
};
