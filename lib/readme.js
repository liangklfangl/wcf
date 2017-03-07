// {
//              test: /\.less$/,
//              use: ExtractTextPlugin.extract({[
//                {
//                  loader:require.resolve('style-loader'),
//                  option:{

//                  }
//               },
//                 { 
//                  loader: require.resolve('css-loader'), 
//                   options: { 
//                     modules:true,
//                    //enable css module,You can switch it off with :global(...) or :global for selectors and/or rules.
//                     localIdentName: '[path][name]__[local]--[hash:base64:5]',
//                     //path will be replaced by file path(foler path relative to project root)
//                     //name will be replaced by file name
//                     //local will be replaced by local class name
//                    sourceMap:true,
//                    //the extract-text-webpack-plugin can handle them.
//                    importLoaders: 1,
//                    // That many loaders after the css-loader are used to import resources.
//                    minimize: true,
//                    //You can also disable or enforce minification with the minimize query parameter.
//                    camelCase: false
//                   }
//                },
//                {
//                  loader: require.resolve('less-loader'),
//                  options:{
//                      sourceMap:true,
//                      lessPlugins:[]
//                     //sourcemaps are only available in conjunction with the extract-text-webpack-plugin
//                    // modifyVars: JSON.stringify(theme)
//                   //using theme config in package.json to modify default less variables
//                  }
//                },
//                {
//                  loader:require.resolve('postcss-loader'),
//                   options:{
//                       plugins:function(){
//                           return [
//                             require.resolve('precss'),
//                             require.resolve('autoprefixer')
//                            ]
//                       }
//                   }
//                }
//              ]})
//            },
"use strict";