// We need to 'use strict' here because this file isn't compiled with babel
/* eslint strict:0 */
'use strict';

const webpack = require('webpack');
const path = require('path');

// default the environment to development
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const appPath = path.join(__dirname, 'src');
const assetsPath = path.join(__dirname, 'public');
const publicPath = '/';

function getPlugins() {
  // These plugins are used in all environments
  const plugins = [

    // http://webpack.github.io/docs/list-of-plugins.html#occurenceorderplugin
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),

    // http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
    }),
  ];

  // add plugins that should be used only in certain environments
  if (IS_PRODUCTION) {
    // http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
    plugins.push(new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: true,
    }));
  }

  return plugins;
}

function getLoaders() {
  const loaders = [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015', 'stage-0'],
      },
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader',
    },
  ];

  return loaders;
}

function getEntry() {
  const entry = [];
  entry.push(path.join(appPath, 'index.js'));

  return entry;
}

function getOutput() {
  let output;

  // in production, we need a special output object
  if (IS_PRODUCTION) {
    output = {
      path: assetsPath,
      publicPath,
      filename: '[name]-[hash].min.js',
    };
  } else {
    output = {
      path: assetsPath,
      publicPath,
      filename: '[name].js',
    };
  }

  return output;
}

module.exports = {
  // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
  target: NODE_ENV === 'test' ? 'node' : 'web',

  // enable debug and cache in non-production environments
  debug: !IS_PRODUCTION,
  cache: !IS_PRODUCTION,

  // more info: https://webpack.github.io/docs/build-performance.html#sourcemaps
  // more info: https://webpack.github.io/docs/configuration.html#devtool
  devtool: IS_PRODUCTION ? 'source-map' : 'cheap-module-source-map',

  // set to false to see a list of every file being bundled.
  noInfo: true,

  eslint: {
    configFile: './.eslintrc',
  },

  resolve: {
    // defines where the code resides
    root: appPath,

    // lists file types that can have optional extensions
    extensions: ['', '.js'],

    // sets a base dir for imports
    modulesDirectories: ['node_modules', 'src'],
  },

  plugins: getPlugins(),

  module: {
    loaders: getLoaders(),
  },

  entry: getEntry(),

  output: getOutput(),

};
