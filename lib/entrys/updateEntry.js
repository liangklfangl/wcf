"use strict";

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createDomain = require("./createDomain");

module.exports = function addDevServerEntrypoints(webpackOptions, devServerOptions) {
  if (devServerOptions.inline !== false) {
    var domain = createDomain(devServerOptions);
    // const devClient = [`${require.resolve("../../client/")}?${domain}`];
    var devClient = [require.resolve("wds-hack") + "?" + domain];
    if (devServerOptions.hotOnly) devClient.push("webpack/hot/only-dev-server");else if (devServerOptions.hot) devClient.push("webpack/hot/dev-server");
    [].concat(webpackOptions).forEach(function (wpOpt) {
      if ((0, _typeof3.default)(wpOpt.entry) === "object" && !Array.isArray(wpOpt.entry)) {
        (0, _keys2.default)(wpOpt.entry).forEach(function (key) {
          wpOpt.entry[key] = devClient.concat(wpOpt.entry[key]);
        });
      } else {
        wpOpt.entry = devClient.concat(wpOpt.entry);
      }
    });
  }
};