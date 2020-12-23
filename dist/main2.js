
(function (modules) { 
  var installedModules = {};

  function __webpack_require__(moduleId) {

    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    module.l = true;

    return module.exports;
  }

  return __webpack_require__(__webpack_require__.s = "./src/index.js");
})
  ({
    
      "./src/index.js":
      (function (module, exports, __webpack_require__) {
        eval(`const b = __webpack_require__("./src/b.js");

__webpack_require__("./src/index.less");

const index = b + "11";
console.log(index);`)
      }),
    
      "./src/b.js":
      (function (module, exports, __webpack_require__) {
        eval(`const a = __webpack_require__("./src/a.js");

module.exports = a + "b";`)
      }),
    
      "./src/a.js":
      (function (module, exports, __webpack_require__) {
        eval(`module.exports = "a";`)
      }),
    
      "./src/index.less":
      (function (module, exports, __webpack_require__) {
        eval(`const styleElement = document.createElement('style');
styleElement.innerHTML = "body {\\n  background: red;\\n}\\n";
document.head.appendChild(styleElement);`)
      }),
    
  });
