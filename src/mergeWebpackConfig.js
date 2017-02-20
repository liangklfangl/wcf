import { existsSync } from 'fs';
/**
 * [mergeCustomConfig description]
 * @param  {[type]} webpackConfig    [description]
 * @param  {[type]} customConfigPath [description]
 * @return {[type]}                  [description]
 */
export default function mergeCustomConfig(webpackConfig, customConfigPath) {
  if (!existsSync(customConfigPath)) {
    return webpackConfig;
  }
  const customConfig = require(customConfigPath);
  if (typeof customConfig === 'function') {
    return customConfig(webpackConfig, ...[...arguments].slice(2));
  }

  throw new Error(`Return of ${customConfigPath} must be a function.`);
}