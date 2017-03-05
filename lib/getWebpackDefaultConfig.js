'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getWebpackCommonConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _getBabelDefaultConfig = require('./getBabelDefaultConfig');

var _getBabelDefaultConfig2 = _interopRequireDefault(_getBabelDefaultConfig);

var _extractTextWebpackPlugin = require('extract-text-webpack-plugin');

var _extractTextWebpackPlugin2 = _interopRequireDefault(_extractTextWebpackPlugin);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _imageminWebpackPlugin = require('imagemin-webpack-plugin');

var _imageminWebpackPlugin2 = _interopRequireDefault(_imageminWebpackPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [isWin : whether running in windows platform]
 * @return {Boolean} [description]
 */
function isWin() {
  return process.platform.indexOf('win') === 0;
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
 * @param  {[type]}
 * @return {[type]}
 */
function getWebpackCommonConfig(program) {
  var packagePath = _path2.default.join(program.cwd, 'package.json');
  packagePath = isWin() ? packagePath.split(_path2.default.sep).join("/") : packagePath;
  var packageConfig = (0, _fs.existsSync)(packagePath) ? require(packagePath) : {};
  //we config the webpack by program 
  var jsFileName = program.hash ? '[name]-[chunkhash].js' : '[name].js';
  var cssFileName = program.hash ? '[name]-[chunkhash].css' : '[name].css';
  var commonName = program.hash ? 'common-[chunkhash].js' : 'common.js';
  var isDev = isDevMode(program);
  //override default vars of less files
  // let theme = {};
  // if (packageConfig.theme && typeof(packageConfig.theme) === 'string') {
  //   let cfgPath = packageConfig.theme;
  //   // relative path
  //   if (cfgPath.charAt(0) === '.') {
  //     cfgPath = path.resolve(program.cwd, cfgPath);
  //   }
  //   const getThemeConfig = require(cfgPath);
  //   theme = getThemeConfig();
  //   // if it's configured as a function ,the we invoke it 
  // } else if (packageConfig.theme && typeof(packageConfig.theme) === 'object') {
  //   theme = packageConfig.theme;
  // }
  var lf = isWin() ? _path2.default.join(__dirname, '../node_modules').split(_path2.default.sep).join("/") : _path2.default.join(__dirname, '../node_modules');
  var outputPath = isWin() ? _path2.default.join(program.cwd, './dest/').split(_path2.default.sep).join("/") : _path2.default.join(program.cwd, './dest/');

  console.log('加载css页面为:', deltPathCwd(program, packageConfig.entry));

  return {
    cache: false,
    //Cache the generated webpack modules and chunks to improve build speed. 
    //Caching is enabled by default while in watch mode
    output: {
      path: outputPath,
      filename: jsFileName
    },
    resolve: {
      // modules :["node_modules",path.join(__dirname, '../node_modules')],
      // moduleDirectories : ["node_modules"],
      // extensions: ['', '.web.jsx', '.web.js',  '.js', '.jsx', '.json'],
      // last two configuration is for webpack1
      // for detail :https://github.com/webpack/webpack/issues/472#issuecomment-55706013
    },
    devServer: {
      publicPath: '/',
      open: true,
      port: 8080,
      contentBase: false
    },
    devtool: program.devtool || "cheap-source-map",
    entry: deltPathCwd(program, packageConfig.entry),
    //prepend it with cwd
    context: isWin() ? program.cwd.split(_path2.default.sep).join('/') : program.cwd,
    //The base directory (absolute path!) for resolving the entry option
    module: {
      noParse: [/jquery/],
      //Prevent webpack from parsing any files matching the given regular expression(s)
      //jquery has no other requires
      rules: [{
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
        use: {
          loader: require.resolve('url-loader'),
          //If the file is greater than the limit (in bytes) the file-loader is used and all query parameters are passed to it.
          //smaller than 10kb will use dataURL
          options: {
            limit: 10000
          }
        }
      }, {
        test: /\.json$/,
        loader: require.resolve('json-loader')
      }, {
        test: /\.html?$/,
        use: {
          loader: require.resolve('html-loader'),
          options: {}
        }
      }, {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }, {
        test: /\.js(x)*/,
        exclude: function exclude(path) {
          var isNpmModule = !!path.match(/node_modules/);
          return isNpmModule;
        },
        //exclude node_modules folder, or we can use include config to include some path 
        loader: 'babel-loader?cacheDirectory',
        query: (0, _getBabelDefaultConfig2.default)()
      }, {
        test: /\.less$/,
        use: _extractTextWebpackPlugin2.default.extract({
          fallback: require.resolve('style-loader'),
          use: [{
            loader: require.resolve('css-loader'),
            options: {
              modules: true,
              //enable css module,You can switch it off with :global(...) or :global for selectors and/or rules.
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              //path will be replaced by file path(foler path relative to project root)
              //name will be replaced by file name
              //local will be replaced by local class name
              sourceMap: true,
              //the extract-text-webpack-plugin can handle them.
              importLoaders: 1,
              // That many loaders after the css-loader are used to import resources.
              minimize: true,
              //You can also disable or enforce minification with the minimize query parameter.
              camelCase: true
            }
          }, {
            //autoprefix your css
            loader: require.resolve('postcss-loader'),
            options: {
              plugins: function plugins() {
                return [require('precss'), require('autoprefixer')];
              }
            }
          }, {
            loader: require.resolve('less-loader'),
            options: {
              sourceMap: true,
              lessPlugins: []
              //sourcemaps are only available in conjunction with the extract-text-webpack-plugin
              // modifyVars: JSON.stringify(theme)
              //using theme config in package.json to modify default less variables
            }
          }] })
      },
      //https://github.com/postcss/postcss-loader
      {
        test: /\.css$/,
        use: _extractTextWebpackPlugin2.default.extract({
          fallback: require.resolve('style-loader'),
          use: [{
            loader: require.resolve('css-loader'),
            options: {
              modules: true,
              //enable css module,You can switch it off with :global(...) or :global for selectors and/or rules.
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
              //path will be replaced by file path(foler path)
              //name will be replaced by file name
              //local will be replaced by local class name
              sourceMap: true,
              //the extract-text-webpack-plugin can handle them.
              importLoaders: 1,
              // That many loaders after the css-loader are used to import resources.
              minimize: true,
              //You can also disable or enforce minification with the minimize query parameter.
              camelCase: true
            }
            //https://github.com/webpack-contrib/css-loader#css-composing
          }, {
            loader: 'postcss-loader?sourceMap=inline',
            options: {
              plugins: function plugins() {
                return [require('autoprefixer')({
                  browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
                  //browsers (array): list of browsers query (like last 2 version), which are supported in 
                  //your project. We recommend to use browserslist config or browserslist key in package.json, 
                  //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
                  cascade: true,
                  //then beatified as follows with right indent
                  //-webkit-transform: rotate(45deg);
                  //        transform: rotate(45deg); 
                  add: false,
                  //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
                  remove: false,
                  //By default, Autoprefixer also removes outdated prefixes.
                  //You can disable this behavior with the remove: false option. 
                  //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
                  support: true,
                  //should Autoprefixer add prefixes for @supports parameters.  
                  flexbox: true,
                  //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
                  //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
                  grid: true
                })];
              }
            }
          }] })
      }]
    },
    plugins: [
    //from https://github.com/webpack-contrib/extract-text-webpack-plugin
    new _extractTextWebpackPlugin2.default({
      filename: 'etp-[contenthash].css',
      allChunks: false,
      disable: false,
      ignoreOrder: false
      //Disables order check (useful for CSS Modules!),
    }),
    //chunk less than this size will be merged
    new _webpack2.default.optimize.MinChunkSizePlugin({
      minChunkSize: 1000
    }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    //give most used chunk a smaller id
    new _webpack2.default.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2,
      filename: commonName
    }),
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
        quality: '95-100'
      },
      optipng: null,
      gifsicle: {
        optimizationLevel: 1
      },
      //http://www.lcdf.org/gifsicle/
      jpegtran: {
        progressive: false
      }
    })]

  };
}
module.exports = exports['default'];