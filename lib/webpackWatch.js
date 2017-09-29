import webpack from "webpack";
import stripAnsi from 'strip-ansi';
import chokidar from "chokidar";
import path from "path";
import { existsSync } from 'fs';
const util = require('util');
export default function webpackWatch(defaultWebpackConfig, program) {
  //指定了demo的markdown文件地址
  if (program.demo) {
    defaultWebpackConfig.entry = path.join(process.cwd(), program.demo);
    // console.log('defaultWebpackConfig========>demo',util.inspect(defaultWebpackConfig,{showHidden:true,depth:3}));
    const compiler = webpack(defaultWebpackConfig);
    compiler.run(doneHandler.bind(program));
    return;
  }
  const compiler = webpack(defaultWebpackConfig);
  let watching = null;
  const customWebpackPath = program.config ? path.resolve(program.cwd, program.config) : "";
  //we watch file change, so if entry file configured in package.json changed, it will
  //compile automatically. And also we watch file of custom webpack.config.js for changes!
  if (program.watch) {
    const delay = typeof program.watch === "number" ? program.watch : 200;
    watching = compiler.watch(delay, doneHandler.bind(program));
    if (customWebpackPath && existsSync(customWebpackPath)) {
      chokidar.watch(customWebpackPath).on('change', function () {
        console.log('You must restart to compile because configuration file changed!');
        process.exit(0);
        //We must exit because configuration file changed!
      });
    }
  } else {
    compiler.run(doneHandler.bind(program));
  }
  return compiler;
}

/**
 * [doneHandler Deal with warnings/errors of compilation and ignore all info]
 * @param  {[type]} err   [description]
 * @param  {[type]} stats [description]
 * @return {[type]}       [description]
 */
function doneHandler(err, stats) {

  //get all errors
  if (stats.hasErrors()) {
    printErrors(stats.compilation.errors, true);
  }
  const warnings = stats.warnings && stats.warnings.length == 0;
  if (stats.hasWarnings()) {
    printErrors(stats.compilation.warnings);
  }
  console.log("Compilation finished!\n");
}
/**
 * [printErrors log errors of compilation]
 * @param  {[type]} errors [description]
 * @return {[type]}        [description]
 */
function printErrors(errors, isError = false) {
  console.log("Compilation Errors or Warnings as follows:\n");
  const strippedErrors = errors.map(function (error) {
    return stripAnsi(error);
  });
  for (let i = 0; i < strippedErrors.length; i++) isError ? console.error(strippedErrors[i]) : console.warn(strippedErrors[i]);
}
module.exports = exports['default'];