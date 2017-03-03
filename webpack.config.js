const path = require('path');
module.exports = {
	cache:false,
	output: {
	  path: path.resolve(process.cwd(),'./dist7'),
	  filename: 'dist3.js'
	},
	module:{
		rules:[
           {
			  test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
			  loader: `${require.resolve('url-loader')}?` +
			  `limit=10000&minetype=image/svg+xml`,
			}
		]
	}
	
}