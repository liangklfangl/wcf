"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loaderUtils = require("loader-utils");
// options:{
//   antd:'antd',
//   jquery:'jQuery'
// }
module.exports = function ReqiurePlusLoader(content) {
  if (this.cacheable) {
    this.cacheable();
  }
  var query = loaderUtils.getOptions(this);
  var requireBucket = [];
  (0, _keys2.default)(query).forEach(function (key) {
    var item = "require(\"" + key + "\")";
    requireBucket.push(item);
  });

  var result = requireBucket.join(";") + ";" + content;
  return result;
};