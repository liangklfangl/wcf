 import webpack from "webpack";
 import stripAnsi from 'strip-ansi';
/**
 * [webpackWatch Receive webpack default configuration]
 * @param  {[type]} defaultWebpackConfig [description]
 * @return {[type]}                      [description]
 */
export default function webpackWatch(defaultWebpackConfig,program){
   const compiler = webpack(defaultWebpackConfig);
  //we watch file change
  if (program.watch) {
    compiler.watch(program.watch || 200, doneHandler.bind(program));
  } else {
    compiler.run(doneHandler.bind(program));
  }
}

/**
 * [doneHandler Deal with info of compilation]
 * @param  {[type]} err   [description]
 * @param  {[type]} stats [description]
 * @return {[type]}       [description]
 */
function doneHandler(err, stats) {
  const errors = stats.errors || stats.errors.length===0;
  //get all errors
  if(!errors){
  	printErrors(stats.errors,true);
  }
  const warnings =stats.warnings || stats.warnings.length==0;
  if(!warnings){
  	printErrors(stats.warnings);
  }
}
/**
 * [printErrors log errors of compilation]
 * @param  {[type]} errors [description]
 * @return {[type]}        [description]
 */
function printErrors(errors,isError=false) {
	const strippedErrors = errors.map(function(error) {
		return stripAnsi(error);
	});
	for(let i = 0; i < strippedErrors.length; i++)
		isErro ? console.error(strippedErrors[i]) : console.warn(strippedErrors[i]);
}
