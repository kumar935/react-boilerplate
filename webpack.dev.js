const path = require('path');
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ConcatPlugin = require('webpack-concat-plugin');

const PORT = 5555;
const PUBLIC_PATH = `http://localhost:${PORT}/dist/`;
const copyToCDNConfig = {
  langFiles: {
    from: 'src/services/lang',
    to: 'lang'
  }
};
copyToCDNConfigStr = JSON.stringify(copyToCDNConfig);

const extractStyles = (loaders) => {
  if ( process.env.NODE_ENV === 'production') {
    return ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: loaders,
    });
  }
  return ['style-loader', ...loaders];
}


module.exports = {
  context: __dirname,
  entry: [
    'react-hot-loader/patch',
    `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr`,
    'babel-polyfill',
    './src/modules/Main.jsx',
  ],
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    publicPath: PUBLIC_PATH,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  devServer: {
    hot: true
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
        DEV: true,
        version: JSON.stringify(new Date().getTime())
      },
      'cdn': {
        publicPath: JSON.stringify(PUBLIC_PATH),
        paths: JSON.stringify(copyToCDNConfigStr)
      }
    }),
    new Webpack.optimize.ModuleConcatenationPlugin(),
    new Webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new CopyWebpackPlugin(Object.values(copyToCDNConfig)),
    new Webpack.NamedModulesPlugin(),
    new Webpack.HotModuleReplacementPlugin()
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
        use: extractStyles(['css-loader', 'postcss-loader', 'sass-loader'])
      },
      {
        test: /\.css$/,
        use: extractStyles(['css-loader', 'postcss-loader'])
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
