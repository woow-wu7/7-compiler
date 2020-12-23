class EntryOptionPlugin {
  apply(compiler) {
    compiler.hooks.entryOption.tap("entryOption", function () {
      console.log("EntryOptionPlugin");
    });
  }
}
class AfterPlugin {
  apply(compiler) {
    compiler.hooks.afterPlugins.tap("afterPlugin", function () {
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
}