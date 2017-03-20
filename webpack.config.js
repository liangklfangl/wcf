module.exports = {
	module:{
       rules:[
          {
          	test:/\.md$/,
          	loader:'./test/loaders/markdown-data-loader'
          }
       ]
	}
}