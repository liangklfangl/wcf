"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dedupeLoader;

var _ramda = require("ramda");

var _ramda2 = _interopRequireDefault(_ramda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * [dedupe description]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function dedupe(rule) {
  return rule.test.toString().replace(/[^a-z]/g, "");
}

/**
 * Dedupe our loader
 * @param  {[type]} webpackConfig [description]
 * @return {[type]}               [description]
 */
function dedupeLoader(webpackConfig) {

  var rules = webpackConfig.module.rules;
  for (var ruleIndex = 0, len = rules.length; ruleIndex < len; ruleIndex++) {
    var test = rules[ruleIndex].test.toString().replace(/[^a-z]/g, "");
    //Get special rule
    webpackConfig = _ramda2.default.takeLastWhile(dedupe, rules);
  }
  return webpackConfig;
}
module.exports = exports['default'];