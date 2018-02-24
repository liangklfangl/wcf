const loaderUtils =  require('loader-utils');
const Grob = require('grob-files');
const {p2jsonml} = require('./utils/pc2jsonml');
const transformer = require('./utils/transformer');
const Smangle = require('string-mangle');
const generator = require('babel-generator').default;
const pwd = process.cwd();
const fs = require('fs');
const path = require('path');
const util = require('util');
/**
 *第一个参数是markdown的内容
 */
module.exports = function markdown2htmlPreview (content){
  if (this.cacheable) {
    this.cacheable();
  }
  const loaderIndex = this.loaderIndex;
  //打印this可以得到所有的信息，这里得到md处理文件的loader数组中，当前loader所在的问题
  const query = loaderUtils.getOptions(this);
  const lang = query&&query.lang || 'react-demo';
  const processedjsonml=Smangle.stringify(p2jsonml(content));
  //得到jsonml
  const astProcessed = `module.exports = ${processedjsonml}`;
  const res = transformer(astProcessed,lang);
  const inputAst = res.inputAst;
  const imports = res.imports;
  for (let k = 0; k < imports.length; k++) {
    inputAst.program.body.unshift(imports[k]);
  }
  //We insert `import` before ast. But, if you want to update ast, you need to take care of ImportDeclaration and etc
  const code = generator(inputAst, null, content).code;

 const processedCode= 'const React =  require(\'react\');\n' +
        'const ReactDOM = require(\'react-dom\');\n'+
        code;
  //  fs.writeFile('ast.js',processedCode,()=>{
  //   console.log('ended');
  // })
  // console.log("抽象语法树处理后得到:",util.inspect(processedCode,{showHidden:true,depth:3}));

  return processedCode;
}
