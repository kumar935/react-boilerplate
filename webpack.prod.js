const path = require('path');
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ConcatPlugin = require('webpack-concat-plugin');

const copyToCDNConfig = {
  langFiles: {
    from: 'src/services/lang',
    to: 'lang'
  }
};
const timestamp = new Date().getTime();
copyToCDNConfigStr = JSON.stringify(copyToCDNConfig);
process.env.NODE_ENV = 'production';

module.exports = function(env) {
  return {
    context: __dirname,
    entry: [
      'babel-polyfill',
      './src/modules/Main.jsx',
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].bundle.js',
      chunkFilename: '[name].[chunkhash].chunk.js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    stats: {
      colors: true,
      reasons: true,
      chunks: true,
    },
    plugins: [
      new Webpack.NamedModulesPlugin(),
      new ExtractTextPlugin('style.css'),
      new Webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': JSON.stringify('production'),
          'version': JSON.stringify(timestamp),
          'timestamp': JSON.stringify(timestamp),
          'version_no': JSON.stringify(env.VERSION_NO)
        },
        'cdn': {
          publicPath: JSON.stringify('/'),
          paths: JSON.stringify(copyToCDNConfigStr)
        }
      }),
      new Webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        sourceMap: true,
        output: {
          comments: false
        }
      }),
      new Webpack.optimize.ModuleConcatenationPlugin(),
      new Webpack.optimize.AggressiveMergingPlugin(),
      new Webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
      new CopyWebpackPlugin(Object.keys(copyToCDNConfig).map(e => copyToCDNConfig[e])),
      new ConcatPlugin({
        uglify: true,
        sourceMap: false,
        name: 'fingerprint',
        fileName: '[name].js',
        filesToConcat: [
          './node_modules/fingerprintjs2/dist/fingerprint2.min.js',
          './src/modules/Fingerprint.js'
        ],
        attributes: {
          async: true
        }
      }),
      () => {
        console.log("####################### Version: ", env.VERSION_NO);
        console.log("####################### timestamp: ", timestamp);
        try{
          require("fs").writeFileSync(
            path.join(__dirname, "dist/build.json"),
            JSON.stringify({
              timestamp: timestamp,
              version: timestamp,
              version_no: env.VERSION_NO
            }));
        } catch (e) {
          console.log(e)
        }
      }
    ],
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.jsx?$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              { loader: 'css-loader', options: { minimize: true } },
              'postcss-loader',
              'sass-loader'
            ],
            publicPath: ''
          }),
        },
        {
          test: /\.(woff|woff2|eot|ttf|svg)$/,
          loader: 'file-loader?name=[name].[hash].[ext]',
        },
        {
          test: /\.(jpg|jpeg)$/,
          loader: 'file-loader?name=[name].[ext]',
        },
        {
          test: /\.(gif|png)$/,
          loader: 'url-loader?name=[name].[ext]',
        },
        {
          test: /\.(ico)$/,
          loader: 'file-loader?limit=1000&name=[name].[ext]',
        },
      ],
    },
  };
}
