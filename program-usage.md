### 1.获取配置用于其他程序调用
如果你只是想要获取到通用的配置，然后用于其他地方的webpack打包，只要如下使用就可以了:
```js
   import build from 'webpackcc/lib/build';
   const buildParams = {
      config : customConfigPath,
      onlyCf : true,
      cwd : cwd,
      dev : false
      //如果不指定dev，默认为dev:false,会启动如UglifyJS等插件
    };
    webpackConfig = build(buildParams);
```
此时不会启动打包过程，而仅仅是用于获取到通用的webpack配置而已~~