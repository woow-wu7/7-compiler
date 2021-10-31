// const b = require("./b.js");
// require('./index.less')
require("./index.css");
require("./index.scss");
require("@babel/polyfill");

// 1
// 图片相关
// import one from "./images/1.jpg";
import one from "@images/1.jpg"; // 测试设置了 resolve.alias 之后的使用

function useJsGeneratorImg() {
  const divDOM = document.createElement("div");
  divDOM.setAttribute("style", "background: yellow;");
  const textDOM = document.createElement("span");
  textDOM.innerHTML = "js方式生成img标签";
  const _img = new Image(100, 100);
  divDOM.appendChild(_img); // 将图片插入到divDOM中，作为最后一个孩子节点
  divDOM.insertBefore(textDOM, _img); // 将 ( textDOM ) 插入到 ( divDOM ) 子元素 ( _img ) 的 ( 前面 )
  _img.src = one;
  if (_img.complete) {
    addChild();
  } else {
    _img.onload = addChild;
  }
  function addChild() {
    document.body.appendChild(divDOM);
  }
}
useJsGeneratorImg();

// 2
const index = 10;
console.log(index);

// 3
console.log(`AUTH`, AUTH); // 测试 webpack.DefinePlugin
console.log("hello"); // 测试 replaceLoader，将 hello -> hi

// 4
// 优化前：引入 jquery 和 lodash 测试打包速度
// 优化后：使用 module.noParse 在 loader 解析时去实现 打包的库没有依赖任何其他库时，不去寻找该库的依赖关系，提高打包速度
const lodash = require('lodash')
const jquery = require('jquery')
console.log(lodash, jquery)