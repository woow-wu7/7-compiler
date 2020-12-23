const path = require("path");
const fs = require("fs");
const babelParser = require("@babel/parser");
const babelTraverse = require("@babel/traverse").default;
const babelTypes = require("@babel/types");
const babelGenerator = require("@babel/generator").default;
const ejs = require("ejs");
const { SyncHook } = require("tapable");

// config 是webpack配置文件
const config = require(path.resolve(__dirname, "webpack.config.js"));

class Compiler {
  constructor(config) {
    this.config = config;
    this.entryId = null; // 保存入口文件的路径 './scr/index.js'
    this.modules = {}; // 保存所有模块依赖
    this.entry = config.entry; // 入口文件的 ( 相对路径 )
    this.root = process.cwd(); // node.js进程的当前工作路径
    this.hooks = {
      entryOption: new SyncHook(),
      afterPlugins: new SyncHook(),
      run: new SyncHook(),
      compile: new SyncHook(),
      afterCompile: new SyncHook(),
      emit: new SyncHook(),
      done: new SyncHook(),
    };

    let plugins = this.config.plugins
    if (Array.isArray(plugins)) {
      plugins.forEach(plugin => {
        plugin.apply(this) // this是compiler实例对象
      })
    }
    this.hooks.afterPlugins.call()
  }

  // (一) 获取源码
  // - 1. 将引用的每个模块都通过路径，读取其源码，返回源码字符串
  // - 2. 需要处理 ( loader )，即通过 ( fs.readFileSync ) 获取模块的源码字符串后，如果有loader，要再用loader来处理各种资源
  // getSource
  getSource = (moduleAbsolutePath) => {
    //  moduleAbsolutePath => C:\Users\Administrator\Desktop\7-compiler\src\index.js

    // 获取源码
    let content = fs.readFileSync(moduleAbsolutePath, { encoding: "utf8" }); // 记得一定要utf8格式才会返回源码字符串，不然可能返回 buffer 类型

    const rules = this.config.module.rules;

    for (let i = 0; i < rules.length; i++) {
      // 遍历 rules 数组，成员是对象
      const { test, use } = rules[i];
      let backLoaderIndex = use.length - 1;
      if (test.test(moduleAbsolutePath)) {
        // module -> rules -> { test, use } 匹配每个依赖的绝对路径的话，需要用对应的loader来转化
        function runLoader() {
          const currentLoader = require(use[backLoaderIndex--]); // a-- 是先赋值整个表达式，然后再 a-1
          content = currentLoader(content); // use数组从后往前遍历
          if (backLoaderIndex >= 0) {
            runLoader(); // 如果use数组中的每个loader都执行过了，就结束递归
          }
        }
        runLoader();
      }
    }

    return content;
  };

  // (二) 解析
  // parse()
  // 参数：(1)sourse: 源码字符串 (2)parentPath: 父路径
  // 返回值: (1)解析过后的源码字符串 (2)依赖列表
  parse = (source, parentPath) => {
    // ( 源码string ) => ( AST ) => ( 遍历AST ) => ( 转换AST ) => ( 获取新的源码字符串 )
    const dependencies = []; // 依赖数组

    // AST
    const AST = babelParser.parse(source);

    // 遍历
    babelTraverse(AST, {
      CallExpression(p) {
        const node = p.node;
        if (node.callee.name === "require") {
          node.callee.name = "__webpack_require__";
          let modulePath = node.arguments[0].value;
          modulePath =
            "./" +
            path.join(parentPath, modulePath).replace(/\\/g, "/") +
            (path.extname(modulePath) ? "" : ".js"); // 后缀存在就加空字符串即不做操作，不存在加.js
          dependencies.push(modulePath);

          // 转换
          node.arguments = [babelTypes.stringLiteral(modulePath)]; // 把AST中的argumtns中的Literal修改掉 => 修改成最新的modulePath
        }
      },
    });

    // 生成
    const sourceCode = babelGenerator(AST).code;

    // 返回
    return { sourceCode, dependencies };
  };

  // buildModules
  // 参数 (1)moduleAbsolutePath: 模块的 ( 绝对路径 ) (2)isEntry: 是否是入口文件
  buildModules = (moduleAbsolutePath, isEntry) => {
    const source = this.getSource(moduleAbsolutePath); // 获取 ( 模块 )的 ( 源码字符串 )

    const moduleRelativePath = `./${path
      .relative(this.root, moduleAbsolutePath)
      .replace(/\\/g, "/")}`; // 获取相对路径，( ./src/index.js )
    const parentPath = path.dirname(moduleRelativePath); // 父路径 ( './src/index.js' => './src' )

    if (isEntry) {
      // 是入口文件，单独保存入口文件的路径
      this.entryId = moduleRelativePath;
    }

    const { sourceCode, dependencies } = this.parse(source, parentPath);
    console.log("1111", sourceCode, dependencies);
    this.modules[moduleRelativePath] = sourceCode;

    if (dependencies.length) {
      dependencies.forEach(
        (dep) => this.buildModules(path.join(this.root, dep)),
        false
      ); // 递归调用 buildModules
    }
  };

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

  run() {
    this.hooks.run.call()

    const entryAbsolutePath = path.resolve(this.root, this.entry);

    this.hooks.compile.call() // compile钩子
    this.buildModules(entryAbsolutePath, true); // 创建模块的依赖关系
    this.hooks.afterCompile.call() // afterCompile钩子

    console.log("this.modules :>> ", this.modules);
    console.log("this.entryId :>> ", this.entryId);
    this.emitFile(); // 反射文件，即打包后的文件

    this.hooks.emit.call()
    this.hooks.done.call()
  }
}

const compiler = new Compiler(config);
compiler.hooks.entryOption.call();
compiler.run();
