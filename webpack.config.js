const path = require('path');
module.exports = {
	cache:true,
	output: {
	  path: path.resolve(process.cwd(),'./dist'),
	  filename: 'dist1.js'
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