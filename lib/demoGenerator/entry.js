"use strict";

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var content = require('../../demos/basic.md');
var converters = [[function (node) {
  return typeof node === 'function';
}, function (node, index) {
  return _react2.default.cloneElement(node(), { key: index });
}]];
//(2)converters可以引入一个库来完成
var JsonML = require('jsonml.js/lib/utils');
var toReactComponent = require('jsonml-to-react-component');
_reactDom2.default.render(toReactComponent(content.content, converters), document.getElementById('react-content'));