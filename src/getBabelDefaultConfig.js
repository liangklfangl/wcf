import { tmpdir } from "os";
function getDefaultBabelConfig(
  useBabelrc = false,
  extraBabelPlugins = [],
  extraBabelPresets = []
) {
  // console.log('useBabelrc===='+useBabelrc);
  // useBabelrc的时候用户要手动安装这些插件，然后使用它
  if (useBabelrc) {
    return {
      babelrc: true,
      cacheDirectory: tmpdir(),
      presets: [
        require.resolve("babel-preset-react"),
        require.resolve("babel-preset-env"),
        require.resolve("babel-preset-stage-0")
      ],
      plugins: [
        require.resolve("babel-plugin-add-module-exports"),
        ["import", { libraryName: "antd", style: true }]
      ]
    };
  } else {
    return {
      babelrc: false,
      presets: [
        require.resolve("babel-preset-env"),
        require.resolve("babel-preset-react"),
        require.resolve("babel-preset-stage-0")
      ].concat(extraBabelPresets),
      plugins: [
        require.resolve("babel-plugin-add-module-exports"),
        ["import", { "libraryName": "antd", "style": true }],
        require.resolve("babel-plugin-react-require"),
        require.resolve("babel-plugin-syntax-dynamic-import")
      ].concat(extraBabelPlugins),
      cacheDirectory: tmpdir()
    };
  }
}

module.exports = {
  getDefaultBabel: getDefaultBabelConfig
};
