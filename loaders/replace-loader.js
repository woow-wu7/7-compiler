// loader
// 1. 概念
// - loader是一个 ( 函数 )，函数的第一个参数就是 ( 源码字符串 )
// 2. 注意点
// - loader不能写成 ( 箭头函数 )，因为内部需要使用 ( this ) 来获取更多的api
// - 比如：
//    - this.async
//    - this.callback


module.exports = function (source, map, meta) {
  console.log(`map`, map);
  console.log(`meta`, meta);
  return source.replace("hello", "hi!");
  // loader就是一个函数，参数是源码字符串
  // 本loader的作用是：将 hello => hi
};
