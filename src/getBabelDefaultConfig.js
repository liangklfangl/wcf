import { tmpdir } from 'os';
/**
 * @return {[type]}
 */
export default function getDefaultBabelConfig(){
 return {
    cacheDirectory: tmpdir(),
    //We must set!
    presets: [
      require.resolve('babel-preset-es2015-ie'),
      require.resolve('babel-preset-react'),
      require.resolve('babel-preset-stage-0'),
    ],
    plugins: [
      require.resolve('babel-plugin-add-module-exports'),
      require.resolve('babel-plugin-transform-decorators-legacy'),
    ],
  };
}