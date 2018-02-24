'use strict';

var markTwain = require('mark-twain');
var path = require('path');
/**
 * 转化为jsonml
 * @param  {[type]} filename    [description]
 * @param  {[type]} fileContent [description]
 * @return {[type]}             [description]
 */
function p2jsonml(fileContent) {
  var markdown = markTwain(fileContent);
  return markdown;
};

module.exports = {
  p2jsonml: p2jsonml
};