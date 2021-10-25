// loader
// 1. 概念
// - loader是一个 ( 函数 )，函数的第一个参数就是 ( 源码字符串 )
// 2. 注意点
// - loader不能写成 ( 箭头函数 )，因为内部需要使用 ( this ) 来获取更多的api
// - 比如：
//    - this.async
//    - this.callback

const styleLoader = function (source) {
  const style = `
    const styleElement = document.createElement('style');
    styleElement.innerHTML = ${JSON.stringify(source)};
    document.head.appendChild(styleElement);
  `;
  // 上面使用 JSON.stringify() 取出换行符
  return style;
};

module.exports = styleLoader;
