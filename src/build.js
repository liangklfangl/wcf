import webpackDefaultConfig from './getWebpackDefaultConfig';
import mergeCustomConfig from './mergeWebpackConfig';
import {path,resolve} from 'path';
import webpack from 'webpack';
import StatsPlugin from 'stats-webpack-plugin';
import DllPluginDync from 'dllplugindync';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import bundleWDevServer from "./devServer";
import webpackWatch from "./webpackWatch";
import webpackMerge from "webpack-merge";
import { existsSync } from 'fs';
import util from "util";
/** 
 * @param  {[type]} 
 * @param  {Function} 
 * @return {[type]}
 * Default webpack configuration will be replaced by parameters from shell
 */
export default function build(program,callback){
 let defaultWebpackConfig=webpackDefaultConfig(program);
 //get default webpack configuration
 if(program.outputPath){
  	defaultWebpackConfig.output.path=program.outputPath;
 }
 //update output path
if(program.publichPath){
	defaultWebpackConfig.output.publicPath = program.publicPath;
}
//update public path
if(program.stj){
  defaultWebpackConfig.plugins.push(new StatsPlugin(program.stj,{
     //options passed to stats.json
  }));
}
//inject HotModuleReplacementPlugin
if(program.dev){
  defaultWebpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}
//we inject html by HtmlWebpackPlugin
if(program.dev){
  defaultWebpackConfig.plugins.push(new HtmlWebpackPlugin({
    title :"HtmlPlugin",
    // filename :"index.html",
    template: "test/index.html",
    //we must use html-loader here instead of file-loader
    inject :"body",
    cache : false,
    xhtml :false
  }));
}

//we inject DllReferencePlugin
if(program.manifest){
  defaultWebpackConfig.plugins.push(new DllPluginDync({
     manifest : program.manifest,
     context : program.cwd
  }));
}
 if (!program.dev) {
  //https://github.com/mishoo/UglifyJS2
    defaultWebpackConfig.plugins = [...defaultWebpackConfig.plugins,
      new webpack.optimize.UglifyJsPlugin({
         beautify:false,
         sourceMap :true,
         // use SourceMaps to map error message locations to modules. 
         //This slows down the compilation. (default: true)
         comments:false,
        //Defaults to preserving comments containing /*!, /**!, @preserve or @license.
      	 output: {
            ascii_only: true,
	      },
	      compress: {
	        warnings: false,
          //no warnings when remove unused code,
          drop_console :true,
          //drop console
          collapse_vars: true,
          //Collapse single-use var and const definitions when possible.
          reduce_vars: true,
          // Improve optimization on variables assigned with and used as constant values.
	      },
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      }),
    ];
  } else {
    if (process.env.NODE_ENV) {
      defaultWebpackConfig.plugins = [...defaultWebpackConfig.plugins,
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
      ];
    }
  }
  //User defined webpack.config.js to update our common webpack config
  if(program.config){
    //defaultWebpackConfig = mergeCustomConfig(defaultWebpackConfig, resolve(program.cwd, program.config || 'webpack.config.js'));
    const customWebpackConfigPath = resolve(program.cwd,program.config || 'webpack.config.js');
    if(existsSync(customWebpackConfigPath)){
      const customConfig = require(customWebpackConfigPath);
       defaultWebpackConfig=webpackMerge(defaultWebpackConfig, customConfig);
    }
  }
  // console.log('combined：',util.inspect(defaultWebpackConfig,{showHidden:true,depth:3}));
  //Whether we should start DevServer which serve file from memory instead of fileSystem
  if(program.devServer){
    bundleWDevServer(defaultWebpackConfig);
  }else{
    //we use watch method of webpack
    webpackWatch(defaultWebpackConfig,program);
  }
 
}


