# 目录

- 手写 webpack-Compiler
- webpack 基础学习
- webpack 性能优化

# (一)手写 webpack-Compiler

- 新建 7-compiler 文件夹
- yarn init -y 或者 npm init -y 来初始化项目

### 资料

- [手写 webpack-Compiler - 我的掘金文章](https://juejin.cn/post/6844903973002936327)
- [webpack 基础 - 我的掘金文章](https://juejin.cn/post/6844904070201753608#heading-0)
- [思维导读](https://github.com/woow-wu7/7-compiler/tree/main/src/images/Compiler.png)
- [webpack-常见面试题](https://github.com/woow-wu7/6-penetrate/tree/main/2-FRONTEND/8-WEBPACK)

### 说明

- `webpack.config.7compiler.js` 是传入 `7-compiler.js` 用于手写 `Compiler` 的配置文件
- `webpack.config.js` 是用来学习 webpack 基础的配置文件
- `webpack.config.prod.js` 是用来测试 `webpack-merge` 合并配置的插件，用来复用配置
- `cnpm run 7-pack`: 使用自己的 Compiler 打包
- `cnpm run build`: 使用 webpack 打包

### (1) 相关依赖

- yarn add @babel/parser @babel/traverse @babel/types @babel/generator
- yarn add ejs
- yarn add webpack webpack-cli
  - 安装 webpack 和 webpack-cli 主要就是打包后，获取里面的 ejs 模板内容
- yarn add less
- yarn add tapable

### (2) 打包需要处理 loader 和 plugin

- plugin 是在 ( `Compiler` ) 类的 ( `constructor` ) 中处理的
- loader 是在 ( `new Compiler().run` ) 方法中的 ( `buildModules()` ) 函数中的 ( `getSource()` ) 函数获得源码后处理的

### (3) 自定义命令

- `cnpm run build`: 使用 webpack 打包
- `cnpm run 7-pack`: 使用自己的 Compiler 打包
- 具体看 `package.json` 中的配置

### (4) Plugin

- 每个 plugin 都是一个 class 类，并且每个 plugin 都具有 apply 方法
- apply(compiler)
  - **apply 方法的参数**: 是 `const compilerInstance = new Compiler()` 生成的实例对象
  - **compilerInstance**: 具有 hooks 属性，hooks 对象中具有不同的生命周期钩子函数，比如 hooks.afterPlugin
- plugin 是在 Compiler 类的构造函数中进行处理的
  - 1.具体就是遍历 plugins 数组，执行每个 plugin 中的 apply 方法
  - 2.在 apply 方法中，调用比如 compilerInstance.hooks.afterPlugin.tap() 进行钩子监听注册
    - **生命周期钩子注册**: `在plugin中进行tap()注册`, `tap()被调用是在Compiler的constructor()中，最先执行`
    - **生命周期钩子调用**: `在Compiler类不同的实例方法中通过call()调用`

### (5) loader

- loader 的处理时机
  - loader 是在 `new Compiler.run()` 中的 `buildModules()` 函数中的 `getSource()` 函数中处理的
  - `getSource(moduleAbsolute)` 中通过 `fs.readFileSync()` 获取源码字符串后处理 `loader`
- loader 的加载顺序
  - 从右往左，上下往上

---

---

---

# (二) webpack 基础学习

### 一些单词

```
template: 模板
compilation: 编译 // compiler
basic useage: 基本用法
relate: 联系，讲述
appropriage: 适当的
extract: 抽离，提取 // mini-css-extract-plugin
parallel: 平行，并行
minilizer: 最小化
optimization: 最佳的
proposal: 提议，建议 // @babel/plugin-proposal-decorators
decorators: 装饰工
uglify: 丑陋的 // uglifyjs-webpack-plugin压缩js为一行，丑
```

### 一些基础知识

- webpack 是什么？
  - webpack 是一个 ( 模块打包工具 )
  - 打包 js 文件: 最基本的就是打包 ( js ) 文件
  - 打包其他文件: 如果添加了 ( loader ) 则可以打包其他任何类型的文件
- 特点
  - 默认配置
    - 0 配置：可以不需要任何配置文件，即 0 配置；不过在真实的项目中还是需要通过 webpack.config.js 去配置 webpack，打包我们想要的资源
    - 命令：npx webpack xxx.js
    - 默认打包后生成的文件夹：dist
    - 默认打包后生成的文件：main.js
    - 默认加载的配置文件：webpack.config.js || webpackfile.js
    - 指定自定义的配置文件：npx webpack --config xxxxx
- 一些链接
  - 2021/10/25 复习时，新开的 webpack 复习项目：https://github.com/woow-wu7/6-review/tree/main/JS/webpack
- 一些面试题
  - 1
  - hash chunkhash contenthash 的区别
  - 请看 webpack.config.js 中的 output

### 环境配置

- 安装相关依赖
  - npm install -D webpack webpack-cli // 只是开发时依赖，线上使用打包后的文件
  - npm install -D html-webpack-plugin
  - npm install -D webpack-dev-server
    - webpack-dev-server 用于实现一个简单的 web 服务
    - 1.在 webpack.config.js 中配置；
    - 2.在 package.json 的 script 中写入命令启动 `dev: webpack-dev-server`
  - 详见下面的(1)(2)(3)(4)(5)

### (1) 启动开发服务器 express，并直接在浏览器中显示打包后的网页

- **webpack-dev-server**
  - npm install -D webpack-dev-server
  - 只在开发环境中需要，即 development 环境
  - 可以指定需要启动静态服务的文件夹，并通过命令 webpack-dev-server 来启动静态服务
  - 可以直接配置到 package.json 的 scripts 命令中去，比如： scripts: { "dev": "webpack-dev-server"}
- **html-webpack-plugin**
  - 安装: npm install -D html-webpack-plugin
  - 作用: 指定模板 html，并将该 html 打包到 output.path 指定的文件夹中，并自动引入打包后的 js 等资源文件
  - 可以指定 template,filename,hash 等

### (2) css 相关

- **style-loader**
- **css-loader**
- **sass-loader**
- **sass**
- **node-sass 或者 dart-sass, webpack 官方建议使用 dart-sass**
- **mini-css-extract-plugin**
- **postcss-loader**
- **autoprefixer** 需要在 package.json 的 browserslist 中添加一些浏览器信息
- **optimize-css-assets-webpack-plugin**
- 安装
  - `npm install style-loader css-loader sass-loader sass node-sass -D` sass css
  - `npm install mini-css-extract-plugin -D` 单独抽离，自动引入
  - `npm install postcss-loader autoprefixer` 添加浏览器的前缀，可单独配置 postcss.config.js

### (3) 压缩 css 和 js

- **optimize-css-assets-webpack-plugin** 压缩 css
- **uglifyjs-webpack-plugin** 压缩 js
- 压缩打包后的 css 和 js，这样 css 和 js 文件都只有一行，并且函数名等都会得到优化
- 安装
  - `npm install optimize-css-assets-webpack-plugin uglifyjs-webpack-plugin -D`

### (4) js 相关

- babel-loader
- @babel/core // 核心
- @babel/preset-env
- @babel/plugin-proposal-decorators // 装饰器语法; proposal 是提议，建议的意思
- @babel/plugin-proposal-class-properties // class 语法
- @babel/plugin-transform-runtime
- @babel/runtime // 注意是该依赖是 dependencies 而不是 devDependencies
- @babel/polyfill // 直接在入口 js 文件中引入
- babel 的配置
  - 可以新建 `.babelrc` 文件单独配置
  - 可以在 webpack 的 loader 配置的 `babel-loader` 的 `options` 中配置
- @babel/plugin-proposal-decorators 和 @babel/plugin-proposal-class-properties 的顺序
  - @babel/plugin-proposal-decorators --------------在前
  - @babel/plugin-proposal-class-properties---------在后
- `npm install babel-loader @babel/core @babel/preset-env -D`
- `npm install @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators -D`
- `npm install @babel/plugin-transform-runtime -D`
- `npm install @babel/runtime -S` 注意是-S
- `npm install @babel/polyfill -S` 注意是-S

### (5) 图片处理相关

- file-loader
- url-loader // 小于阈值会转成 base64，大于阈值会使用 file-loader
- html-withimg-loder
- `npm install file-loader url-loader html-withimg-loader -D`
- [url-loader 官网说明](https://webpack.docschina.org/loaders/url-loader/#root)

---

---

---

# (三) webpack 优化

### (1) noParse

- `module.noParse`
- 作用
  - 如果：包没有其他的依赖项，则可以通过 ( module.noParse ) 使 ( webpack 不去解析该包的依赖关系 )，提高构建速度
  - 所以：该包中：不能含有 import，require，define 等任何的导入机制
- 实例
  - 比如：我们安装了 jquery 和 lodash 两个库
  - 因为：我们知道这两个库没有依赖其他任何的别的库，即没有依赖项，所以在 webpack 解析时不去查找该库的依赖关系提升打包速度

```
module: {
  noParse: /jquery|lodash/, // ------ 不去解析jquery或lodash的依赖关系，因为它们俩都没有依赖其他库，从而提高构建速度
  rules: []
}
```

### (2) include 和 exclude

- 在配置 `module.rules` 数组中，每个对象成员中设置 include 和 exclude 来缩小 ( 查找匹配文件的范围 )
- 原理
  - 因为：在 module.rules 数组中，是配置 loader 的地方
  - 因为：loader 在寻找需要匹配文件时(loader 需要匹配的文件通过 test 正则指定)，默认是会去寻找 ( node_modules ) 文件的，而我们真正需要用 loader 去解析的文件是我们自己开发的文件
  - 所以：
    - 可以通过 exclude 来指定哪些文件范围是不需使用 loader 去解析的，是一个正则
    - 可以通过 include 来制定哪些文件范围是需要时使用 loader 去解析的，是一个正则

```
module: {
  noParse: /xxxx/,
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }
  ]
}
```

### (3) webpack.IgnorePlugin

- 作用
  - 如果引入了一个库，要忽略掉这个库引入的文件时候，可以使用 webpack.ignorePlugin
  - 忽略掉后，可以自己手动的引入包中的一部分文件，则只打包一部分，而不是整个一起打包引入

```
// 0
// 比如我们的业务代码中使用到了下面的代码
// webpack.IgnorePlugin()
// moment
// 优化前：moment内部默认会去加载所有的语言包，但是一般情况我们也只会用到中文或英文，导致moment打包后的文件比较大
// 优化后：使用 webpack.IgnorePlugin 内置插件，忽略掉moment中引入的 ./local 中的所有文件，我们自己手动引入需要的其中一两个文件即可
// 具体步骤：
//  - 看第2步
//  - 然后在需要使用 local 的地方，手动引入

1. 优化过程0
const moment = require("moment");
moment.locale("zh-cn"); // 使用zh-cn语言包，未做优化前，虽然只使用了一个语言包zh-cn，但是会打包所有的 ./local 文件，里面包含所有的语言包
const time = moment().format("MMMM Do YYYY, h:mm:ss a");
console.log(`time`, time);


2. 优化过程1
plugins: [
  new webpack.IgnorePlugin(/\.\/local/, /moment/), // 表示从moment中如果引入了 ./local 文件路径，则把 ./local  中的所有文件忽略掉
],


3. 优化过程2
在第 0 步中，我们在手动引入local
const moment = require("moment");
require('moment/local/zh-cn')
moment.locale("zh-cn"); // 使用zh-cn语言包，未做优化前，虽然只使用了一个语言包zh-cn，但是会打包所有的 ./local 文件，里面包含所有的语言包
const time = moment().format("MMMM Do YYYY, h:mm:ss a");
console.log(`time`, time);
```

### (4) DllPlugin 和 DllReferencePlugin

- 动态链接库
  - **DllPlugin**
    - 主要用来单独打包第三方包时，生成一个 json 的任务清单
    - `name`
    - `path`
  - **DllReferencePlugin**
    - 主要作用就是 ( 引用动态连结库 )
    - 我们在模版 html 中，手动引入打包好的第三方包时，告诉 webpack 先去 （ dll 动态链接库 ) 中查找
    - `manifest`
  - webpack.DllPlugin
  - webpack.DllReferencePlugin
- 安装
  - 首先我们安装 cnpm install react react-dom -S
  - 然后我们安装 cnpm install @babel/preset-env @babel/preset-react
- 配置
  - 在使用 babel-loader 的地方做如下配置

```
webpack.config.js
-------
{
  test: /\.js$/,
  exclude: /node_modules/,
  use: [
    {
      loader: "babel-loader",
      options: {
        presets: [
          ['@babel/preset-env'],
          ['@babel/preset-react']
        ],
      }
    },
  ],
}
```

- 使用 react

```
index.js
-------

import React from 'react'
import ReactDOM from 'react-dom'
console.log(ReactDOM.render, 'ReactDOM.render')
ReactDOM.render(<h1>jsx</h1>, document.getElementById('root')) // 在root节点中插入h1标签的内容，默认会作为第一个子元素
```

- **优化需求说明**
  - 因为：我们上面安装了 react 和 reactDOM，但是我们每次修改业务代码后，从新打包都要再把 react 和 reactDOM 再打包一次
  - 但是：但是它们是第三方库，并没有修改过这些第三方包，是不需要重新打包的
  - 所以：我们可以把 react 和 reactDOM 等这些第三方包单独打包，然后引用打包好的第三方文件，在之后修改业务文件后，还是直接引用打包后的第三方包，就不用再从新打包第三方包了
  - 最终：提高了打包的速度
  - 实现：我们通过 动态连结库 来实现

```
1
webpack.config.js中的output配置项目
- library
- libraryTarget
-------

output: {
  filename: "[name].[hash:8].js",
  path: path.resolve(__dirname, "build"),
  library: '[name]', // 将打包后的模块赋值给变量，变量的命名是entry对象中制定的key，并导出；当然这里也可以指定具体的变量值，比图 library: 'abc'
  libraryTarget: 'commonjs' // 使用commonjs的方式导出，即 export.default 的方式导出
},
```

- **需求实现的具体流程**！！！！！！！！！
  - **webpack.DllPlugin**
    - 是 webpack 内置的插件
      - 其他的内置插件还有：
      - webpack.DefinePlugin 定义环境变量，相当于全局常量
      - webpack.IgnorePlugin 忽略第三方包引入的文件或者文件夹
      - webpack.ProvidePlugin 暴露包的名字，改名
      - webpack.BannerPlugin 打包的 js 的最前面注入一些信息字符串，是注释性的代码
      - webpack.DllPlugin 生成第三方库的动态链接库 manifest.json
      - webpack.DllReferencePlugin 引用动态链接库，不存在再进行打包
  - 1.新建 **webpack.config.react.js** // 用来专门打包 react 和 react-dom 的 webpack 配置文件
    - entry:{react:['react', 'react-dom']} // 设置入口
    - output 中添加
      - filename
      - path
      - library(打包后赋值给变量)
      - libraryTarget(变量的类型，比如 var，commonjs，umd)
    - 引入 webpack.DllPlugin 插件
      - name
      - path
        - path 最终是指定的一个`json`文件
        - manifest.json，我们一般叫做任务清单
  - 2.因为：在模版 html 中手动引入打包好的第三方包，但是 webpack 并知道指定的 script 标签中的 src 路径
  - 3.所以：
    - 我们在 js 引入 react 和 react-dom 时，是需要告诉 webpack 去打包好的 react 和 react-dom 包路径中去查找，而不是去 node_modules 中查找并打包
    - 即：先去 ( dll 动态链接库 ) 中查找，找不到再去 node_modules 中查找并打包
    - 所以：引入 webpack.DllReferencePlugin 去 ( 引用动态链接库 )
  - 4.**webpack.DllReferencePlugin**
    - 在 **webpack.config.js** 中做如下配置
    - `new webpack.DllReferencePlugin({manifest: path.resolve(__dirname, 'dist', 'manifest.json')})`

### (5) happyPack

- 作用: 开启多线程打包
- 分类：可以对 js 类型进行配置 happypack 进行打包，同时也可以对 css 等其他资源设置多线程打包
- 具体设置过程如下

```
happypack 多线程打包
-------

1
在 webpack.config.js 的 module.rules 中配置解析js文件时使用happypack
const HappyPack = require("happypack");
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: 'HappyPack/loader?id=js' // 使用happypack插件，实现多线程打包
    },
  ]
}

2. 在 webpack.config.js 的 plugins 中配置如下
plugins: [
  new HappyPack({
   id: "js", // id是在 module.rules > use: 'happypack/loader?id=js'中指定的
   use: [
     {
       loader: "babel-loader", // options已在 .babelrc 文件中单独配置
       options: {
         presets: [["@babel/preset-env"], ["@babel/preset-react"]],
       },
     },
   ],
 }),
]
```

### (6) webpack 的一些自带的优化

- **tree-shaking**
  - 当我们使用 `import` 语法时，webpack 在打包的时候会自动的去除掉模块中没有使用到的方法和变量，我们叫 tree-shaking
  - 只能是 import 语法，而不能是 require 即 require 不会 tree-shaking
  - 关键词
    - import
    - tree-shaking
- **scope-host**
  - webpack 会自动省略一些可以优化的代码
  - 比如声明了多个常量相加，webpack 就不会声明多常量，而是把他们合并成一个表达式

### (7) 抽离公共代码

- 使用场景
  - **当存在多个入口时，同时多个入口使用到了相同的代码时，可以把公共的代码抽离出来**
  - 比如：index1.js 和 index2.js 两个入口文件，都使用到了 a，b 两个模块，就可以把 a 和 b 单独抽离出来

```
splitChunks: {
  cacheGroups: {
    common: {
      name: 'commons',
      chunks: 'initial',
      minChunks: 2,
      priority: 10,
      minSize: 0,
    },
    vendor: { // vendor是小贩的意思
      test: /node_modules/, // 范围是node_modules中的第三方依赖，注意zhe
      name: 'vendors', // 抽离出来的包的名字
      chunks: 'initial', // 初始化加载的时候就抽离公共代码
      minChunks: 1, // 被引用的次数
      priority: 11, // priority: 是优先级的意思，数字越大表示优先级越高
      minSize: 0,
    }
  }
}
```

### (8) 懒加载

- 主要就是使用 `import()` 函数，实现`动态加载模块(懒加载)`
- import()
  - 参数：文件路径
  - 返回值：返回一个`promise` 对象
  - 特点
    - import()函数可以用在任何地方，不仅仅是模块，非模块的脚本也可以使用
    - 它是运行时执行，也就是说，什么时候运行到这一句，就会加载指定的模块
  - 使用场景
    - 按需加载
    - 条件加载
    - 动态的模块路径

```
const button = document.createElement("button");
button.innerHTML = "动态加载";
button.style.border = "10px solid blue";
button.style.margin = "10px";
button.addEventListener("click", () => {
  import("./test-import().js").then((res) =>
    console.log(`动态获取，动态引入模块中的导出的值`, res.default.a)
  );
});
document.documentElement.insertBefore(button, document.body);
```
