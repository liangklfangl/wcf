"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getWebpackCommonConfig;

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

var _getBabelDefaultConfig = require("./getBabelDefaultConfig");

var _getBabelDefaultConfig2 = _interopRequireDefault(_getBabelDefaultConfig);

var _extractTextWebpackPlugin = require("extract-text-webpack-plugin");

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _imageminWebpackPlugin = require("imagemin-webpack-plugin");

var _imageminWebpackPlugin2 = _interopRequireDefault(_imageminWebpackPlugin);

var _autoprefixer = require("autoprefixer");

var _autoprefixer2 = _interopRequireDefault(_autoprefixer);

var _LoaderOptionsPlugin = require("webpack/lib/LoaderOptionsPlugin");

var _LoaderOptionsPlugin2 = _interopRequireDefault(_LoaderOptionsPlugin);

var _ConcatPlugin = require("./plugins/ConcatPlugin");

var _ConcatPlugin2 = _interopRequireDefault(_ConcatPlugin);

var _index = require("./updateRules/index.js");

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isWin() {
  return process.platform.indexOf("win") === 0;
}
/**
 * [deltPathCwd prepend filepath width cwd]
 * @return {[string]} [prepended filepath]
 */
function deltPathCwd(program, object) {
  for (var key in object) {
    var finalPath = isWin ? _path2.default.resolve(program.cwd, object[key]).split(_path2.default.sep).join("/") : _path2.default.resolve(program.cwd, object[key]);
    object[key] = finalPath;
  }
  return object;
}

/**
 * [isDevMode]
 * @param  {[program]}  program [description]
 * @return {Boolean}         [whether is in development mode]
 */
function isDevMode(program) {
  return !!program.dev;
}

/**
 * [getWebpackCommonConfig description]
 * @param  {[type]}  program         [description]
 * @param  {Boolean} isProgramInvoke [Whether or not used as command line]
 * @return {[type]}                  [description]
 */
