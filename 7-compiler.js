const path = require("path");
const fs = require("fs");
const babelParser = require("@babel/parser"); // 解析
const babelTraverse = require("@babel/traverse").default; // 遍历
const babelTypes = require("@babel/types"); // 增删改查
const babelGenerator = require("@babel/generator").default; // 生成
const ejs = require("ejs");
const { SyncHook } = require("tapable");

// config 是webpack配置文件，返回的是一个对象，即 module.exports 返回的那个对象
const config = require(path.resolve(__dirname, "webpack.config.7compiler.js"));

class Compiler { // 通过 new Compiler(config) 调用，已经配置到scripts中，直接执行命令 "cnpm run 7-pack"
  constructor(config) {
    this.config = config;
    this.entryId = null; // 保存入口文件的路径 './scr/index.js'，即 ( webpack.config.js ) 中的 ( entry ) 入口文件的相对路径
    this.modules = {}; // 保存所有模块依赖 key="./src/xxx.js"  value="该模块的源码字符串"
    this.entry = config.entry; // 入口文件的 ( 相对路径 )
    this.root = process.cwd(); // node.js进程的当前工作路径
    this.hooks = { // 不同生命周期钩子
      entryOption: new SyncHook(), // 获取到 options 配置对象时触发
      afterPlugins: new SyncHook(), // 解析完 plugins 后触发，其实是调用apply完成插件注册后触发
      run: new SyncHook(), // 调用 run 方法时触发
      compile: new SyncHook(), // compile时触发
      afterCompile: new SyncHook(), // compile完成时触发
      emit: new SyncHook(), // emit 打包完成后，写时触发
      done: new SyncHook(), // 打包，发射，写入 dist 文件夹后，完成所有操作后触发
    };
    let plugins = this.config.plugins // 获取webpack.config.js配置文件中的 plugins 数组，( webpack.config.js是默认名，可以手动在输入命令行时指定 )
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        plugin.apply(this)
        // 1. this是compiler实例对象
        // 2. 每个 webpack plugin 都必须具有一个 apply 方法，( apply(compiler)方法接受compiler实例对象作为参数 )
        // 3. this.config.plugins 即是webpack.config.js中的plugins = [new HtmlWebpackPlugin(), ...] = [插件实例1, 插件实例2, ...] 
        // 4. 通过插件实例就能调用原型链上的 apply 方法
      })
    }
    this.hooks.afterPlugins.call() // ======================== afterPlugins
    // 钩子函数的调用call(): 在执行完所有 plugin 时，触发对应的钩子函数 afterPlugins
    // 钩子函数的注册tap(): 在 plugin 的 apply 方法中通过tap方法注册，而tap方法被调用是在constructor中被调用，因为constructor会最新被执行，即最先完成监听钩子的注册
  }


  // getSource
  // -------------------------------------------------------------------------------getSource
  // (一) 获取模块源码字符串
  // - 1. 通过 fs.readFileSync() 读取模块绝对路径，读取其源码，返回源码字符串
  // - 2. 需要处理 ( loader )，即通过 ( fs.readFileSync ) 获取模块的源码字符串后，如果有loader，要再用loader来处理各种资源
  getSource = (moduleAbsolutePath) => {
    //  moduleAbsolutePath => 绝对路径 C:\Users\Administrator\Desktop\7-compiler\src\index.js

    // 获取源码 - 字符串
    // 记得一定要utf8格式才会返回源码字符串，不然可能返回 buffer 类型
    let contentString = fs.readFileSync(moduleAbsolutePath, { encoding: "utf8" });

    const rules = this.config.module.rules; // 获取webpack.config.js配置对象中的 module.rules 数组

    for (let i = 0; i < rules.length; i++) {
      // 遍历 rules 数组，成员是对象，具有 test use 属性
      // config.module.rules.test  config.module.rules.use
      const { test, use } = rules[i];
      let backLoaderIndex = use.length - 1;
      if (test.test(moduleAbsolutePath)) {
        // module -> rules -> { test, use } 匹配每个模块的绝对路径的话，需要用对应的loader来转化
        // ( 模块的绝对路径 ) 和 ( module.rules.test ) 是否匹配
        function runLoader() {
          const currentLoader = require(use[backLoaderIndex--]); // a-- 是先赋值整个表达式，然后再 a-1
          contentString = currentLoader(contentString); // use数组从后往前遍历，因为loader的加载顺序是 ( 从右往左 从下往上 )
          if (backLoaderIndex >= 0) {
            runLoader(); // 如果use数组中的每个loader都执行过了，就结束递归
          }
        }
        runLoader();
      }
    }

    return contentString;
  };


  // parse()
  // -------------------------------------------------------------------------------parse
  // 参数：(1)source: 源码字符串 (2)parentPath: 父路径
  // 返回值: (1)解析过后的源码字符串 (2)依赖数组列表
  // (二) 解析
  parse = (source, parentPath) => {
    // ( 源码string ) => ( AST ) => ( 遍历AST ) => ( 转换AST ) => ( 获取新的源码字符串 )
    // 1. @babel/parser -------------- 将源码string转成AST
    // 2. @babel/traverse ----------- 遍历AST，并在遍历过程中通过 @babel/types完成修改，添加，删除等操作
    // 3. @babel/types -------------- 修改，添加，删除AST的各个节点
    // 4. @babel/generator ---------- 将修改后的AST再转成源码字符串

    const dependencies = []; // 依赖数组

    // AST
    const AST = babelParser.parse(source);

    // 遍历
    babelTraverse(AST, {
      CallExpression(p) {
        const node = p.node;
        if (node.callee.name === "require") {
          node.callee.name = "__webpack_require__"; // ( require <=> __webpack_require__ )，即将 require 修改成 __webpack_require__
          let modulePath = node.arguments[0].value;
          modulePath =
            "./" +
            path.join(parentPath, modulePath).replace(/\\/g, "/") +
            (path.extname(modulePath) ? "" : ".js"); // 后缀存在就加空字符串即不做操作，不存在加.js

          // push
          dependencies.push(modulePath);

          // 转换
          node.arguments = [babelTypes.stringLiteral(modulePath)]; // 把AST中的arguments中的Literal修改掉 => 修改成最新的modulePath
        }
      },
    });

    // 生成
    const sourceCode = babelGenerator(AST).code;

    // 返回
    return { sourceCode, dependencies };
  };


  // buildModules
  // -------------------------------------------------------------------------------buildModules
  // 参数 (1)moduleAbsolutePath: 模块的 ( 绝对路径 ) (2)isEntry: 是否是入口文件
  buildModules = (moduleAbsolutePath, isEntry) => {
    const source = this.getSource(moduleAbsolutePath); // --------------------------getSource
    // source
    // 1. 获取 ( 模块 )的 ( 源码字符串 )
    // 2. 注意：返回的源码字符串是经过 ( loader ) 处理过后返回的 ( 源码字符串 )

    const moduleRelativePath = `./${path
      .relative(this.root, moduleAbsolutePath)
      .replace(/\\/g, "/")}`; // 获取相对路径，( ./src/index.js )
    const parentPath = path.dirname(moduleRelativePath); // 父路径 ( './src/index.js' => './src' )

    if (isEntry) {
      // 是入口文件，单独保存入口文件的 ( 相对路径 )
      this.entryId = moduleRelativePath;
    }

    const { sourceCode, dependencies } = this.parse(source, parentPath); // --------parse
    // parse
    // 1. 参数
    // - source：经过 ( loader ) 处理过后返回的 ( 源码字符串 )
    // - parentPath： 父路径
    // 2. 返回值
    // - sourceCode：经过 ( 源码string ) => ( AST ) => ( 遍历AST ) => ( 转换AST ) => ( 获取新的源码字符串 ) 后返回的 ( 源码字符串 )
    // - dependencies：( 该模块 ) 依赖的 ( 其他模块 ) 的相对路径，即import，require引入模块的相对路径

    // console.log("1111", sourceCode, dependencies);

    this.modules[moduleRelativePath] = sourceCode;
    // this.modules
    // key：moduleRelativePath
    // value: sourceCode

    // 如果该模块的依赖数组不为空，即该模块存在依赖，那么 ( 递归调用buildModules ) 方法
    if (dependencies.length) {
      dependencies.forEach(
        (dep) => this.buildModules(path.join(this.root, dep)),
        false
      );
    }
  };


  // emitFile
  // 通过 fs.writeFileSync() 将源码字符串转成源码最终写入 dist 文件夹
  //-------------------------------------------------------------------------------emitFile
  emitFile = () => {
    // 用 modules 对象渲染我们的模板
    // 输出到哪些目录下
    const mainAbsolutePath = path.join(
      this.config.output.path,
      this.config.output.filename
    ); // 输出路径
    const templateStr = this.getSource(path.join(__dirname, "main.ejs"));
    const code = ejs.render(templateStr, {
      entryId: this.entryId,
      modules: this.modules,
    });
    this.assets = {};
    // map
    // path <=> code
    this.assets[mainAbsolutePath] = code;

    // 写文件
    fs.writeFileSync(mainAbsolutePath, this.assets[mainAbsolutePath]);
  };

  // -------------------------------------------------------------------------------run
  run() {
    this.hooks.run.call() // ================================= run
    const entryAbsolutePath = path.resolve(this.root, this.entry); // 入口文件绝对路径， F:\workSpace\7-compiler\src\index.js

    this.hooks.compile.call() // ============================= compile
    this.buildModules(entryAbsolutePath, true); // 创建模块的依赖关系 ----------------one
    this.hooks.afterCompile.call() // ======================== afterCompile

    console.log("this.modules :>> ", this.modules);
    console.log("this.entryId :>> ", this.entryId);

    this.emitFile(); // 发射文件，即打包后的文件 --------------------------------------two
    this.hooks.emit.call() // ================================ emit
    this.hooks.done.call() // ================================ done
  }
}

const compiler = new Compiler(config);
compiler.hooks.entryOption.call(); // ======================== entryOption 在该时间点调用 entryOption 生命周期钩子
// 生命周期钩子的先后顺序是: entryOption, afterPlugins, run, compile, afterCompile, emit, done
compiler.run(); // 调用 compiler 实例上的 run 方法
