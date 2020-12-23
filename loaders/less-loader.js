const less = require('less')
const lessLoader = function(source) {
  let res;
  less.render(source, function(err, content) {
    // 转义 \n => \\n
    // 转义 \r => \\r
    // 其他应用：比如在避免XSS攻击时，可以使用httponly以外，还可以转义html标签，和js中的 \n=>\\n \r=>\\r 
    res = content.css.replace(/\n/g, '\\n').replace(/\r/g, '\\r')
  })
  return res;
}

module.exports = lessLoader