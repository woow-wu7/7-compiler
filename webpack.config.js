const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('mini-css-extract-plugin')
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')

module.exports = {


  // mode
  //  1. mode: 表示模式
  //      - development 开发环境
  //      - production  生产环境
  mode: 'development',


  // entry
  //  1. entry 表示thunk的入口点
  //  2. entry 的简单规则
  //      - html: 每个html都有 一个入口起点
  //      - 单页应用spa: 一个入口起点
  //      - 多页应用mpa: 多个入口起点
  //  3. 如果entry后面跟一个 ( 字符串 )，或者 ( 字符串数组 )，chunk会被命名为 ( main ) ---- main
  //  4. 如果entry后面跟一个 ( 对象 )，则 ( key ) 就是 thunk名 -------------------------- key
  entry: {
    main: './src/index.js', // 这里entry是一个对象，main 就是打包后的 thunk 名称
  },


  // output
  //  1. filename 
  //      - filename: 表示打包后的 thunk 的名字
  //      - '[name].[hash:8].js'
  //        - []: 表示占位符号
  //        - [name]: 表示使用 entry 属性对象中的 key 作为thunk名
  //        - [hash:8]: 表示加上hash串，长度为 8
  //  2. path
  //      - path: 表示打包生成的文件夹的路径
  output: {
    filename: '[name].[hash:8].js',
    path: path.resolve(__dirname, 'build')
  },


  // devServer
  //  1. proxy
  //      - 表示跨域代理
  //      - 如果不希望传递 '/api' 需要用 pathRewrite 重写路径
  //  2. contentBase
  //      - contentBase: 表示服务器的内容来源
  //      - contentBase需要和output.path保持一致
  //  3. host主机 port端口 compress开启gzip压缩 hot开启热更新
  devServer: { // 开发服务器配置项
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
    //     },
    //     // https相关
    //     // 可以发送 https，默认使用自签名证书，也可以提供自己的证书，如下三个属性 key cert ca
    //     https: true, 
    //     key: fs.readFileSync('/path/to/server.key'),
    //     cert: fs.readFileSync('/path/to/server.crt'), // certificate 证书的缩写
    //     ca: fs.readFileSync('/path/to/ca.pem'),
    //     secure: false,
    //   }
    // }
  },


  // module
  //  1. loader --------------------------------------------------------------------- loader
  //      - loader顺序: 从右往左，从下往上
  //      - 比如css相关的loader顺序: sass-loadder => css-loader => style-loader
  //  2. css相关的loader
  //      - style-loader 主要用来解析 ( @import ) 语法
  //      - css-loader 将css插入到html的 ( head ) 部分
  //      - sass-loader node-sass less
  //      - 问题: 
  //        - 1. 如果只用 ( style-loader和css-loader ) 会直接插入到HTML中
  //          - 可以用webpack-dev--server启动服务在html中f12查看elements，css插入到了head部分
  //          - 注意，并不是插入到打包后的html中，而是要启动服务才会看到到
  //        - 2. 如何使用sass？？？？
  //          - sass-loader sass node-sass 
  //          - 先用 sass-loader => css => css-loader => style-loader => 插入html的head
  //        - 3. 那么要如何把 css 抽离成单独的文件来引入呢？？？？
  //          - mini-css-extract-plugin 单独抽离css文件
  //        - 4. css的前缀，兼容性怎么处理？？？？
  //          - postcss-loader 用来解决浏览器前缀，兼容性处理，可以单独配置 postcss.config.js
  //          - autoprefixer 需要配合autoprefixer插件
  //          - 顺序问题: 先处理sass => 加上前缀后 => 识别@import => 抽离css
  //          - 顺序具体: sass-loader => postcss-loader => css-loader => MiniCssExtractPlugin.loader
  //          - 如何配置
  //            - 单独新建 postcss.config.js 在该文件中引入 autoprefixer
  //            - autoprefixer需要给出浏览器的一些信息，需要在package.json中配置 browsersList 属性
  //  3. 图片相关loader
  //      - file-loader
  //      - url-loader // 当图片小于阈值时转成base64，大于于阈值时使用file-laoder
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'}
        ]
      },
      // { // 非单独抽离，插入html的head部分
      //   test: /\.scss$/,
      //   use: [
      //     {loader: 'style-loader'},
      //     {loader: 'css-loader'},
      //     {loader: 'sass-loader'},
      //   ]
      // },
      { // 单独抽离
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {loader: 'css-loader'},
          {loader: 'postcss-loader'}, // 先处理sass => 处理前缀 => 处理@import => 抽离css
          {loader: 'sass-loader'},
        ]
      }, 
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader', // options已在 .babelrc 文件中单独配置
            // options: {
            //   presets: [
            //     ['@babel/preset-env'],
            //   ],
            //   plugins: [
            //     ['@babel/plugin-proposal-decorators', {'legacy': true}],
            //     ['@babel/plugin-proposal-class-properties', {'loose': true}],
            //     ['@babel/plugin-transform-runtime'],
            //     ['@babel/plugin-syntax-dynamic-import'],
            //   ]
            // }
          }
        ] 
      },
      {
        test: /\.(png|jpg|jpeg|git)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 200 * 1024, // 小于200k转成base64, 大于200k使用file-laoder来处理加载图片
              esModule: false, // 用于html-withimg-plugin生效
              outputPath: 'img/', // 输出到 img 文件夹中
              publicPath: '' // 单独配置img的公共路径，而不是在output中全部配置
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: 'html-withimg-loader'
      }
    ]
  },


  // plugins
  //  1. html-webpack-plugin
  //      - 主要作用：将模板html打包到output指定的文件夹，并实现自动引入依赖打包后的其他资源
  //      - template: 指定模板html
  //      - filename: templatee模板html文件打包后的html的名字
  //      - hash: 打包后的html引入资源的名字是否加上hash
  //  2. mini-css-extract-plugin
  //      - 主要作用：单独抽离css，sass等
  //      - 在plugins中: new MiniCssExtractPlugin()
  //      - 在module.rules中: MiniCssExtractPlugin.loader
  //  3. optimize-css-assets-webpack-plugin 和  uglifyjs-wewbpack-plugin 一起来压缩css和js
  //      - 主要在 production生产环境才需要压缩css和js
  //      - optimization.minimizer
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html', // 打包过后的html的文件名
      hash: true, // 在打包后的build文件夹中的html文件引入资源时，是否加hash串
      // minify: {
      //   removeAttributeQuotes: true, // 删除html属性的双引号
      //   collapseWhitespace: true, // 将html折叠成一行
      // }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/main.css', // 指定被打包后的文件夹，和文件名
      // filename: 'main.css', 抽离出来的css文件名
    })
  ],


  // optimization
  //  - optimization 优化项 (optimization：是最佳优化的意思)
  //  1. 压缩打包后的css和js
  //    - 压缩过后的css，js都只有一行
  //    - 注意：压缩css和js要在 ( mode=production ) 中才能看到效果，和 html的优化一样
  optimization: { 
    minimizer: [ // 
      new OptimizeCssAssetsWebpackPlugin(),
      new UglifyjsWebpackPlugin({
        cache: true,
        parallel: true, // 平行，并行的意思
        sourceMap: true, // 调试映射
      })
    ]
  }
}