class EntryOptionPlugin {
  apply(compiler) {
    compiler.hooks.entryOption.tap("entryOption", function () {
      console.log("EntryOptionPlugin");
    });
  }
}
class AfterPlugin {
  apply(compiler) {
    // 1. 每个 webpack plugin 都有一个 apply 方法
    // 2. apply(compiler) 方法的 ( 参数 ) 就是通过 new Compiler(config) 生成的 ( compiler实例 )，可以获取到Compiler构造函数中的 hooks 属性
    // 3. webpack plugin 就是一个类，因为通过 new 来调用的
    // 4. 当调用 apply 方法时，完成plugin的注册，调用 apply 方法的时机时在 ( 执行Compiler构造函数的时候 )

    compiler.hooks.afterPlugins.tap("afterPlugin", function () {
      // tap注册，通过 call等方式调用，即类似发布订阅
      console.log("AfterPlugin");
    });
  }
}
class RunPlugin {
  apply(compiler) {
    compiler.hooks.run.tap("run", function () {
      console.log("RunPlugin");
    });
  }
}
class CompilePlugin {
  apply(compiler) {
    compiler.hooks.compile.tap("compile", function () {
      console.log("CompilePlugin");
    });
  }
}
class AfterCompilePlugin {
  apply(compiler) {
    compiler.hooks.afterCompile.tap("afterCompile", function () {
      console.log("AfterCompilePlugin");
    });
  }
}
class EmitPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap("emit", function () {
      console.log("EmitPlugin");
    });
  }
}
class DonePlugin {
  apply(compiler) {
    compiler.hooks.done.tap("done", function () {
      console.log("DonePlugin");
    });
  }
}

module.exports = {
  EntryOptionPlugin,
  AfterPlugin,
  RunPlugin,
  CompilePlugin,
  AfterCompilePlugin,
  EmitPlugin,
  DonePlugin,
};
