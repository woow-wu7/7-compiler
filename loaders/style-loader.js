const styleLoader = function(source) {
  const style = `
    const styleElement = document.createElement('style');
    styleElement.innerHTML = ${JSON.stringify(source)}; 
    document.head.appendChild(styleElement);
  `
  // 上面使用 JSON.stringify() 取出换行符
  return style
}

module.exports = styleLoader
