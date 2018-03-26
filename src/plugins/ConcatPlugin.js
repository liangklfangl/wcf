const util = require("util");
const { ConcatSource } = require("webpack-sources");

class ConcatPlugin {
  constructor(options) {
    this.concatOpt = options || {};
  }
  apply(compiler) {
    const concatOpt = this.concatOpt;
    compiler.plugin("emit", function(compilation, callback) {
      const chunks = compilation.getStats().toJson().chunks;
      let entryChunk;
      for (let i = 0, len = chunks.length; i < len; i++) {
        const localChunk = chunks[i];
        // https://github.com/liangklfangl/webpack-common-sense
        if (localChunk.entry) {
          entryChunk = localChunk;
          break;
        }
      }
      let istGlobal = "";
      Object.keys(concatOpt).forEach(function(key) {
        let concatCt = concatOpt["" + key];
        istGlobal += "window." + key + " = " + concatCt + ";";
      });
      // index.js和index.js.map
      // var source = compilation.assets[filename].source();
      for (const file of entryChunk.files) {
        compilation.assets[file] = new ConcatSource(
          compilation.assets[file],
          "\n",
          istGlobal
        );
      }
      // 必须调用
      callback();
    });
  }
}

module.exports = ConcatPlugin;
