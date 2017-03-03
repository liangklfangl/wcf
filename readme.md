### 1.该工具的两种模式

首先必须说明一下，该工具是基于webpack2的，所以很多配置都是需要遵守webpack2规范的。

#### 1.1 webpack-dev-server模式

这种模式你只要在wcf后添加devServer参数，表明我们的文件应该使用compiler.outputFileSystem=MemoryFileSystem来完成。此时不会在output.path下产生我们的文件，而是直接从内存中获取，结合URL映射的方式。同时该模式会自动在output.path路径下通过html-webpack-plugin产生一个html(内存中不可见,同时需要加上--dev表明是开发模式),并自动加载我们的所有chunk.

```js
 wcf --devServer --dev
 //此时打开localhost:8080就会看到我们使用test/index.html作为template的页面
```

#### 1.2 webpack本身的watch模式

这种模式使用webpack自己的watch方法来完成，监听package.json中entry配置的文件的变化。你需要添加--watch --dev。如下:

```js
wcf --watch --dev
```

该模式除了会监听entry文件的变化，当我们自定义的webpack.config.js(通过--config传入)文件内容变化的时候也会自动重新进行编译！

#### 1.2 webpack普通模式

此时不会监听文件的变化，只是完成webpack的一次编译。

```js
wcf
```


### 2.该工具的配置参数






### 2.需要添加的功能
重新开启一个子Compiler，该compiler集成了DLLPlugin生成我们的manifest文件

通过一个开关决定是打开watch模式还是dev-server模式,如果开启了dev-server这种模式必须使用html-webpack-plugin产生html，因为他会把产生的chunk按照name封装到html中，否则我们的defaultWebpack中的output.name是通过[name].[hash]这种方式的，所以也是不知道具体的文件名从而引用的

### 1.基本配置


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

#### 1.10 用户自定义配置文件

如果用户觉得需要自己定义配置文件，那么可以定义一个自定义的配置文件路径并传入，但是该配置文件必须export一个函数，该函数接受默认的webpack配置作为参数，用户可以通过此函数对webpack的默认配置进行更新(该文件默认路径是process.cwd)。

```js
export default function mergeCustomConfig(webpackConfig, customConfigPath) {
  if (!existsSync(customConfigPath)) {
    return webpackConfig;
  }
  const customConfig = require(customConfigPath);
  if (typeof customConfig === 'function') {
    return customConfig(webpackConfig, ...[...arguments].slice(2));
  }
  throw new Error(`Return of ${customConfigPath} must be a function.`);
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

为了保证开发环境的效率，在使用wcf的时候建议传入--dev表明在开发环境中，这时候wcf会安装一些仅仅在开发环境使用的包。

开发环境的包：

```js
NpmInstallPlugin
ExtractTextPlugin
CommonsChunkPlugin
MinChunkSizePlugin
HotModuleReplacementPlugin
HtmlWebpackPlugin
//在output目录下产生一个index.html，但是该文件是在内存中的
```

生产环境的包：

```js
UglifyJsPlugin
DefinePlugin
ImageminPlugin
```





1. 为了使用DLLPlugin，我们需要在一个目录下传入webpack.dllPlugin.js和vendor.js，我们会自动寻找这两个文件并进行编译,否则会遍历每一个目录查找我们的文件，效率很低。第一步：--dll单独打包为manifest.json 第二步：--manifest manifest.json把manifest.json传入打包(此时不需要同时传入--dll --manifest)

### 遇到的问题

#### 我们文件名采用的是chunhash,必须js变化才能导致通过extract-text-plugin抽取的css变化，而直接修改css文件无法导致HMR？

<code>chunkhash</code>问题：

当css和js共存了，编译的时候以js作为入口文件，那么js变化了那么chunkhash会变化，同时css变化了chunkhash也会变化，因为js和css会被打包到一个文件中。这样，只要有一个文件变化了，那么另外一个文件都会失效！

<code>contenthash</code>问题：

是extract-text-webpack-plugin来提供，将css和js单独打上独立的指纹，那么css变化不会影响js失效，同时js变化也不会css失效。

<code>HMR</code>问题：

HMR必须要模块支持，只有一个模块含有HMR代码才行。在大多数情况下，不需要在每一个模块中都写入HMR代码，如果一个模块没有HMR处理函数，那么就会向上冒泡，也就是说我们只需要一个HMR函数就可以处理整个模块树的更新操作。如果模块树中一个模块更新了，那么整个模块树都会重新加载。

####基于webpack2