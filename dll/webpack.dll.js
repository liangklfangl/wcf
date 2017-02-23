var path = require("path");
var webpack = require("webpack");

module.exports = {
    entry: {
        vendor: [path.join(__dirname, "vendors.js")]
    },
    //entry file is in client folder
    output: {
        path: path.join(__dirname, "dist", "dll"),
        filename: "dll.[name].js",
        library: "[name]"
    },
    //output file is in dist/dll folder
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, "dll", "[name]-manifest.json"),
            //The manifest is very important, it gives other Webpack configurations 
            //a map to your already built modules. Path represent where to generate manifest file
            name: "[name]",
            // the name is the name of the entry
            context: path.resolve(__dirname)
            //The context is the root of your client source code (location to put vendors files)
        }),
        // new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ],
    resolve: {
        modules:["node_modules",path.resolve(__dirname)]
    }
};