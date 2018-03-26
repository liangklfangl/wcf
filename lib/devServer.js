"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bundleWDevServer;

var _Server = require("webpack-dev-server/lib/Server");

var _Server2 = _interopRequireDefault(_Server);

var _opn = require("opn");

var _opn2 = _interopRequireDefault(_opn);

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _updateEntry = require("./entrys/updateEntry");

var _updateEntry2 = _interopRequireDefault(_updateEntry);

var _createDomain = require("./entrys/createDomain");

var _createDomain2 = _interopRequireDefault(_createDomain);

var _chokidar = require("chokidar");

var _chokidar2 = _interopRequireDefault(_chokidar);

var _prompt = require("react-dev-utils/prompt");

var _prompt2 = _interopRequireDefault(_prompt);

var _openBrowser = require("react-dev-utils/openBrowser");

var _openBrowser2 = _interopRequireDefault(_openBrowser);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var util = require("util");
var path = require("path");
var fs = require("fs");
var detect = require("detect-port");
var execSync = require("child_process").execSync;
var devServerOpt = {};
var DEFAULT_PORT = 8080;

function colorInfo(useColor, msg) {
  if (useColor)
    // Make text blue and bold, so it *pops*
    return "\x1B[1m\x1B[34m" + msg + "\x1B[39m\x1B[22m";
  return msg;
}

function colorError(useColor, msg) {
  if (useColor)
    // Make text red and bold, so it *pops*
    return "\x1B[1m\x1B[31m" + msg + "\x1B[39m\x1B[22m";
  return msg;
}
/**
 * [bundleWDevServer We start devServer]
 * @param  {[type]} defaultWebpackConfig [description]
 * @return {[type]}                      [description]
 */
function bundleWDevServer(defaultWebpackConfig, program) {
  // console.log('defaultWebpackConfig的值为==='+JSON.stringify(defaultWebpackConfig));
  var devServerOpt = defaultWebpackConfig.devServer || {};
  //we get Server.js not webpack-dev-server command line , so we must open browser by ourself!
  if (!devServerOpt.host) {
    devServerOpt.host = "0.0.0.0";
  }
  //HMR, we force to disable hmr
  if (!devServerOpt.hot || devServerOpt.hot) {
    devServerOpt.hot = true;
  }

  if (!program.dev) {
    devServerOpt.hot = false;
  }
  //set ContentBase
  if (devServerOpt.contentBase === undefined) {
    if (devServerOpt["contentBase"]) {
      devServerOpt.contentBase = devServerOpt["contentBase"];
    } else {
      var selfDefinedContentBase = void 0;
      //set --content-base to folder of htmlTemplate
      // 指定了htmlTemplate才设置contentBase检测为htmlTemplate位置
      if (program.htmlTemplate) {
        selfDefinedContentBase = path.dirname(path.resolve(process.cwd(), program.htmlTemplate));
        try {
          fs.statSync(selfDefinedContentBase);
        } catch (e) {
          throw new Error("contentBase you specified not exists!");
        }
        devServerOpt.contentBase = selfDefinedContentBase;
      }
    }
  }
  //watch contentBase
  if (devServerOpt["watchContentBase"]) devServerOpt.watchContentBase = true;

  if (!devServerOpt.stats) {
    devServerOpt.stats = {
      cached: false,
      cachedAssets: false
    };
  }
  //open browser automatically
  if (devServerOpt["open"]) devServerOpt.open = true;
  // console.log(
  //   "打包的devServer配置为:",
  //   util.inspect(devServerOpt, { showHidden: true, depth: 3 })
  // );

  var DEFAULT_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : devServerOpt.port;
  detect(DEFAULT_PORT).then(function (port) {
    // port not preocupied
    if (port == DEFAULT_PORT) {
      // console.log('webpack打包的配置为====='+JSON.stringify(defaultWebpackConfig));
      startDevServer(defaultWebpackConfig, devServerOpt);
      return;
    }
    devServerOpt.port = port;
    // port preocupied, we choose another one
    var question = _chalk2.default.yellow("Something is already running on port " + DEFAULT_PORT + "\n\nWould you like to run the app on another port instead?");

    (0, _prompt2.default)(question, true).then(function (shouldChangePort) {
      if (shouldChangePort) {
        startDevServer(defaultWebpackConfig, devServerOpt);
      }
    });
  });
}

/**
 * [startDevServer Start our devServer using valid options]
 * @param  {[type]} wpOpt   [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function startDevServer(wpOpt, options) {
  (0, _updateEntry2.default)(wpOpt, options);
  //Add "webpack/hot/only-dev-server","webpack/hot/dev-server" and ${require.resolve("../../client/")}?${domain}
  //to entry files
  var compiler = void 0;
  try {
    compiler = (0, _webpack2.default)(wpOpt);
    //begin to webpack compile
  } catch (e) {
    console.log("webpack compile error!");
    if (e instanceof _webpack2.default.WebpackOptionsValidationError) {
      console.error(colorError(options.stats.colors, e.message));
      process.exit(1); // eslint-disable-line
    }
    throw e;
  }
  var uri = (0, _createDomain2.default)(options) + (options.inline !== false || options.lazy === true ? "/" : "/webpack-dev-server/");
  var server = void 0;
  try {
    server = new _Server2.default(compiler, options);
    //we initiate a server using devServer configuration
  } catch (e) {
    var OptionsValidationError = require("webpack-dev-server/lib/OptionsValidationError");
    if (e instanceof OptionsValidationError) {
      console.error(colorError(options.stats.colors, e.message));
      process.exit(1); // eslint-disable-line
    }
    throw e;
  }
  //server.listen([port][, hostname][, backlog][, callback])
  server.listen(options.port, options.host, function (err) {
    if (err) throw err;
    reportReadiness(uri, options);
  });
}

function reportReadiness(uri, options) {
  var useColor = devServerOpt.color;
  var startSentence = "Project is running at " + colorInfo(useColor, uri);
  if (options.socket) {
    startSentence = "Listening to socket at " + colorInfo(useColor, options.socket);
  }
  console.log((devServerOpt["progress"] ? "\n" : "") + startSentence);
  //是否有进度信息
  console.log("webpack output is served from " + colorInfo(useColor, options.publicPath));
  var contentBase = Array.isArray(options.contentBase) ? options.contentBase.join(", ") : options.contentBase;
  //设置contentBase
  if (contentBase) console.log("Content not from webpack is served from " + colorInfo(useColor, contentBase));
  //更加说明了contentBase不是从webpack打包中获取的，而是直接express.static指定静态文件路径
  if (options.historyApiFallback) console.log("404s will fallback to " + colorInfo(useColor, options.historyApiFallback.index || "/index.html"));
  //historyApiFallback回退到index.html
  if (options.open) {
    (0, _openBrowser2.default)(uri);
    //Code bellow will force to open a new tab even in mac os platform, we use return value of openBrowser function to
    //prevent this
    // opn(uri).catch(function() {
    //   console.log("Unable to open browser. If you are running in a headless environment, please do not use the open flag.");
    // });
  }
}
module.exports = exports['default'];