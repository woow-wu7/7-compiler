# 手写webpack-Compiler
- 新建 7-compiler 文件夹
- yarn init -y 或者 npm init -y 来初始化项目

### 资料
- [[手写webpack-Compiler] - 我的掘金文章](https://juejin.cn/post/6844903973002936327)
- [[webapck基础] - 我的掘金文章](https://juejin.cn/post/6844904070201753608#heading-0)

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
  - **apply方法的参数**: 是 const compilerInstance = new Compiler() 生成的实例对象
  - **compilerInstance**: 具有hooks属性，hooks对象中具有不同的生命周期钩子函数，比如 hooks.afterPlugin
- plugin是在Compiler类的构造函数中进行处理的
  - 1.具体就是遍历plugins数组，执行每个plugin中的apply方法
  - 2.在 apply 方法中，调用比如 compilerInstance.hooks.afterPlugin.tap() 进行钩子监听注册
      - **生命周期钩子注册**: `在plugin中进行tap()注册`, `注册方法tap被调用的时机是在Compiler的constructor()中，因为最先执行`
      - **生命周期钩子调用**: `在Compiler类不同的实例方法中call()调用`

### (5) loader
- loader的处理时机
  - loader是在 `new Compiler.run()` 中的 `buildModules()` 函数中的 `getSource()` 函数中处理的
  - `getSource(moduleAbsolute)` 中通过 `fs.readFileSync()` 获取源码字符串后处理 `loader`
- loader的加载顺序
  - 从右往左，上下往上