function getWebpackCommonConfig(program, isProgramInvoke) {
  var packagePath = _path2.default.join(program.cwd, "package.json");
  packagePath = isWin() ? packagePath.split(_path2.default.sep).join("/") : packagePath;
  var packageConfig = (0, _fs.existsSync)(packagePath) ? require(packagePath) : {};
  //we config the webpack by program
  var jsFileName = program.hash ? "[name]-[chunkhash].js" : "[name].js";
  var cssFileName = program.hash ? "[name]-[chunkhash].css" : "[name].css";
  var commonName = program.hash ? "common-[chunkhash].js" : "common.js";
  var isDev = isDevMode(program);
  var localUseBabelrc = program.config && program.config.useBabelrc || false;
  var extraBabelPlugins = program.config && program.config.extraBabelPlugins || [];
  var extraBabelPresets = program.config && program.config.extraBabelPresets || [];

  if (program.config && program.config.useBabelrc != undefined) {
    delete program.config.useBabelrc;
  }

  if (program.config && program.config.extraBabelPlugins != undefined) {
    delete program.config.extraBabelPlugins;
  }

  if (program.config && program.config.extraBabelPresets != undefined) {
    delete program.config.extraBabelPresets;
  }

  var lf = isWin() ? _path2.default.join(__dirname, "../node_modules").split(_path2.default.sep).join("/") : _path2.default.join(__dirname, "../node_modules");
  var outputPath = isWin() ? _path2.default.join(program.cwd, "./dest/").split(_path2.default.sep).join("/") : _path2.default.join(program.cwd, "./dest/");

  var jsJSXLoaders = [{
    loader: require.resolve("babel-loader"),
    options: _getBabelDefaultConfig2.default.getDefaultBabel(localUseBabelrc, extraBabelPlugins, extraBabelPresets)
  }];

  var defaultWebpackPlugins = [
  //from https://github.com/webpack-contrib/extract-text-webpack-plugin
  // new ExtractTextPlugin({
  // 	filename:'etp-[contenthash].css',
  // 	allChunks:false,
  // 	disable:false,
  // 	ignoreOrder:false
  // 	//Disables order check (useful for CSS Modules!),
  // }),
  //chunk less than this size will be merged
  new _webpack2.default.optimize.MinChunkSizePlugin({
    minChunkSize: 1000
  }),
  // new webpack.optimize.OccurenceOrderPlugin(),
  //give most used chunk a smaller id
  //CommonsChunkPlugin will boost rebuild performance
  // new webpack.optimize.MergeDuplicateChunksPlugin (),
  //merge them while duplicating
  // new webpack.optimize.RemoveEmptyChunksPlugin()
  //remove empty chunk
  //all of above plugins have been built-in
  //https://github.com/Klathmon/imagemin-webpack-plugin
  new _imageminWebpackPlugin2.default({
    test: /\.(jpe?g|png|gif|svg)$/i,
    disable: isDev, // Disable during development
    //https://pngquant.org/
    pngquant: {
      quality: "95-100"
    },
    optipng: null,
    gifsicle: {
      optimizationLevel: 1
    },
    //http://www.lcdf.org/gifsicle/
    jpegtran: {
      progressive: false
    }
  }),
  //autoprefixer plugin
  new _LoaderOptionsPlugin2.default({
    options: {
      context: "/",
      postcss: function postcss() {
        return [_autoprefixer2.default];
      }
    }
  })];
  var EnableRequirePlusLoader = false;
  var requirePlusLoaders = {};
  var fromSilki = false;
  var concatPlugin = {};
  // 提供enableRequirePlusLoader
  // 配置{options:['antd','xxx']}
  if (program.config && program.config.fromSilki && program.config.enableRequirePlusLoader) {
    EnableRequirePlusLoader = true;
    concatPlugin = program.config.concatPlugin;
    requirePlusLoaders = program.config.requirePlusLoaders;
    fromSilki = program.config.fromSilki;
    delete program.config.enableRequirePlusLoader;
    delete program.config.requirePlusLoaders;
    delete program.config.fromSilki;
    delete program.config.concatPlugin;
  }

  if (EnableRequirePlusLoader && fromSilki) {
    jsJSXLoaders.push({
      loader: require.resolve("./loaders/ReqiurePlusLoader.js"),
      options: requirePlusLoaders
    });
    defaultWebpackPlugins.push(new _ConcatPlugin2.default(concatPlugin));
  }

  var commonConfig = {
    cache: false,
    //Cache the generated webpack modules and chunks to improve build speed.
    //Caching is enabled by default while in watch mode
    output: {
      path: _path2.default.resolve(outputPath),
      filename: jsFileName
    },
    resolve: {
      // modules :["node_modules",path.join(__dirname, '../node_modules')],
      // moduleDirectories : ["node_modules"],
      extensions: [".js", ".jsx", ".tsx", ".json", ".less", ".scss", ".css", ".png", "*"]
      // last two configuration is for webpack1
      // for detail :https://github.com/webpack/webpack/issues/472#issuecomment-55706013
    },
    devServer: {
      publicPath: "/",
      open: true,
      host: "0.0.0.0",
      port: 8080,
      // contentBase:false,
      hot: false
    },
    devtool: program.devtool || "cheap-source-map",
    entry: deltPathCwd(program, packageConfig.entry),
    //prepend it with cwd
    context: isWin() ? _path2.default.resolve(program.cwd.split(_path2.default.sep).join("/")) : _path2.default.resolve(program.cwd),
    //The base directory (absolute path!) for resolving the entry option
    module: {
      // noParse:[/jquery/],
      //Prevent webpack from parsing any files matching the given regular expression(s)
      //jquery has no other requires
      rules: [{ test: /\.tsx?$/, loader: require.resolve("ts-loader") }, {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
        use: {
          loader: require.resolve("url-loader"),
          //If the file is greater than the limit (in bytes) the file-loader is used and all query parameters are passed to it.
          //smaller than 10kb will use dataURL
          options: {
            limit: 10000
          }
        }
      }, {
        test: /\.svg$/,
        loader: require.resolve("svg-inline-loader")
      }, {
        test: /\.json$/,
        loader: require.resolve("json-loader")
      }, {
        test: /\.html?$/,
        use: {
          loader: require.resolve("html-loader"),
          options: {}
        }
      }, {
        test: /\.js$/,
        // exclude: function(path){
        //     var isNpmModule=!!path.match(/node_modules/);
        //     return isNpmModule;
        //  },
        exclude: /node_modules/,
        // exclude :path.resolve("node_modules"),
        //exclude node_modules folder, or we can use include config to include some path
        use: jsJSXLoaders
      }, {
        test: /\.jsx$/,
        // exclude :path.resolve("node_modules"),
        exclude: /node_modules/,
        // exclude: function(path){
        //    var isNpmModule=!!path.match(/node_modules/);
        //    return isNpmModule;
        // },
        //exclude node_modules folder, or we can use include config to include some path
        use: jsJSXLoaders
        //ExtractTextPlugin.extract here will throw `self is undefined!`
        //We should not use
        //https://github.com/postcss/postcss-loader
      }]
    },
    plugins: defaultWebpackPlugins
  };
  //Whether or not required by other program
  //we are now in `production` mode， we will extract css file from js file
  if (isProgramInvoke) {
    (0, _index2.default)(commonConfig, false);
    commonConfig.plugins.push(new _extractTextWebpackPlugin2.default({
      filename: "common.css",
      allChunks: false,
      disable: false,
      ignoreOrder: false
      //Disables order check (useful for CSS Modules!),
    }));
  } else {
    // if we are now in `production` mode, we will extract css from js file, else we will not to support HMR
    // so extract method of loader configured must be removed! So in case of this error, we will add this plugin
    // for a hack
    if (!isDevMode(program)) {
      commonConfig.plugins.push(new _extractTextWebpackPlugin2.default({
        filename: "common.css",
        allChunks: false,
        disable: false,
        ignoreOrder: false
        //Disables order check (useful for CSS Modules!),
      }));
    } else {
      //But css will not be extracted because we use style-loader to support HMR, so css will be inlined!
      commonConfig.plugins.push(new _extractTextWebpackPlugin2.default({
        filename: "common.css",
        allChunks: false,
        disable: false,
        ignoreOrder: false
        //Disables order check (useful for CSS Modules!),
      }));
    }
  }
  return commonConfig;
}
module.exports = exports['default'];