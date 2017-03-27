const webpack = require('webpack');
module.exports = {
  devServer:{
    port:8888,
    open:true
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin()
  ],
	module:{
   rules:[{
        test: /\.jsx$/,
        exclude:"node_modules",
        // exclude: function(path){
        //        var isNpmModule=!!path.match(/node_modules/);
        //        return isNpmModule;
        //     },
        use:[{
          loader: 'react-hot',
          options:{}
        }]
      },
     {
        test: /\.js$/,
        exclude:"node_modules",
        use:[{
          loader: 'babel-loader',
          options:{}
        }]
      }]
	   }
}

