'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = build;

var _getWebpackDefaultConfig = require('./getWebpackDefaultConfig');

var _getWebpackDefaultConfig2 = _interopRequireDefault(_getWebpackDefaultConfig);

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
  var webpackConfig = {};

  if (program.outputPath) {
    webpackConfig.output.path = program.outputPath;
  }
  //update output path
  if (program.publichPath) {
    webpackConfig.output.publicPath = program.publicPath;
  }
  //update public path
  if (program.compress) {
    webpackConfig.plugins = [].concat(_toConsumableArray(defaultWebpackConfig.plugins), [new webpack.optimize.UglifyJsPlugin({
      output: {
        ascii_only: true
      },
      compress: {
        warnings: false
      }
    }), new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })]);
  } else {
    if (process.env.NODE_ENV) {
      webpackConfig.plugins = [].concat(_toConsumableArray(defaultWebpackConfig.plugins), [new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })]);
    }
  }
  // update our plugins according to user's input compress config
  if (program.hash) {
    var pkg = require(join(program.cwd, 'package.json'));
    webpackConfig.output.filename = webpackConfig.output.chunkFilename = '[name]-[chunkhash].js';
    //we update filename width hash
  }

  if (typeof program.config === 'function') {
    webpackConfig = program.config(webpackConfig) || webpackConfig;
  } else {
    webpackConfig = mergeCustomConfig(webpackConfig, resolve(program.cwd, program.config || 'webpack.config.js'));
  }
  //if config parameter is a function ,invoke it. otherwise merge our custom configuration
  if (program.watch) {
    [webpackConfig].forEach(function (config) {
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
  var compiler = webpack(webpackConfig);
  // Hack: remove extract-text-webpack-plugin log
  if (!program.verbose) {
    compiler.plugin('done', function (stats) {
      stats.stats.forEach(function (stat) {
        //compilation.children是他所有依赖的模块信息
        stat.compilation.children = stat.compilation.children.filter(function (child) {
          return child.name !== 'extract-text-webpack-plugin';
        });
      });
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