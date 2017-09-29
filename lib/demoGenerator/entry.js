import ReactDOM from "react-dom";
import React from "react";
const content = require('../demos/basic.md');
const converters = [[function (node) {
  return typeof node === 'function';
}, function (node, index) {
  return React.cloneElement(node(), { key: index });
}]];
//(2)converters可以引入一个库来完成
const JsonML = require('jsonml.js/lib/utils');
const toReactComponent = require('jsonml-to-react-component');

ReactDOM.render(toReactComponent(content.content, converters), document.getElementById('react-content'));