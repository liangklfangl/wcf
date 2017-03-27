const exist = require('exist.js');
const merge = require("webpack-merge");
/**
 * Dedupe webpack plugin
 * @param  {[type]} defaultWebpackConfig [description]
 * @param  {[type]} customConfig         [description]
 * @return {[type]}                      [description]
 */
function dedupePlugin(defaultWebpackConfig,customConfig){
 const uniqueWebpackPlugins = merge({
      //Here must be set key 'customizeArray'
      customizeArray: merge.unique(
        'plugins',
        ["HtmlWebpackPlugin","CommonsChunkPlugin",'HotModuleReplacementPlugin','UglifyJsPlugin','MinChunkSizePlugin',"ImageminPlugin","ExtractTextPlugin","LoaderOptionsPlugin"],
        plugin => {
          return plugin.constructor && plugin.constructor.name
        })
    })({
       plugins: defaultWebpackConfig.plugins
    }, {
       plugins: customConfig.plugins
    });
   defaultWebpackConfig.plugins = uniqueWebpackPlugins.plugins;
}
module.exports = {
	dedupePlugin
}