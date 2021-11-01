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
const lodash = require("lodash");
const jquery = require("jquery");
console.log(lodash, jquery);

// 5
// webpack.IgnorePlugin()
// moment
// 优化前：moment内部默认会去加载所有的语言包，但是一般情况我们也只会用到中文或英文，导致moment打包后的文件比较大
// 优化后：使用 webpack.IgnorePlugin 内置插件，忽略掉moment中引入的 ./local 中的所有文件，我们自己手动引入需要的其中一两个文件即可
const moment = require("moment");
require("moment/locale/zh-cn");
moment.locale("zh-cn"); // 使用zh-cn语言包，未做优化前，虽然只使用了一个语言包zh-cn，但是会打包所有的 ./local 文件，里面包含所有的语言包
const time = moment().format("MMMM Do YYYY, h:mm:ss a");
console.log(`time`, time);

// 6
// react
import React from 'react'
import ReactDOM from 'react-dom'
console.log(ReactDOM.render, 'ReactDOM.render')
ReactDOM.render(<h1>jsx</h1>, document.getElementById('root'))

