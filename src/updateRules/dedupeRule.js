const exist = require('exist.js');
const merge = require('webpack-merge');
/**
 * Unique webpack rule
 * @param  {[type]} defaultWebpackConfig [description]
 * @return {[type]}                      [description]
 */
function uniqueRule(defaultWebpackConfig,customConfig){
  //unique webpack loaders
   if(exist.get(defaultWebpackConfig,"module.rules")){
      const webpackRules = merge.smart({
      rules: defaultWebpackConfig.module.rules
    }, {
      rules:customConfig.module.rules
    });
    defaultWebpackConfig.module.rules = webpackRules.rules;
 }
}

module.exports = {
	dedupeRule: uniqueRule
}


