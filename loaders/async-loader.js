// loader
// 1. 概念
// - loader是一个 ( 函数 )，函数的第一个参数就是 ( 源码字符串 )
// 2. 注意点
// - loader不能写成 ( 箭头函数 )，因为内部需要使用 ( this ) 来获取更多的api
// - 比如：
//    - this.async
//    - this.callback

// 异步loader
// 1. this.async() 返回 this.callback
// 2. this.callback 是一个函数
//    - 第一个参数：err // Error 或者 null
//    - 第二个参数：result // string或者buffer，即处理过后的源代码
//    - 第三个参数：sourceMap // 可选，必须是一个可以被这个模块解析的 source map
//    - 第四个参数：meta //可选，即元数据
module.exports = function (content, map, meta) {
  var callback = this.async();
  someAsyncOperation(content, function (err, result) {
    if (err) return callback(err);
    callback(null, result, map, meta);
  });
};
