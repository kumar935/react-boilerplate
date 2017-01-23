const webpack = require('webpack');
const del = require('del');
const fs = require('fs');
const tasks = new Map(); // The collection of automation tasks ('clean', 'build', 'start', etc.)

const DEFAULT_PORT = 2304;

function run(task) {
  const start = new Date();
  console.log(`Starting '${task}'...`);
  return Promise.resolve().then(() => tasks.get(task)()).then(() => {
    console.log(`Finished '${task}' after ${new Date().getTime() - start.getTime()}ms`);
  }, err => console.error(err.stack));
}


// Clean up the output directory
// -----------------------------------------------------------------------------
tasks.set('clean', () => del(['dist/*', '!dist/.git'], { dot: true }));

// Add modernizr file
// -----------------------------------------------------------------------------
tasks.set('add-modernizr', () => {
  const modernizr = require('modernizr');
  modernizr.build({
    "minify": true,
    "options": [],
    "feature-detects": [
      "test/websockets"
    ]
  }, function (result) {
    fs.writeFile("./modernizr.js", result, function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("Modernizr added.");
    });
  });
});

// Bundle JavaScript, CSS and image files with Webpack
// -----------------------------------------------------------------------------
tasks.set('bundle', () => {
  const webpackConfig = require('./webpack.config');
  return new Promise((resolve, reject) => {
    webpack(webpackConfig).run((err, stats) => {
      if (err) {
        reject(err);
      } else {
        console.log(stats.toString(webpackConfig.stats));
        resolve();
      }
    });
  });
});

// Build website into a distributable format
// -----------------------------------------------------------------------------
tasks.set('build', () => {
  global.DEBUG = process.argv.includes('--debug') || false;
  return Promise.resolve()
    .then(() => run('clean'))
    .then(() => run('add-modernizr'))
    .then(() => run('bundle'))
});

// Start a local express server to server js and css files for development
// -----------------------------------------------------------------------------
tasks.set('server', () => {
  // ## source: https://github.com/glenjamin/webpack-hot-middleware
  var http = require('http');
  var express = require('express');
  var app = express();
  app.use(require('morgan')('short'));

  //without this fonts/icons.woff call was restricted by CORS.
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });

  app.use('/dist', express.static('dist'));

  (function() {
    var webpack = require('webpack');
    var webpackConfig = require(process.env.WEBPACK_CONFIG ? process.env.WEBPACK_CONFIG : './webpack.config');
    var compiler = webpack(webpackConfig);
    app.use(require("webpack-dev-middleware")(compiler, {
      noInfo: false, publicPath: webpackConfig.output.publicPath
    }));
  })();

  app.get("/*", function(req, res) {
    res.sendFile(__dirname + '/index.html');
  });
  if (require.main === module) {
    var server = http.createServer(app);
    server.listen(process.env.PORT || DEFAULT_PORT, function() {
      console.log("Listening on %j", server.address());
    });
  }
});

tasks.set('start', () => {
  return Promise.resolve()
    .then(() => run('clean'))
    .then(() => run('add-modernizr'))
    .then(() => run('server'))
});

// Execute the specified task or default one. E.g.: node run build
run(/^\w/.test(process.argv[2] || '') ? process.argv[2] : 'start' /* default */);