const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.[hash:8].js',
    path: path.resolve(__dirname, 'build')
  },
  devServer: { // 开发服务器配置项
    // contentBase
    // 1. 作用: 告诉服务器内容的来源，建议绝对路径
    // 2. contentBase 和 output.path 保持一致，需要启动服务的文件目录
    contentBase: path.join(__dirname, 'build'), 
    host: 'localhost', // 主机，可以从外部访问
    port: 5555,
    compress: true, // 开启 gzip 压缩
    open: true, // 启动后，打开浏览器
    hot: true, // 启用热更新
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:7777',
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  },
  plugins: [
    // 1. html-webpack-plugin 
    //    - 主要作用：将模板html打包到output指定的文件夹，并实现自动引入依赖打包后的其他资源
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html', // 打包过后的html的文件名
      hash: true, // 在打包后的build文件夹中的html文件引入资源时，是否加hash串
      minify: {
        removeAttributeQuotes: true, // 删除html属性的双引号
        collapseWhitespace: true, // 将html折叠成一行
      }
    })
  ]
}