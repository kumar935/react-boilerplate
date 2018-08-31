const express = require('express');
const bodyParser = require('body-parser');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');

const app = express();
const config = require('./webpack.dev.js');
const PORT = config.output.publicPath.split('/')[2].split(':')[1];

const compiler = webpack(config);

function ensureDirectoryExistence(filePath) {
  console.log(filePath);
  var dirname = path.dirname(filePath);
  console.log(dirname);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// without this fonts/icons.woff call was restricted by CORS.
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods','GET,POST');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Access-Control-Allow-Origin, Content-Type');
  next();
});
app.use(bodyParser.json());
app.use('/dist', express.static('dist'));

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}));

app.use(require("webpack-hot-middleware")(compiler, {
  log: console.log, path: '/__webpack_hmr', heartbeat: 10 * 1000
}));

app.post('/update-stub/*', (req, res) => {
  var body = req.body;
  var urlArr = `${req.url}.res`.split('/');
  urlArr.shift();
  urlArr[0]='stubs';
  var filePath = urlArr.join('/');
  ensureDirectoryExistence(filePath);
  fs.writeFile(filePath, JSON.stringify(body, null, "\t"));
  res.end();
});

// both get and post requests
app.all('/stubs/*', (req, res) => {
  const data = fs.readFileSync(`${req.url}.res`.slice(1)); // slice(1) to remove the first '/' readFile path doesn't work with path like '/abc/xyz'
  res.jsonp(JSON.parse(data.toString()));
});


app.get('/*', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

// clean dist folder
rimraf.sync('dist');
console.log('cleaned dist folder');

// Serve the files on port 6000.
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!\n`);
});
