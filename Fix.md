### 1.这里我们使用了if/else判断来解决程序调用和CLI调用的extract-text-webpack-plugin的不一致，但是程序调用的时候完全设置为common.css而不能添加任何hash

### 2.markdown文件等都不要安装了，减少安装大小

### 3.在指定loader的时候不能使用exclude,否则webpack-merge不能合并，导致jsx的多个use无法完全合并从而导致重复。同时合并的时候也无法使用require.resolve，否则也是不可以合并的

```js
    exclude: function(path){
               var isNpmModule=!!path.match(/node_modules/);
               return isNpmModule;
            },
```

### 4.plugin等也要去重

### 5.plugins和loaders去重了，其他的字段我还没有merge

### 6.如何对babel配置进行修改，添加.babelrc是否可以。我们使用一个webpackMerge进行合并

```js
 {
    "presets": [
    ],
    "plugins": [
      "react-hot-loader/babel"
    ]
  }
```

如果需要如下:

```js
{
  "presets": [
    ["es2015", { "modules": false }],
    "react",
    "airbnb"
  ],
  "plugins": [
    "transform-decorators-legacy",
    "transform-object-rest-spread",
    "react-hot-loader/babel"
  ],
  "env": {
    "test": {
      "plugins": [
        "transform-decorators-legacy",
        "transform-object-rest-spread",
        "istanbul"
      ]
    }
  }
}
```

# 多学学include和exclude来提升效率
# build方法应该允许外部调用来获取通用的webpack配置，build添加一个参数，第三个参数

# 使用definePlugin来判断是否要开启react-hot

```js
   new webpack.DefinePlugin({
          'process.env.NODE_ENV': '"production"'
        }),
```

是不是用了这个插件就可以直接在浏览器代码中直接判断了

# 在yo-react中也使用了DefinePlugin

```js
plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': '"test"'
        })
      ]
```
