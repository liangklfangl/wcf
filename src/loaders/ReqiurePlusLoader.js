"use strict";

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
  Object.keys(query).forEach(key => {
    const item = `require("${key}")`;
    requireBucket.push(item);
  });

  var result = requireBucket.join(";") + ";" + content;
  return result;
};
