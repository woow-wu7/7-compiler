// const b = require("./b.js");
// require('./index.less')
require("./index.css");
require("./index.scss");
require("@babel/polyfill");


// 图片相关
import one from "./images/1.jpg";
function useJsGeneratorImg() {
  const divDOM = document.createElement("div");
  divDOM.setAttribute("style", "background: yellow;");
  const textDOM = document.createElement("span");
  textDOM.innerHTML = "js方式生成img标签";
  const imgx = new Image(100, 100);
  divDOM.appendChild(imgx);
  divDOM.insertBefore(textDOM, imgx);
  imgx.src = one;
  if (imgx.complete) {
    addChild();
  } else {
    imgx.onload = addChild;
  }
  function addChild() {
    document.body.appendChild(divDOM);
  }
}
useJsGeneratorImg()

const index = 10;
console.log(index);
