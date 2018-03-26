"use strict";

var _getIterator2 = require("babel-runtime/core-js/get-iterator");

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require("util");

var _require = require("webpack-sources"),
    ConcatSource = _require.ConcatSource;

var ConcatPlugin = function () {
  function ConcatPlugin(options) {
    (0, _classCallCheck3.default)(this, ConcatPlugin);

    this.concatOpt = options || {};
  }

  (0, _createClass3.default)(ConcatPlugin, [{
    key: "apply",
    value: function apply(compiler) {
      var concatOpt = this.concatOpt;
      compiler.plugin("emit", function (compilation, callback) {
        var chunks = compilation.getStats().toJson().chunks;
        var entryChunk = void 0;
        for (var i = 0, len = chunks.length; i < len; i++) {
          var localChunk = chunks[i];
          // https://github.com/liangklfangl/webpack-common-sense
          if (localChunk.entry) {
            entryChunk = localChunk;
            break;
          }
        }
        var istGlobal = "";
        (0, _keys2.default)(concatOpt).forEach(function (key) {
          var concatCt = concatOpt["" + key];
          istGlobal += "window." + key + " = " + concatCt + ";";
        });
        // index.js和index.js.map
        // var source = compilation.assets[filename].source();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(entryChunk.files), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var file = _step.value;

            compilation.assets[file] = new ConcatSource(compilation.assets[file], "\n", istGlobal);
          }
          // 必须调用
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        callback();
      });
    }
  }]);
  return ConcatPlugin;
}();

module.exports = ConcatPlugin;