import path from 'path';
import { existsSync } from 'fs';
import getDefaultBabelConfig from './getBabelDefaultConfig';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';
import ImageminPlugin from 'imagemin-webpack-plugin';
import autoprefixer from 'autoprefixer';
import LoaderOptionsPlugin from 'webpack/lib/LoaderOptionsPlugin';
import updateRules from "./updateRules/index.js";

function isWin(){
  return process.platform.indexOf('win')===0;
}
/**
 * [deltPathCwd prepend filepath width cwd]
 * @return {[string]} [prepended filepath]
 */
function deltPathCwd(program,object){
  for(const key in object){
     const finalPath=isWin ? path.resolve(program.cwd,object[key]).split(path.sep).join("/") : path.resolve(program.cwd,object[key]);
     object[key]=finalPath;
  }
  return object;
}

/**
 * [isDevMode]
 * @param  {[program]}  program [description]
 * @return {Boolean}         [whether is in development mode]
 */
function isDevMode(program){
   return !!program.dev;
}

/**
 * [getWebpackCommonConfig description]
 * @param  {[type]}  program         [description]
 * @param  {Boolean} isProgramInvoke [Whether or not used as command line]
 * @return {[type]}                  [description]
 */
export default function getWebpackCommonConfig(program,isProgramInvoke){
  let packagePath = path.join(program.cwd,'package.json');
  packagePath = isWin()? packagePath.split(path.sep).join("/"):packagePath;
  const packageConfig = existsSync(packagePath) ? require(packagePath) : {};
  //we config the webpack by program
  const jsFileName = program.hash ? '[name]-[chunkhash].js' : '[name].js';
  const cssFileName = program.hash ? '[name]-[chunkhash].css' : '[name].css';
  const commonName = program.hash ? 'common-[chunkhash].js' : 'common.js';
  const isDev = isDevMode(program);
  //override default vars of less files
  // let theme = {};
  // if (packageConfig.theme && typeof(packageConfig.theme) === 'string') {
  //   let cfgPath = packageConfig.theme;
  //   // relative path
  //   if (cfgPath.charAt(0) === '.') {
  //     cfgPath = path.resolve(program.cwd, cfgPath);
  //   }
  //   const getThemeConfig = require(cfgPath);
  //   theme = getThemeConfig();
  //   // if it's configured as a function ,the we invoke it
  // } else if (packageConfig.theme && typeof(packageConfig.theme) === 'object') {
  //   theme = packageConfig.theme;
  // }
 const lf=isWin() ? path.join(__dirname, '../node_modules').split(path.sep).join("/") :path.join(__dirname, '../node_modules');
 const outputPath = isWin() ? path.join(program.cwd, './dest/').split(path.sep).join("/") : path.join(program.cwd, './dest/') ;

 let commonConfig = {
    cache:false,
     //Cache the generated webpack modules and chunks to improve build speed.
     //Caching is enabled by default while in watch mode
   	output: {
      path: path.resolve(outputPath),
      filename: jsFileName
    },
    resolve:{
      // modules :["node_modules",path.join(__dirname, '../node_modules')],
      // moduleDirectories : ["node_modules"],
      extensions: ['.js', '.jsx', '.json','.less','.scss','.css','.png','*'],
      // last two configuration is for webpack1
      // for detail :https://github.com/webpack/webpack/issues/472#issuecomment-55706013
    },
    devServer:{
      publicPath:'/',
      open :true,
      host:'0.0.0.0',
      port:8080,
      // contentBase:false,
      hot:false
    },
    devtool: program.devtool || "cheap-source-map",
    entry: deltPathCwd(program,packageConfig.entry),
    //prepend it with cwd
    context:isWin() ? path.resolve(program.cwd.split(path.sep).join('/')) : path.resolve(program.cwd),
    //The base directory (absolute path!) for resolving the entry option
  	module: {
      // noParse:[/jquery/],
      //Prevent webpack from parsing any files matching the given regular expression(s)
      //jquery has no other requires
	    rules: [
         {
                test: /\.md$/,
                loaders: [
                  require.resolve("babel-loader"),
                  require.resolve("./loaders/markdownDemoLoader.js")
                ]
         },
            {
              test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
              use: {
              	 loader:require.resolve('url-loader'),
                 //If the file is greater than the limit (in bytes) the file-loader is used and all query parameters are passed to it.
                 //smaller than 10kb will use dataURL
              	 options:{
              	 	limit : 10000
              	 }
              }
             },{
                 test: /\.json$/,
               	 loader:require.resolve('json-loader')
           }, {
           	test: /\.html?$/,
           	use:{
           		loader: require.resolve('html-loader'),
           		options:{
           		}
           	}
          },
          {
	          test: /\.js$/,
	          // exclude: function(path){
           //     var isNpmModule=!!path.match(/node_modules/);
           //     return isNpmModule;
           //  },
            exclude: /node_modules/,
            // exclude :path.resolve("node_modules"),
            //exclude node_modules folder, or we can use include config to include some path
	          use: [{
               loader: require.resolve("babel-loader"),
               options:getDefaultBabelConfig.getDefaultBabel()
            }]
	        },
           {
            test: /\.jsx$/,
            // exclude :path.resolve("node_modules"),
            exclude: /node_modules/,
            // exclude: function(path){
            //    var isNpmModule=!!path.match(/node_modules/);
            //    return isNpmModule;
            // },
            //exclude node_modules folder, or we can use include config to include some path
            use: [{
              loader:require.resolve('babel-loader'),
              options:getDefaultBabelConfig.getDefaultBabel()
            }]
          }
          //ExtractTextPlugin.extract here will throw `self is undefined!`
          //We should not use
         //https://github.com/postcss/postcss-loader
	    ]
	},
  plugins: [
   //from https://github.com/webpack-contrib/extract-text-webpack-plugin
    // new ExtractTextPlugin({
    // 	filename:'etp-[contenthash].css',
    // 	allChunks:false,
    // 	disable:false,
    // 	ignoreOrder:false
    // 	//Disables order check (useful for CSS Modules!),
    // }),
    //chunk less than this size will be merged
    new webpack.optimize.MinChunkSizePlugin({
    	minChunkSize:1000
    }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    //give most used chunk a smaller id
    //CommonsChunkPlugin will boost rebuild performance
    // new webpack.optimize.MergeDuplicateChunksPlugin (),
    //merge them while duplicating
    // new webpack.optimize.RemoveEmptyChunksPlugin()
   //remove empty chunk
   //all of above plugins have been built-in
   //https://github.com/Klathmon/imagemin-webpack-plugin
   new ImageminPlugin({
      test: /\.(jpe?g|png|gif|svg)$/i,
      disable: isDev, // Disable during development
      //https://pngquant.org/
      pngquant: {
        quality: '95-100'
      },
      optipng: null,
      gifsicle :{
        optimizationLevel:1
      },
      //http://www.lcdf.org/gifsicle/
      jpegtran :{
        progressive: false
      }
   }),
   //autoprefixer plugin
    new LoaderOptionsPlugin({
      options: {
        context: '/',
        postcss: function () {
          return [autoprefixer];
        }
      }
    })
   ]
  }
  //Whether or not required by other program
  //we are now in `production` mode， we will extract css file from js file
  if(isProgramInvoke){
     updateRules(commonConfig,false);
     commonConfig.plugins.push(new ExtractTextPlugin({
      filename:'common.css',
      allChunks:false,
      disable:false,
      ignoreOrder:false
      //Disables order check (useful for CSS Modules!),
    }))
  }else{
      // if we are now in `production` mode, we will extract css from js file, else we will not to support HMR
      // so extract method of loader configured must be removed! So in case of this error, we will add this plugin
      // for a hack
    if(!isDevMode(program)){
      commonConfig.plugins.push(new ExtractTextPlugin({
      filename:'common.css',
      allChunks:false,
      disable:false,
      ignoreOrder:false
      //Disables order check (useful for CSS Modules!),
    }))
    }else{
      //But css will not be extracted because we use style-loader to support HMR, so css will be inlined!
     commonConfig.plugins.push(new ExtractTextPlugin({
      filename:'common.css',
      allChunks:false,
      disable:false,
      ignoreOrder:false
      //Disables order check (useful for CSS Modules!),
      }))
    }
  }
 return commonConfig;
}
