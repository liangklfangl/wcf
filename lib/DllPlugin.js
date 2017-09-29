import webpack from "webpack";
import resolve from "resolve";
import path from "path";

function isRelativePath(filename) {
  return filename.indexOf(".") === 0;
}
/**
 * [resolveConfigFile the filepath is relative to process.cwd]
 * @param  {[type]} filename [description]
 * @return {[type]}          [filepath]
 */
function resolveConfigFile(filename) {
  let result;
  try {
    result = isRelativePath(filename) ? resolve.sync(filename, {
      basedir: process.cwd()
    }) : resolve.sync("./" + filename, {
      basedir: process.cwd()
    });
  } catch (e) {}

  return result;
}
/**
 * [build description]
 * @param  {[type]} program [description]
 * @return {[type]}         [description]
 */
export default function build(program) {
  const dllconfigPath = resolveConfigFile(program.dll);
  //get config file
  if (!dllconfigPath) {
    new Error('You must specify an existing config file for dllplugin');
  }
  const vendorPath = path.dirname(dllconfigPath + "/vendors.js");
  const webpackConfig = require(dllconfigPath);
  //get our vendors.js
  webpack(webpackConfig, function () {
    console.log('done');
  });
}
module.exports = exports['default'];