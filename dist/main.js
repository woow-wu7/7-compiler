(() => {
  // webpackBootstrap
  var __webpack_modules__ = {
    "./src/a.js": (module) => {
      eval(
        'module.exports = "a";\r\n\n\n//# sourceURL=webpack://7-compiler/./src/a.js?'
      );
    },

    "./src/b.js": (module, __unused_webpack_exports, __webpack_require__) => {
      eval(
        'const a = __webpack_require__(/*! ./a.js */ "./src/a.js");\r\nmodule.exports = a + "b";\r\n\n\n//# sourceURL=webpack://7-compiler/./src/b.js?'
      );
    },
  };
  /************************************************************************/
  // The module cache
  var __webpack_module_cache__ = {};

  // The require function
  function __webpack_require__(moduleId) {
    // Check if module is in cache
    if (__webpack_module_cache__[moduleId]) {
      return __webpack_module_cache__[moduleId].exports;
    }
    // Create a new module (and put it into the cache)
    var module = (__webpack_module_cache__[moduleId] = {
      // no module.id needed
      // no module.loaded needed
      exports: {},
    });

    // Execute the module function
    __webpack_modules__[moduleId](module, module.exports, __webpack_require__);

    // Return the exports of the module
    return module.exports;
  }

  /************************************************************************/
  (() => {
    eval(
      'const b = __webpack_require__(/*! ./b.js */ "./src/b.js");\r\n\r\nconst index = b + "1"\r\nconsole.log(index);\r\n\n\n//# sourceURL=webpack://7-compiler/./src/index.js?'
    );
  })();
})();
