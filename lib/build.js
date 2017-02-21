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
  if (program.compress) {
    defaultWebpackConfig.plugins = [].concat(_toConsumableArray(defaultWebpackConfig.plugins), [new _webpack2.default.optimize.UglifyJsPlugin({
      output: {
        ascii_only: true
      },
      compress: {
        warnings: false
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
  // update our plugins according to user's input compress config
  if (program.hash) {
    var pkg = require(join(program.cwd, 'package.json'));
    defaultWebpackConfig.output.filename = defaultWebpackConfig.output.chunkFilename = '[name]-[chunkhash].js';
    //we update filename width hash
  }

  if (typeof program.config === 'function') {
    defaultWebpackConfig = program.config(defaultWebpackConfig) || defaultWebpackConfig;
  } else {
    defaultWebpackConfig = (0, _mergeWebpackConfig2.default)(defaultWebpackConfig, (0, _path.resolve)(program.cwd, program.config || 'webpack.config.js'));
  }
  //if config parameter is a function ,invoke it. otherwise merge our custom configuration
  if (program.watch) {
    [defaultWebpackConfig].forEach(function (config) {
      config.plugins.push(new ProgressPlugin(function (percentage, msg) {
        var stream = process.stderr;
        if (stream.isTTY && percentage < 0.71) {
          stream.cursorTo(0);
          stream.write('\uD83D\uDCE6  ' + chalk.magenta(msg));
          stream.clearLine(1);
        } else if (percentage === 1) {
          console.log(chalk.green('\nwebpack: bundle build is now finished.'));
        }
      }));
    });
  }

  console.log("defaultdefaultWebpackConfig------->", defaultWebpackConfig);

  var compiler = (0, _webpack2.default)(defaultWebpackConfig);
  // Hack: remove extract-text-webpack-plugin log
  if (!program.verbose) {
    compiler.plugin('done', function (stats) {
      console.log('stats', stats);

      // stats.stats.forEach((stat) => {
      //   //compilation.children是他所有依赖的模块信息
      //   stat.compilation.children = stat.compilation.children.filter((child) => {
      //     return child.name !== 'extract-text-webpack-plugin';
      //   });
      // });
    });
  }
  //we watch file change
  if (program.watch) {
    compiler.watch(program.watch || 200, doneHandler.bind(this));
  } else {
    compiler.run(doneHandler.bind(this));
  }
}

function doneHandler(err, stats) {
  console.log('resource rebuilt');
}
module.exports = exports['default'];