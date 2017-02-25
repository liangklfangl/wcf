'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = build;

var _getWebpackDefaultConfig = require('./getWebpackDefaultConfig');

var _getWebpackDefaultConfig2 = _interopRequireDefault(_getWebpackDefaultConfig);

var _mergeWebpackConfig = require('./mergeWebpackConfig');

var _mergeWebpackConfig2 = _interopRequireDefault(_mergeWebpackConfig);

var _path = require('path');

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _statsWebpackPlugin = require('stats-webpack-plugin');

var _statsWebpackPlugin2 = _interopRequireDefault(_statsWebpackPlugin);

var _dllplugindync = require('dllplugindync');

var _dllplugindync2 = _interopRequireDefault(_dllplugindync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/** 
 * @param  {[type]} 
 * @param  {Function} 
 * @return {[type]}
 */
function build(program, callback) {
  var defaultWebpackConfig = (0, _getWebpackDefaultConfig2.default)(program);
  //get default webpack configuration
  if (program.outputPath) {
    defaultWebpackConfig.output.path = program.outputPath;
  }
  //update output path
  if (program.publichPath) {
    defaultWebpackConfig.output.publicPath = program.publicPath;
  }
  //update public path
  if (program.stj) {
    defaultWebpackConfig.plugins.push(new _statsWebpackPlugin2.default(program.stj, {
      //options passed to stats.json
    }));
  }

  //we inject DllReferencePlugin
  if (program.manifest) {
    defaultWebpackConfig.plugins.push(new _dllplugindync2.default({
      manifest: program.manifest,
      context: program.cwd
    }));
  }
  if (!program.dev) {
    //https://github.com/mishoo/UglifyJS2
    defaultWebpackConfig.plugins = [].concat(_toConsumableArray(defaultWebpackConfig.plugins), [new _webpack2.default.optimize.UglifyJsPlugin({
      beautify: false,
      sourceMap: true,
      // use SourceMaps to map error message locations to modules. 
      //This slows down the compilation. (default: true)
      comments: false,
      //Defaults to preserving comments containing /*!, /**!, @preserve or @license.
      output: {
        ascii_only: true
      },
      compress: {
        warnings: false,
        //no warnings when remove unused code,
        drop_console: true,
        //drop console
        collapse_vars: true,
        //Collapse single-use var and const definitions when possible.
        reduce_vars: true
      }
    }), new _webpack2.default.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })]);
  } else {
    if (process.env.NODE_ENV) {
      defaultWebpackConfig.plugins = [].concat(_toConsumableArray(defaultWebpackConfig.plugins), [new _webpack2.default.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })]);
    }
  }

  if (typeof program.config === 'function') {
    defaultWebpackConfig = program.config(defaultWebpackConfig) || defaultWebpackConfig;
  } else {
    defaultWebpackConfig = (0, _mergeWebpackConfig2.default)(defaultWebpackConfig, (0, _path.resolve)(program.cwd, program.config || 'webpack.config.js'));
  }
  var compiler = (0, _webpack2.default)(defaultWebpackConfig);
  //we watch file change
  if (program.watch) {
    compiler.watch(program.watch || 200, doneHandler.bind(program));
  } else {
    compiler.run(doneHandler.bind(program));
  }
}

function doneHandler(err, stats) {
  //!! there an error attr in stats object, you can look through it to get the compile information
  console.log('resource rebuilt', stats);
}
module.exports = exports['default'];