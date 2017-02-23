import webpackDefaultConfig from './getWebpackDefaultConfig';
import mergeCustomConfig from './mergeWebpackConfig';
import {path,resolve} from 'path';
import webpack from 'webpack';
import StatsPlugin from 'stats-webpack-plugin';
import DllPluginDync from 'dllplugindync';
/** 
 * @param  {[type]} 
 * @param  {Function} 
 * @return {[type]}
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

if (typeof program.config === 'function') {
 defaultWebpackConfig = program.config(defaultWebpackConfig) || defaultWebpackConfig;
} else {
  defaultWebpackConfig = mergeCustomConfig(defaultWebpackConfig, resolve(program.cwd, program.config || 'webpack.config.js'));
}
  const compiler = webpack(defaultWebpackConfig);
  //we watch file change
  if (program.watch) {
    compiler.watch(program.watch || 200, doneHandler.bind(program));
  } else {
    compiler.run(doneHandler.bind(program));
  }
}

function doneHandler(err, stats) {
  //!! there an error attr in stats object, you can look through it to get the compile information
  console.log('resource rebuilt',stats);
}

