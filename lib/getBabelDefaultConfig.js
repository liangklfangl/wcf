"use strict";

var _os = require("os");

function getDefaultBabelConfig() {
  var useBabelrc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  var extraBabelPlugins = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var extraBabelPresets = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  // console.log('useBabelrc===='+useBabelrc);
  // useBabelrc的时候用户要手动安装这些插件，然后使用它
  if (useBabelrc) {
    return {
      babelrc: true,
      cacheDirectory: (0, _os.tmpdir)(),
      presets: [require.resolve("babel-preset-react"), require.resolve("babel-preset-env"), require.resolve("babel-preset-stage-0")],
      plugins: [require.resolve("babel-plugin-add-module-exports"), ["import", { libraryName: "antd", style: true }]]
    };
  } else {
    return {
      babelrc: false,
      presets: [require.resolve("babel-preset-env"), require.resolve("babel-preset-react"), require.resolve("babel-preset-stage-0")].concat(extraBabelPresets),
      plugins: [require.resolve("babel-plugin-add-module-exports"), ["import", { "libraryName": "antd", "style": true }], require.resolve("babel-plugin-react-require"), require.resolve("babel-plugin-syntax-dynamic-import")].concat(extraBabelPlugins),
      cacheDirectory: (0, _os.tmpdir)()
    };
  }
}

module.exports = {
  getDefaultBabel: getDefaultBabelConfig
};