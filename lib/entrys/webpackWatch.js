"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackWatch;

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _stripAnsi = require("strip-ansi");

var _stripAnsi2 = _interopRequireDefault(_stripAnsi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [webpackWatch Receive webpack default configuration]
 * @param  {[type]} defaultWebpackConfig [description]
 * @return {[type]}                      [description]
 */
function webpackWatch(defaultWebpackConfig, program) {
  var compiler = (0, _webpack2.default)(defaultWebpackConfig);
  //we watch file change
  if (program.watch) {
    compiler.watch(program.watch || 200, doneHandler.bind(program));
  } else {
    compiler.run(doneHandler.bind(program));
  }
}

/**
 * [doneHandler Deal with info of compilation]
 * @param  {[type]} err   [description]
 * @param  {[type]} stats [description]
 * @return {[type]}       [description]
 */
function doneHandler(err, stats) {
  var errors = stats.errors || stats.errors.length === 0;
  //get all errors
  if (!errors) {
    printErrors(stats.errors, true);
  }
  var warnings = stats.warnings || stats.warnings.length == 0;
  if (!warnings) {
    printErrors(stats.warnings);
  }
}
/**
 * [printErrors log errors of compilation]
 * @param  {[type]} errors [description]
 * @return {[type]}        [description]
 */
function printErrors(errors) {
  var isError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var strippedErrors = errors.map(function (error) {
    return (0, _stripAnsi2.default)(error);
  });
  for (var i = 0; i < strippedErrors.length; i++) {
    isErro ? console.error(strippedErrors[i]) : console.warn(strippedErrors[i]);
  }
}
module.exports = exports['default'];