'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
  console.log('----->', object);
  return object;
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

  //override default vars of less files
  var theme = {};
  if (packageConfig.theme && typeof packageConfig.theme === 'string') {
    var cfgPath = packageConfig.theme;
    // relative path
    if (cfgPath.charAt(0) === '.') {
      cfgPath = _path2.default.resolve(program.cwd, cfgPath);
    }
    var getThemeConfig = require(cfgPath);
    theme = getThemeConfig();
    // if it's configured as a function ,the we invoke it 
  } else if (packageConfig.theme && _typeof(packageConfig.theme) === 'object') {
    theme = packageConfig.theme;
  }
  return {
    output: {
      path: isWin() ? _path2.default.join(program.cwd, './dest/').split(_path2.default.sep).join("/") : _path2.default.join(program.cwd, './dest/'),
      filename: jsFileName
    },
    devtool: program.devtool,
    entry: deltPathCwd(program, packageConfig.entry),
    //prepend it with cwd
    module: {
      rules: [{
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }
      }, {
        test: /\.json$/,
        loader: 'json-loader'
      }, {
        test: /\.html?$/,
        use: {
          loader: 'file-loader',
          options: {}
        }
      }, {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        query: (0, _getBabelDefaultConfig2.default)()
      }, {
        test: /\.less$/,
        use: _extractTextWebpackPlugin2.default.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1
            }
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: function plugins() {
                return [require('precss'), require('autoprefixer')];
              }
            }
          }, {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              //sourcemaps are only available in conjunction with the extract-text-webpack-plugin
              modifyVars: JSON.stringify(theme)
              //using theme config in package.json to modify default less variables
            }
          }] })
      },
      //https://github.com/postcss/postcss-loader
      {
        test: /\.css$/,
        use: _extractTextWebpackPlugin2.default.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
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
      filename: 'extracted-text-plugin-generated-[contenthash].css',
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
    })]

  };
}
module.exports = exports['default'];