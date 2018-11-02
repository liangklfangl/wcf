import WebpackDevServer from "webpack-dev-server/lib/Server";
import opn from "opn";
import webpack from "webpack";
import addDevServerEntrypoints from "./entrys/updateEntry";
import createDomain from "./entrys/createDomain";
import chokidar from "chokidar";
import prompt from "react-dev-utils/prompt";
import openBrowser from "react-dev-utils/openBrowser";
import chalk from "chalk";
const util = require("util");
const path = require("path");
const fs = require("fs");
const detect = require("detect-port");
const execSync = require("child_process").execSync;
let devServerOpt = {};
const DEFAULT_PORT = 8080;

function colorInfo(useColor, msg) {
  if (useColor)
    // Make text blue and bold, so it *pops*
    return `\u001b[1m\u001b[34m${msg}\u001b[39m\u001b[22m`;
  return msg;
}

function colorError(useColor, msg) {
  if (useColor)
    // Make text red and bold, so it *pops*
    return `\u001b[1m\u001b[31m${msg}\u001b[39m\u001b[22m`;
  return msg;
}
/**
 * [bundleWDevServer We start devServer]
 * @param  {[type]} defaultWebpackConfig [description]
 * @return {[type]}                      [description]
 */
export default function bundleWDevServer(defaultWebpackConfig, program) {
  // console.log('defaultWebpackConfig的值为==='+JSON.stringify(defaultWebpackConfig));
  const devServerOpt = defaultWebpackConfig.devServer || {};
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
      let selfDefinedContentBase;
      //set --content-base to folder of htmlTemplate
      // 指定了htmlTemplate才设置contentBase检测为htmlTemplate位置
      if (program.htmlTemplate) {
        selfDefinedContentBase = path.dirname(
          path.resolve(process.cwd(), program.htmlTemplate)
        );
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

  const DEFAULT_PORT = process.env.PORT
    ? parseInt(process.env.PORT, 10)
    : devServerOpt.port;
  detect(DEFAULT_PORT).then(port => {
    // port not preocupied
    if (port == DEFAULT_PORT) {
      // console.log('webpack打包的配置为====='+JSON.stringify(defaultWebpackConfig));
      startDevServer(defaultWebpackConfig, devServerOpt);
      return;
    }
    devServerOpt.port = port;
    // port preocupied, we choose another one
    const question = chalk.yellow(
      `Something is already running on port ${DEFAULT_PORT}\n\nWould you like to run the app on another port instead?`
    );

    prompt(question, true).then(shouldChangePort => {
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
  addDevServerEntrypoints(wpOpt, options);
  //Add "webpack/hot/only-dev-server","webpack/hot/dev-server" and ${require.resolve("../../client/")}?${domain}
  //to entry files
  let compiler;
  try {
    compiler = webpack(wpOpt);
    //begin to webpack compile
  } catch (e) {
    console.log("webpack compile error!");
    if (e instanceof webpack.WebpackOptionsValidationError) {
      console.error(colorError(options.stats.colors, e.message));
      process.exit(1); // eslint-disable-line
    }
    throw e;
  }
  const uri =
    createDomain(options) +
    (options.inline !== false || options.lazy === true
      ? "/"
      : "/webpack-dev-server/");
  let server;
  try {
    server = new WebpackDevServer(compiler, options);
    //we initiate a server using devServer configuration
  } catch (e) {
    const OptionsValidationError = require("webpack-dev-server/lib/OptionsValidationError");
    if (e instanceof OptionsValidationError) {
      console.error(colorError(options.stats.colors, e.message));
      process.exit(1); // eslint-disable-line
    }
    throw e;
  }
  //server.listen([port][, hostname][, backlog][, callback])
  server.listen(options.port, options.host, function(err) {
    if (err) throw err;
    reportReadiness(uri, options);
  });
}

function reportReadiness(uri, options) {
  const useColor = devServerOpt.color;
  let startSentence = `Project is running at ${colorInfo(useColor, uri)}`;
  if (options.socket) {
    startSentence = `Listening to socket at ${colorInfo(
      useColor,
      options.socket
    )}`;
  }
  console.log((devServerOpt["progress"] ? "\n" : "") + startSentence);
  //是否有进度信息
  console.log(
    `webpack output is served from ${colorInfo(useColor, options.publicPath)}`
  );
  const contentBase = Array.isArray(options.contentBase)
    ? options.contentBase.join(", ")
    : options.contentBase;
  //设置contentBase
  if (contentBase)
    console.log(
      `Content not from webpack is served from ${colorInfo(
        useColor,
        contentBase
      )}`
    );
  //更加说明了contentBase不是从webpack打包中获取的，而是直接express.static指定静态文件路径
  if (options.historyApiFallback)
    console.log(
      `404s will fallback to ${colorInfo(
        useColor,
        options.historyApiFallback.index || "/index.html"
      )}`
    );
  //historyApiFallback回退到index.html
  if (options.open) {
    openBrowser(uri);
    //Code bellow will force to open a new tab even in mac os platform, we use return value of openBrowser function to
    //prevent this
    // opn(uri).catch(function() {
    //   console.log("Unable to open browser. If you are running in a headless environment, please do not use the open flag.");
    // });
  }
}
