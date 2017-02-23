### 2.需要添加的功能
重新开启一个子Compiler，该compiler集成了DLLPlugin生成我们的manifest文件


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



###Plugins

1. 为了使用DLLPlugin，我们需要在一个目录下传入webpack.dllPlugin.js和vendor.js，我们会自动寻找这两个文件并进行编译,否则会遍历每一个目录查找我们的文件，效率很低。第一步：--dll单独打包为manifest.json 第二步：--manifest manifest.json把manifest.json传入打包(此时不需要同时传入--dll --manifest)