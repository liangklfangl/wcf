import path from 'path';
import { existsSync } from 'fs';
import getDefaultBabelConfig from './getBabelDefaultConfig';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';

/**
 * [isWin : whether running in windows platform]
 * @return {Boolean} [description]
 */
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
 * @param  {[type]}
 * @return {[type]}
 */
export default function getWebpackCommonConfig(program){
  let packagePath = path.join(program.cwd,'package.json');
  packagePath = isWin()? packagePath.split(path.sep).join("/"):packagePath;
  const packageConfig = existsSync(packagePath) ? require(packagePath) : {};
  //we config the webpack by program 
  const jsFileName = program.hash ? '[name]-[chunkhash].js' : '[name].js';
  const cssFileName = program.hash ? '[name]-[chunkhash].css' : '[name].css';
  const commonName = program.hash ? 'common-[chunkhash].js' : 'common.js';

  //override default vars of less files
  let theme = {};
  if (packageConfig.theme && typeof(packageConfig.theme) === 'string') {
    let cfgPath = packageConfig.theme;
    // relative path
    if (cfgPath.charAt(0) === '.') {
      cfgPath = path.resolve(program.cwd, cfgPath);
    }
    const getThemeConfig = require(cfgPath);
    theme = getThemeConfig();
    // if it's configured as a function ,the we invoke it 
  } else if (packageConfig.theme && typeof(packageConfig.theme) === 'object') {
    theme = packageConfig.theme;
  }
  return {
   	output: {
      path: isWin() ? path.join(program.cwd, './dest/').split(path.sep).join("/") : path.join(program.cwd, './dest/') ,
      filename: jsFileName,
    },
    devtool: program.devtool,
    entry: deltPathCwd(program,packageConfig.entry),
    //prepend it with cwd
  	module: {
	   rules: [{
              test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
              use: {
              	 loader:'url-loader',
              	 options:{
              	 	limit : 10000
              	 }
              }
             },{ 
                 test: /\.json$/, 
               	 loader:'json-loader'
           }, { 
           	test: /\.html?$/, 
           	use:{
           		loader: 'file-loader',
           		options:{
           		}
           	}
          },{
	          test: /\.js$|\.jsx$/,
	          exclude: /node_modules/,
	          loader: require.resolve('babel-loader'),
	          query: getDefaultBabelConfig(),
	        }, {
             	test:/\.less$/,
             	use:ExtractTextPlugin.extract({
                    fallback : 'style-loader',
                    use :[
                           {
        			              loader: 'css-loader',
        			              options: { 
        			              	 sourceMap: true,
        			              	 importLoaders: 1 
        			              }
        			            },
    	                    {
    	                        loader:'postcss-loader',
    	                        options:{
    	                       	 plugins:function(){
    	                       	 	 return [
    	                                   require('precss'),
    	                                   require('autoprefixer')
    	                       	 	  ]
    	                       	 }
    	                       }
    	                    },
	                     {
	                      loader:'less-loader',
	                      options:{
	                       	sourceMap:true,
	                      	//sourcemaps are only available in conjunction with the extract-text-webpack-plugin
                             modifyVars: JSON.stringify(theme)
                             //using theme config in package.json to modify default less variables
	                      }
	                    }
             	]})
             },
	         //https://github.com/postcss/postcss-loader
             {
		        test: /\.css$/,
		        use: ExtractTextPlugin.extract({
                    fallback : 'style-loader',
                    use:[
		             {
		            	 loader:'css-loader',
			           	 options:{
			           	 	 modules:true,
			           	 	 //enable css module,You can switch it off with :global(...) or :global for selectors and/or rules.
	                         localIdentName: '[path][name]__[local]--[hash:base64:5]',
	                         //path will be replaced by file path(foler path)
	                         //name will be replaced by file name
	                         //local will be replaced by local class name
	                        sourceMap:true,
	                        //the extract-text-webpack-plugin can handle them.
	                        importLoaders: 1,
	                        // That many loaders after the css-loader are used to import resources.
	                        minimize: true,
	                        //You can also disable or enforce minification with the minimize query parameter.
	                        camelCase: true
			           	 }
			           	 //https://github.com/webpack-contrib/css-loader#css-composing
			           },
			            {
                   loader: 'postcss-loader?sourceMap=inline',
                   options:{
                   	 plugins:function(){
                   	 	 return [
                               require('autoprefixer')({
                                     browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4'],
                                     //browsers (array): list of browsers query (like last 2 version), which are supported in 
                                     //your project. We recommend to use browserslist config or browserslist key in package.json, 
                                     //rather than this option to share browsers with other tools. See Browserslist docs for available queries and default value.
                                     cascade : true,
                                     //then beatified as follows with right indent
                                    //-webkit-transform: rotate(45deg);
                                    //        transform: rotate(45deg); 
                                    add : false,
                                    //Autoprefixer will only clean outdated prefixes, but will not add any new prefixes.  
                                    remove :false ,
                                    //By default, Autoprefixer also removes outdated prefixes.
                                    //You can disable this behavior with the remove: false option. 
                                    //If you have no legacy code, this option will make Autoprefixer about 10% faster.  
                                    support : true,
                                    //should Autoprefixer add prefixes for @supports parameters.  
                                    flexbox : true,                   	                                 
                                    //should Autoprefixer add prefixes for flexbox properties. With "no-2009" 
                                    //value Autoprefixer will add prefixes only for final and IE versions of specification. Default is true.
                                    grid  :true,
                                    //should Autoprefixer add IE prefixes for Grid Layout properties
                                    // more in https://github.com/postcss/autoprefixer
                                  })
	                       	 	  ]
	                       	 }
	                       }
			           }
		         
		        ]})
		      }
	    ]
	},
  plugins: [
   //from https://github.com/webpack-contrib/extract-text-webpack-plugin
    new ExtractTextPlugin({
    	filename:'extracted-text-plugin-generated-[contenthash].css',
    	allChunks:false,
    	disable:false,
    	ignoreOrder:false
    	//Disables order check (useful for CSS Modules!),
    }),
    //chunk less than this size will be merged
    new webpack.optimize.MinChunkSizePlugin({
    	minChunkSize:1000
    }),
    // new webpack.optimize.OccurenceOrderPlugin(),
    //give most used chunk a smaller id
    new webpack.optimize.CommonsChunkPlugin({
         name:'common',
         minChunks:2,
         filename:commonName
      }),
    // new webpack.optimize.MergeDuplicateChunksPlugin (),
    //merge them while duplicating
    // new webpack.optimize.RemoveEmptyChunksPlugin()
   //remove empty chunk
  ]

  }

}