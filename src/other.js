console.log(1)

// 1
// optimization -> splitChunks -> cacheGroups -> commons/venders
const aaa = require('./a.js')
const bbb = require('./b.js')
const ccc = aaa + bbb;
console.log('other-ccc', ccc)