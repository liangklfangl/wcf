 
                {
                  loader:require.resolve('postcss-loader'),
                   options:{
                       plugins:function(){
                           return [
                             require.resolve('precss'),
                             require.resolve('autoprefixer')
                            ]
                       }
                   }
                }
              ]})
            },