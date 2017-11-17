import { tmpdir } from "os";
/**
 * @return {[type]}
 */
function getDefaultBabelConfig() {
  return {
    cacheDirectory: tmpdir(),
    //We must set!
    presets: [
      require.resolve('babel-preset-react'),
      // require.resolve('babel-preset-es2015'),
      //这个必须去掉,不去掉也可以，通过如下方法方式,不转换class
      // [require.resolve("babel-preset-es2015"), { "modules": false }],
      // [require.resolve("babel-preset-es2015")],
      //压缩class了
      //http://babeljs.io/docs/plugins/minify-dead-code-elimination/
      require.resolve('babel-preset-stage-0'),
    ],
    plugins: [
      // require.resolve("babel-plugin-transform-es2015-template-literals"),
      // require.resolve("babel-plugin-transform-es2015-literals"),
      // require.resolve("babel-plugin-transform-es2015-function-name"),
      // require.resolve("babel-plugin-transform-es2015-arrow-functions"),
      // require.resolve("babel-plugin-transform-es2015-block-scoped-functions"),
      // require.resolve("babel-plugin-transform-es2015-classes"),
      //需要在class未被转换为ES5的情况下就进行DCE，具体来说，就是去掉babel-preset-es2015中的babel-plugin-transform-es2015-classes
      // require.resolve("babel-plugin-transform-es2015-object-super"),
      // require.resolve("babel-plugin-transform-es2015-shorthand-properties"),
      // require.resolve("babel-plugin-transform-es2015-computed-properties"),
      // require.resolve("babel-plugin-transform-es2015-for-of"),
      // require.resolve("babel-plugin-transform-es2015-sticky-regex"),
      // require.resolve("babel-plugin-transform-es2015-unicode-regex"),
      // require.resolve("babel-plugin-syntax-object-rest-spread"),
      // require.resolve("babel-plugin-transform-es2015-parameters"),
      // require.resolve("babel-plugin-transform-es2015-destructuring"),
      // require.resolve("babel-plugin-transform-es2015-block-scoping"),
      // require.resolve("babel-plugin-transform-es2015-typeof-symbol"),
      // [
      //   require.resolve("babel-plugin-transform-regenerator"),
      //   { async: false, asyncGenerators: false }
      // ],
      // require.resolve("babel-plugin-add-module-exports"),
      //它是为了支持错误的import/export方法而存在的，而这现在是由webpack2接管的
      // require.resolve("babel-plugin-check-es2015-constants"),
      // require.resolve("babel-plugin-syntax-async-functions"),
      // require.resolve("babel-plugin-syntax-async-generators"),
      // require.resolve("babel-plugin-syntax-class-constructor-call"),
      // require.resolve("babel-plugin-syntax-class-properties"),
      // require.resolve("babel-plugin-syntax-decorators"),
      // require.resolve("babel-plugin-syntax-do-expressions"),
      // require.resolve("babel-plugin-syntax-dynamic-import"),
      // require.resolve("babel-plugin-syntax-exponentiation-operator"),
      // require.resolve("babel-plugin-syntax-export-extensions"),
      // require.resolve("babel-plugin-syntax-flow"),
      // require.resolve("babel-plugin-syntax-function-bind"),
      // require.resolve("babel-plugin-syntax-jsx"),
      // require.resolve("babel-plugin-syntax-trailing-function-commas"),
      // require.resolve("babel-plugin-transform-async-generator-functions"),
      // require.resolve("babel-plugin-transform-async-to-generator"),
      // require.resolve("babel-plugin-transform-class-constructor-call"),
      // require.resolve("babel-plugin-transform-class-properties"),
      // require.resolve("babel-plugin-transform-decorators"),
      // require.resolve("babel-plugin-transform-decorators-legacy"),
      // require.resolve("babel-plugin-transform-do-expressions"),
      // require.resolve("babel-plugin-transform-es2015-duplicate-keys"),
      // require.resolve("babel-plugin-transform-es2015-modules-amd"),
      // require.resolve("babel-plugin-transform-es2015-modules-commonjs"),
      // require.resolve("babel-plugin-transform-es2015-modules-umd"),
      //去掉三个插件，采用ES6静态模块策略
      // require.resolve("babel-plugin-transform-es2015-spread"),
      // require.resolve("babel-plugin-transform-exponentiation-operator"),
      // require.resolve("babel-plugin-transform-export-extensions"),
      // require.resolve("babel-plugin-transform-flow-strip-types"),
      // require.resolve("babel-plugin-transform-function-bind"),
      // require.resolve("babel-plugin-transform-object-assign"),
      // require.resolve("babel-plugin-transform-object-rest-spread"),
      // require.resolve("babel-plugin-transform-proto-to-assign"),
      // require.resolve("babel-plugin-transform-react-display-name"),
      // require.resolve("babel-plugin-transform-react-jsx"),
      // require.resolve("babel-plugin-transform-react-jsx-source"),
      // require.resolve("babel-plugin-transform-runtime"),
      // require.resolve("babel-plugin-transform-strict-mode")
    ]
  };
}

module.exports = {
  getDefaultBabel: getDefaultBabelConfig
};
