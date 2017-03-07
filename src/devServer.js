import WebpackDevServer from "webpack-dev-server/lib/Server";
import opn from "opn";
import webpack from "webpack";
import portfinder from "portfinder";
import addDevServerEntrypoints from "./entrys/updateEntry";
import createDomain  from "./entrys/createDomain";
import chokidar  from "chokidar";
let devServerOpt={};
const DEFAULT_PORT = 8080;

function colorInfo(useColor, msg) {
  if(useColor)
    // Make text blue and bold, so it *pops*
    return `\u001b[1m\u001b[34m${msg}\u001b[39m\u001b[22m`;
  return msg;
}

function colorError(useColor, msg) {
  if(useColor)
    // Make text red and bold, so it *pops*
    return `\u001b[1m\u001b[31m${msg}\u001b[39m\u001b[22m`;
  return msg;
}
/**
 * [bundleWDevServer We start devServer]
 * @param  {[type]} defaultWebpackConfig [description]
 * @return {[type]}                      [description]
 */
export default function bundleWDevServer(defaultWebpackConfig,program){
 const devServerOpt = defaultWebpackConfig.devServer || {};
  //we get Server.js not webpack-dev-server command line , so we must open browser by ourself!
  if(!devServerOpt.host){
    devServerOpt.host="localhost";
  }
  //HMR, we force to disable hmr
  if(!devServerOpt.hot || devServerOpt.hot){
    devServerOpt.hot=true;
  }

  if(!program.dev){
    devServerOpt.hot=false;
  }
  //set ContentBase
  if(devServerOpt.contentBase === undefined) {
      if(devServerOpt["contentBase"]) {
        devServerOpt.contentBase = devServerOpt["contentBase"];
      } else if(devServerOpt["contentBase"] === false) {
        devServerOpt.contentBase = false;
      }
    }
  //watch contentBase
  if(devServerOpt["watchContentBase"])
      devServerOpt.watchContentBase = true;

  if(!devServerOpt.stats) {
      devServerOpt.stats = {
        cached: false,
        cachedAssets: false
      };
    }
  //open browser automatically
  if(devServerOpt["open"])
      devServerOpt.open = true;
  //if a valid port is defined , we start server
  if(devServerOpt.port) {
    startDevServer(defaultWebpackConfig, devServerOpt);
    return;
  }
 
  //otherwise we choose a valid port
  portfinder.basePort = 0;
  portfinder.getPort(function(err, port) {
    if(err) throw err;
    devServerOpt.port = port;
    startDevServer(defaultWebpackConfig, devServerOpt);
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
  } catch(e) {
    console.log('webpack compile error!');
    if(e instanceof webpack.WebpackOptionsValidationError) {
      console.error(colorError(options.stats.colors, e.message));
      process.exit(1); // eslint-disable-line
    }
    throw e;
  }
  const uri = createDomain(options) + (options.inline !== false || options.lazy === true ? "/" : "/webpack-dev-server/");
  let server;
  try {
    server = new WebpackDevServer(compiler, options);
    //we initiate a server using devServer configuration
  } catch(e) {
    const OptionsValidationError = require("webpack-dev-server/lib/OptionsValidationError");
    if(e instanceof OptionsValidationError) {
      console.error(colorError(options.stats.colors, e.message));
      process.exit(1); // eslint-disable-line
    }
    throw e;
  }
  //server.listen([port][, hostname][, backlog][, callback])
  server.listen(options.port, options.host, function(err) {
    if(err) throw err;
    reportReadiness(uri, options);
  });
}

function reportReadiness(uri, options) {
  const useColor = devServerOpt.color;
  let startSentence = `Project is running at ${colorInfo(useColor, uri)}`
  if(options.socket) {
    startSentence = `Listening to socket at ${colorInfo(useColor, options.socket)}`;
  }
  console.log((devServerOpt["progress"] ? "\n" : "") + startSentence);
  //是否有进度信息
  console.log(`webpack output is served from ${colorInfo(useColor, options.publicPath)}`);
  const contentBase = Array.isArray(options.contentBase) ? options.contentBase.join(", ") : options.contentBase;
  //设置contentBase
  if(contentBase)
    console.log(`Content not from webpack is served from ${colorInfo(useColor, contentBase)}`);
  //更加说明了contentBase不是从webpack打包中获取的，而是直接express.static指定静态文件路径
  if(options.historyApiFallback)
    console.log(`404s will fallback to ${colorInfo(useColor, options.historyApiFallback.index || "/index.html")}`);
  //historyApiFallback回退到index.html
  if(options.open) {
    //打开一个页面
    opn(uri).catch(function() {
      console.log("Unable to open browser. If you are running in a headless environment, please do not use the open flag.");
    });
  }
}
