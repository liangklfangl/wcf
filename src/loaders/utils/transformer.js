const babylon = require('babylon');
const types = require('babel-types');
const traverse = require('babel-traverse').default;
function parser(content) {
  return babylon.parse(content, {
    sourceType: 'module',
    //sourceType: Indicate the mode the code should be parsed in.
    // Can be either "script" or "module".
    plugins: [
      'jsx',
      'flow',
      'asyncFunctions',
      'classConstructorCall',
      'doExpressions',
      'trailingFunctionCommas',
      'objectRestSpread',
      'decorators',
      'classProperties',
      'exportExtensions',
      'exponentiationOperator',
      'asyncGenerators',
      'functionBind',
      'functionSent',
    ],
    //Array containing the plugins that you want to enable.
  });
}
/**
 * [exports description]
 * @param  {[type]} content [transformed jsonml of markdown file]
 * @param  {[type]} lang    [language we want to transform to]
 * @return {[type]}         [detail jsonml ,http://www.jsonml.org/]
 * We first remove ImportDeclaration and CallExpression, then we construct BlockStatement,returnStatement,functionExpression
 * In one word, we only care about pre tag which refer to code block in markdown file. That is why in browser.js
 * we care about node of function
 */
module.exports = function transformer(content, lang) {
  // const fs = require('fs');
  // fs.writeFile('ast.js',content,()=>{
  //   console.log('ended');
  // })
  let imports = [];
  const inputAst = parser(content);
  //we transform our input to AST
  traverse(inputAst, {
    //Here, our path.node is an array
    ArrayExpression: function(path) {
      const node = path.node;
      const firstItem = node.elements[0];
      //tagName
      const secondItem = node.elements[1];
      //attributes or child element
      let renderReturn;
      if (firstItem &&
        firstItem.type === 'StringLiteral' &&
        firstItem.value === 'pre' &&
        secondItem.properties[0].value.value === lang) {
        //you can use this example to see:https://astexplorer.net/#/tSIO7NIclp/2%E8%A7%A3%E6%9E%90%E5%87%BA%E6%9D%A5%E7%9A%84%E5%B0%B1%E6%98%AF%E6%88%91%E4%BB%AC%E7%9A%84program.body%E9%83%A8%E5%88%86%EF%BC%8C%E4%B9%9F%E5%B0%B1%E6%98%AF%E5%A6%82%E4%B8%8B%E7%9A%84%E5%86%85%E5%AE%B9%EF%BC%9A
        /*
         ["pre",{"lang":"react"},
          ["code",["import css from ./index.js"]]
         ]
         because our pre element has attribute of highlighted, so secondItem is attribute node
         */
        let codeNode = node.elements[2].elements[1];
        let code = codeNode.value;
        //得到代码的内容了，也就是demo的代码内容
        const codeAst = parser(code);
        //继续解析代码内容~~~
        traverse(codeAst, {
          //see https://astexplorer.net/#/tSIO7NIclp/2%E8%A7%A3%E6%9E%90%E5%87%BA%E6%9D%A5%E7%9A%84%E5%B0%B1%E6%98%AF%E6%88%91%E4%BB%AC%E7%9A%84program.body%E9%83%A8%E5%88%86%EF%BC%8C%E4%B9%9F%E5%B0%B1%E6%98%AF%E5%A6%82%E4%B8%8B%E7%9A%84%E5%86%85%E5%AE%B9%EF%BC%9A
          //you can see $node in ImportDeclaration then we remove it
          ImportDeclaration: function(importPath) {
            imports.push(importPath.node);
            importPath.remove();
          },
          //ExpressionStatement->CallExpression->MemberExpression. Detail in https://astexplorer.net/#/tSIO7NIclp/2%E8%A7%A3%E6%9E%90%E5%87%BA%E6%9D%A5%E7%9A%84%E5%B0%B1%E6%98%AF%E6%88%91%E4%BB%AC%E7%9A%84program.body%E9%83%A8%E5%88%86%EF%BC%8C%E4%B9%9F%E5%B0%B1%E6%98%AF%E5%A6%82%E4%B8%8B%E7%9A%84%E5%86%85%E5%AE%B9%EF%BC%9A
          CallExpression: function(CallPath) {
            const CallPathNode = CallPath.node;
            if (CallPathNode.callee &&
              CallPathNode.callee.object &&
              CallPathNode.callee.object.name === 'ReactDOM' &&
              CallPathNode.callee.property &&
              CallPathNode.callee.property.name === 'render') {
              //we focus on ReactDOM.render method
              renderReturn = types.returnStatement(
                 CallPathNode.arguments[0]
              );
              //we focus on first parameter of ReactDOM.render method
              CallPath.remove();
            }
          },
        });
        //End of traverse of codeAst, `import` and `ReactDOM.render` are all removed, only
        //a part of demo code remained!
        const astProgramBody = codeAst.program.body;
        //program.body are updated through previous manipulation
        const codeBlock = types.BlockStatement(astProgramBody);
        // ReactDOM.render always at the last of preview method
        if (renderReturn) {
          astProgramBody.push(renderReturn);
        }
        //program.body is an array, so we can push returnStatement to the end of array
        const coceFunction = types.functionExpression(
          types.Identifier('jsonmlReactLoader'),
          //here is an Identifier of function
          [],
          codeBlock
          //Even though `import` or 'ReactDOM.render' are removed, but
          // <program><codeBlock></codeBlock><returnStatement><returnStatement/></program>
        );
        path.replaceWith(coceFunction);
        //ArrayExpression are updated with coceFunction AST Object.
        //So, pre tagName will be replaced by a jsonmlReactLoader function
      }
    },
    //End of Array Expression
  });

  return {
    imports: imports,
    inputAst: inputAst,
    //inputAst is proccessed ast of pre tag
  };
};
