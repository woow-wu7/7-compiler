# 手写webpack-Compiler
- 新建 7-compiler 文件夹
- yarn init -y 或者 npm init -y 来初始化项目

### 资料
- [[手写webpack-Compiler] - 我的掘金文章](https://juejin.cn/post/6844903973002936327)
- [[webapck基础] - 我的掘金文章](https://juejin.cn/post/6844904070201753608#heading-0)

### 说明
- `webpack.config.7compiler.js` 是传入 `7-compiler.js` 用于手写 `Compiler` 的配置文件
- `webpack.config.js` 是用来学习webpack基础的配置文件
- `cnpm run 7-pack`: 使用自己的 Compiler 打包
- `cnpm run build`: 使用 webpack 打包

### (1) 相关依赖
- yarn add @babel/parser @babel/traverse @babel/types @babel/generator
- yarn add ejs
- yarn add webpack webpack-cli
  - 安装 webpack 和 webpack-cli 主要就是打包后，获取里面的ejs模板内容
- yarn add less
- yarn add tapable


### (2) 打包需要处理 loader 和 plugin
- plugin是在 ( `Compiler` ) 类的 ( `constructor` ) 中处理的
- loader是在 ( `new Compiler().run` ) 方法中的 ( `buildModules()` ) 函数中的 ( `getSource()` ) 函数获得源码后处理的

### (3) 自定义命令
- `cnpm run build`: 使用 webpack 打包
- `cnpm run 7-pack`: 使用自己的 Compiler 打包
- 具体看 `package.json` 中的配置 


### (4) Plugin
- 每个plugin都是一个class类，并且每个plugin都具有apply方法
- apply(compiler)
  - **apply方法的参数**: 是 `const compilerInstance = new Compiler()` 生成的实例对象
  - **compilerInstance**: 具有hooks属性，hooks对象中具有不同的生命周期钩子函数，比如 hooks.afterPlugin
- plugin是在Compiler类的构造函数中进行处理的
  - 1.具体就是遍历plugins数组，执行每个plugin中的apply方法
  - 2.在 apply 方法中，调用比如 compilerInstance.hooks.afterPlugin.tap() 进行钩子监听注册
      - **生命周期钩子注册**: `在plugin中进行tap()注册`, `tap()被调用是在Compiler的constructor()中，最先执行`
      - **生命周期钩子调用**: `在Compiler类不同的实例方法中通过call()调用`

### (5) loader
- loader的处理时机
  - loader是在 `new Compiler.run()` 中的 `buildModules()` 函数中的 `getSource()` 函数中处理的
  - `getSource(moduleAbsolute)` 中通过 `fs.readFileSync()` 获取源码字符串后处理 `loader`
- loader的加载顺序
  - 从右往左，上下往上


---
---
# (二) webpack 基础学习

### 一些单词
```
template: 模板
compilation: 编译 // compiler
basic useage: 基本用法
relate: 联系，讲述
```

### (1) 启动开发服务器express，并直接在浏览器中显示打包后的网页
- **webpack-dev-server**
  - npm install -D webpack-dev-server
  - 只在开发环境中需要，即development环境
  - 可以指定需要启动静态服务的文件夹，并通过命令 webpack-dev-server 来启动静态服务
  - 可以直接配置到 package.json 的 scripts 命令中去
- **html-webpack-plugin**
  - 安装: npm install -D html-webpack-plugin 
  - 作用: 指定模板html，并将该html打包到output.path指定的文件夹中，并自动引入打包后的js等资源文件
  - 可以指定template,filename,hash等
```

```

