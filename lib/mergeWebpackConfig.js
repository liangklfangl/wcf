'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = mergeCustomConfig;

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mergeCustomConfig(webpackConfig, customConfigPath) {
  if (!(0, _fs.existsSync)(customConfigPath)) {
    return webpackConfig;
  }
  var customConfig = require(customConfigPath);
  if (typeof customConfig === 'function') {
    return customConfig.apply(undefined, [webpackConfig].concat((0, _toConsumableArray3.default)([].concat(Array.prototype.slice.call(arguments)).slice(2))));
  }

  throw new Error('Return of ' + customConfigPath + ' must be a function.');
}
module.exports = exports['default'];