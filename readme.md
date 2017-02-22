### 1.configuration

 --dev :

 Whether is in development mode. The default value is false , meaning that we are in production mode! So , do not forget to input "--dev" to switch to development mode for performance enhancement (removing some plugins in this mode).

 ```js
function isDevMode(program){
   return !!program.dev;
}
 ```


```js
  if (!program.verbose) {
    compiler.plugin('done', (stats1) => {
      stats1.stats.forEach((stat) => {
        stat.compilation.children = stat.compilation.children.filter((child) => {
          return child.name !== 'extract-text-webpack-plugin';
        });
      });
    });
  }
```



### 1.wcf(webpack configuration )

 it is based webpack

### using theme in package.json to override less variables

### in windows platform, we input ./bin/wcf directly in command line tools



### tips

#### loaders features

1. `resolve.modules` has no effect, so we prefix our path manually

```js
 const lf=isWin() ? path.join(__dirname, '../node_modules').split(path.sep).join("/") :path.join(__dirname, '../node_modules');

```


### what you can do ?

1. use import or require to load your css files with help of less-loader

```js
 import css from './index.less';
 //or 
 const css = require('./index.less');
```

2.postprocess your css

```js
{
 //autoprefix your css
  loader:'postcss-loader',
  options:{
   plugins:function(){
     return [
           require('precss'),
           require('autoprefixer')
      ]
   }
 }
}
```

3. support css modules 

```js
{
  loader: 'css-loader',
  options: { 
      modules:true,
      //enable css module,You can switch it off with :global(...) or :global for selectors and/or rules.
       localIdentName: '[path][name]__[local]--[hash:base64:5]',
       //path will be replaced by file path(foler path). (relative to root foler)
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
}
```

4.image loader

```js
{
  test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
  use: {
     loader:'url-loader',
     //If the file is greater than the limit (in bytes) the file-loader is used and all query parameters are passed to it.
     //smaller than 10kb will use dataURL
     options:{
      limit : 10000
     }
  }
 }
```


