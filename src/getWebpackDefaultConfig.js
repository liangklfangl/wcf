import join from 'path';
import { existsSync } from 'fs';
import getDefaultBabelConfig from './getBabelDefaultConfig';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
/**
 * @param  {[type]}
 * @return {[type]}
 */
export default function getWebpackCommonConfig(program){

  const packagePath = path.join(program.cwd,'package.json');
  const packageConfig = existsSync(packageConfig) ? require(packagePath) : {};
  //we config the webpack by args 
  const jsFileName = program.hash ? '[name]-[chunkhash].js' : '[name].js';
  const cssFileName = program.hash ? '[name]-[chunkhash].css' : '[name].css';
  const commonName = program.hash ? 'common-[chunkhash].js' : 'common.js';
  return {
   	output: {
      path: join(program.cwd, './dest/'),
      filename: jsFileName,
    },
    devtool: args.devtool,
    entry:packageConfig.entry,
	module: {
	   rules: [
	    	     {
	    	       test: /\.css$/,
	    	        use: ExtractTextPlugin.extract({
	    	          fallback: "style-loader",
	    	          //loader(e.g 'style-loader') that should be used when
	    	          // the CSS is not extracted (i.e. in an additional chunk when allChunks: false)
	    	          use: "css-loader"
	    	          //converting resource to css exporting module
	    	      })
	    	  },
	         {
	          test: /\.js$|\.jsx$/,
	          exclude: /node_modules/,
	          loader: require.resolve('babel-loader'),
	          query: getDefaultBabelConfig(),
	        },
	         
             {
		        test: /\.css$/,
		        use: [
		          'style-loader',
		          'css-loader?importLoaders=1',
		           {
                       loader: 'postcss-loader',
                       options:{
                       	 plugins:function(){
                       	 	 return [
                                   require('precss'),
                                   require('autoprefixer')
                       	 	  ]
                       	 }
                       }
		           }
		         
		        ]
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
    })
  ]

  }

}