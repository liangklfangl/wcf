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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param  {[type]}
 * @return {[type]}
 */
function getWebpackCommonConfig(program) {

  var packagePath = path.join(program.cwd, 'package.json');
  var packageConfig = (0, _fs.existsSync)(packageConfig) ? require(packagePath) : {};
  //we config the webpack by args 
  var jsFileName = program.hash ? '[name]-[chunkhash].js' : '[name].js';
  var cssFileName = program.hash ? '[name]-[chunkhash].css' : '[name].css';
  var commonName = program.hash ? 'common-[chunkhash].js' : 'common.js';
  return {
    output: {
      path: (0, _path2.default)(program.cwd, './dest/'),
      filename: jsFileName
    },
    devtool: args.devtool,
    entry: packageConfig.entry,
    module: {
      rules: [{
        test: /\.css$/,
        use: _extractTextWebpackPlugin2.default.extract({
          fallback: "style-loader",
          //loader(e.g 'style-loader') that should be used when
          // the CSS is not extracted (i.e. in an additional chunk when allChunks: false)
          use: "css-loader"
          //converting resource to css exporting module
        })
      }, {
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        loader: require.resolve('babel-loader'),
        query: (0, _getBabelDefaultConfig2.default)()
      }, {
        test: /\.css$/,
        use: ['style-loader', 'css-loader?importLoaders=1', {
          loader: 'postcss-loader',
          options: {
            plugins: function plugins() {
              return [require('precss'), require('autoprefixer')];
            }
          }
        }]
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
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 1000
    })]

  };
}
module.exports = exports['default'];