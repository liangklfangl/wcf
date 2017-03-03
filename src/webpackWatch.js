 import webpack from "webpack";
 import stripAnsi from 'strip-ansi';
 import chokidar  from "chokidar";
 import path from "path";
 import { existsSync } from 'fs';
/**
 * [webpackWatch Receive webpack default configuration]
 * @param  {[type]} defaultWebpackConfig [description]
 * @return {[type]}                      [description]
 */
export default function webpackWatch(defaultWebpackConfig,program){
   const compiler = webpack(defaultWebpackConfig);
   let watching = null;
   const customWebpackPath = program.config ? path.resolve(program.cwd,program.config) : "";
  //we watch file change, so if entry file configured in package.json changed, it will
  //compile automatically. And also we watch file of custom webpack.config.js for changes!
  if (program.watch) {
    watching = compiler.watch(200, doneHandler.bind(program));
    if(customWebpackPath && existsSync(customWebpackPath)){
       chokidar.watch(customWebpackPath).on('change',function(){
         watching._done();
         watching = null;
          // webpackWatch(defaultWebpackConfig,program);
         watching = compiler.watch(program.watch || 200, doneHandler.bind(program));
       });
    }
  } else {
    compiler.run(doneHandler.bind(program));
  }
}

/**
 * [doneHandler Deal with warnings/errors of compilation and ignore all info]
 * @param  {[type]} err   [description]
 * @param  {[type]} stats [description]
 * @return {[type]}       [description]
 */
function doneHandler(err, stats) {
  //get all errors
  if(stats.hasErrors()){
  	printErrors(stats.errors,true);
  }
  const warnings =stats.warnings && stats.warnings.length==0;
  if(stats.hasWarnings()){
  	printErrors(stats.warnings);
  }
 console.log("Compilation finished!\n");

}
/**
 * [printErrors log errors of compilation]
 * @param  {[type]} errors [description]
 * @return {[type]}        [description]
 */
function printErrors(errors,isError=false) {
  console.log("Compilation Errors or Warnings as follows:\n");
	const strippedErrors = errors.map(function(error) {
		return stripAnsi(error);
	});
	for(let i = 0; i < strippedErrors.length; i++)
		isErro ? console.error(strippedErrors[i]) : console.warn(strippedErrors[i]);
}
