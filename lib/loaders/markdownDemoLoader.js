'use strict';

var loaderUtils = require('loader-utils');
var Grob = require('grob-files');

var _require = require('./utils/pc2jsonml'),
    p2jsonml = _require.p2jsonml;

var transformer = require('./utils/transformer');
var Smangle = require('string-mangle');
var generator = require('babel-generator').default;
var pwd = process.cwd();
var fs = require('fs');
var path = require('path');
var util = require('util');
/**
 *第一个参数是markdown的内容
 */
module.exports = function markdown2htmlPreview(content) {
  if (this.cacheable) {
    this.cacheable();
  }
  var loaderIndex = this.loaderIndex;
  //打印this可以得到所有的信息，这里得到md处理文件的loader数组中，当前loader所在的问题
  var query = loaderUtils.getOptions(this);
  var lang = query && query.lang || 'react-demo';
  var processedjsonml = Smangle.stringify(p2jsonml(content));
  //得到jsonml
  var astProcessed = 'module.exports = ' + processedjsonml;
  var res = transformer(astProcessed, lang);
  var inputAst = res.inputAst;
  var imports = res.imports;
  for (var k = 0; k < imports.length; k++) {
    inputAst.program.body.unshift(imports[k]);
  }
  //We insert `import` before ast. But, if you want to update ast, you need to take care of ImportDeclaration and etc
  var code = generator(inputAst, null, content).code;

  var processedCode = 'const React =  require(\'react\');\n' + 'const ReactDOM = require(\'react-dom\');\n' + code;
  //  fs.writeFile('ast.js',processedCode,()=>{
  //   console.log('ended');
  // })
  // console.log("抽象语法树处理后得到:",util.inspect(processedCode,{showHidden:true,depth:3}));

  return processedCode;
};