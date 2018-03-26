"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

exports.default = webpackWatch;

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _stripAnsi = require("strip-ansi");

var _stripAnsi2 = _interopRequireDefault(_stripAnsi);

var _chokidar = require("chokidar");

var _chokidar2 = _interopRequireDefault(_chokidar);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require('util');
function webpackWatch(defaultWebpackConfig, program, callback) {
  //指定了demo的markdown文件地址
  if (program.demo) {
    defaultWebpackConfig.entry = _path2.default.join(process.cwd(), program.demo);
    // console.log('defaultWebpackConfig========>demo',util.inspect(defaultWebpackConfig,{showHidden:true,depth:3}));
    var _compiler = (0, _webpack2.default)(defaultWebpackConfig);
    _compiler.run(doneHandler.bind(program));
    return;
  }
  var compiler = (0, _webpack2.default)(defaultWebpackConfig);
  var watching = null;
  var customWebpackPath = program.config && (0, _typeof3.default)(program.config) !== "object" ? _path2.default.resolve(program.cwd, program.config) : "";
  //we watch file change, so if entry file configured in package.json changed, it will
  //compile automatically. And also we watch file of custom webpack.config.js for changes!
  if (program.watch) {
    var delay = typeof program.watch === "number" ? program.watch : 200;
    watching = compiler.watch(delay, doneHandler.bind(program));
    if (customWebpackPath && (0, _fs.existsSync)(customWebpackPath)) {
      _chokidar2.default.watch(customWebpackPath).on('change', function () {
        console.log('You must restart to compile because configuration file changed!');
        process.exit(0);
        //We must exit because configuration file changed!
      });
    }
  } else {
    compiler.run(function doneHandler(err, stats) {
      //get all errors
      if (stats.hasErrors()) {
        printErrors(stats.compilation.errors, true);
        return;
      }
      var warnings = stats.warnings && stats.warnings.length == 0;
      if (stats.hasWarnings()) {
        printErrors(stats.compilation.warnings);
        return;
      }
      callback(null, stats);
      console.log("Compilation finished!\n");
    });
  }
  return compiler;
}

/**
 * [doneHandler Deal with warnings/errors of compilation and ignore all info]
 * @param  {[type]} err   [description]
 * @param  {[type]} stats [description]
 * @return {[type]}       [description]
 */
function doneHandler(err, stats) {
  //get all errors
  if (stats.hasErrors()) {
    printErrors(stats.compilation.errors, true);
    return;
  }
  var warnings = stats.warnings && stats.warnings.length == 0;
  if (stats.hasWarnings()) {
    printErrors(stats.compilation.warnings);
    return;
  }
  callback(null, stats);
  console.log("Compilation finished!\n");
}
/**
 * [printErrors log errors of compilation]
 * @param  {[type]} errors [description]
 * @return {[type]}        [description]
 */
function printErrors(errors) {
  var isError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  console.log("Compilation Errors or Warnings as follows:\n");
  var strippedErrors = errors.map(function (error) {
    return (0, _stripAnsi2.default)(error);
  });
  for (var i = 0; i < strippedErrors.length; i++) {
    isError ? console.error(strippedErrors[i]) : console.warn(strippedErrors[i]);
  }
}
module.exports = exports['default'];