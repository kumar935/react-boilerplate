const webpack = require('webpack');
const WebpackStrip = require('strip-loader');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

//global.DEBUG is set in tasks.js
const isDev = global.DEBUG === false ? false : !process.argv.includes('--release');
const isProduction = !isDev;
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');

const DEV_LOCAL_STATIC_URL = 'http://localhost:2304/dist/';
const PROD_REMOTE_CDN_URL = 'http://vulcan-olpite.unicommerce.info/OLPCUSTTRACKITE/dist/';
const DEST_CSS_FILE_NAME = 'dist.css';
const jsLoaders = isProduction ? ['babel', WebpackStrip.loader('debug', 'console.log')] : ['babel'];

const config = {
  context: __dirname,
  entry: [
    './index.js'
  ],
  output: {
    path: __dirname + "/dist/",
    filename: 'bundle.js',
    publicPath: isDev ? DEV_LOCAL_STATIC_URL : PROD_REMOTE_CDN_URL
  },
  devtool: isDev ? '#source-map' : false,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loaders: jsLoaders
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css!sass')
      },
      {
        /* to load svg icons or font-awesome icons as fonts */
        test: /\.font\.(js|json)$/,
        loader: 'style!css!fontgen?embed'
      },
      {
        /* This url-loader is also used by fontgen to embed icon fonts
         * (e.g. svg icons to font),
         * and also used to load character fonts
         * (e.g. ttf font files that are used in @font-face declarations)
         * The 10kb limit doesn't affect the fontgen embed functionality
         * As for the ttf font files are larger that 10kb, it's not embedded in the css file, and is generated in the dist folder */
        test: /\.(woff|eot|ttf|svg)$/,
        loader: 'url?limit=10000'
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/,
        loader: 'url?limit=10000',
      }
    ],

  },
  plugins: [
    new ExtractTextPlugin(DEST_CSS_FILE_NAME),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDev ? '"development"' : '"production"',
      __DEV__: isDev
    })
  ],
  devServer: {
    colors: true,
    historyApiFallback: true,
    inline: true
  }
};

// Optimize the bundle in release (production) mode
if (isProduction) {
  config.plugins.push(new webpack.optimize.DedupePlugin());
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({compress: {warnings: isVerbose}}));
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

module.exports = config;
