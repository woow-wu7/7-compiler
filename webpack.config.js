const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsWebpackPlugin = require("mini-css-extract-plugin");
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  // mode
  //  1. mode: 表示模式
  //      - development 开发环境
  //      - production  生产环境
  mode: "development",

  // entry
  //  1. entry 表示thunk的入口点
  //  2. entry 的简单规则
  //      - html: 每个html都有 一个入口起点
  //      - 单页应用spa: 一个入口起点
  //      - 多页应用mpa: 多个入口起点
  //  3. 如果entry后面跟一个 ( 字符串 )，或者 ( 字符串数组 )，chunk会被命名为 ( main ) ---- main
  //  4. 如果entry后面跟一个 ( 对象 )，则 ( key ) 就是 thunk名 -------------------------- key

  //  5. 如何打包一个多页应用
  //      - 1. entry设置为 ( 对象模式 )，则可以指定 ( 多个入口 )
  //      - 2. output的 ( filename ) 设置为 ('[name].[hash:8].js' ) 的形式，使用 ( 占位符 ) 则可以分别打包为不同的 ( 出口文件 )
  //      - 3. plugins 数组中需要多次 ( new HtmlWebpackPlugin() )，具体如下
  // plugins: [
  //   new HtmlWebpackPlugin({ // ---------------------------- html-webpack-plugin可以new多个
  //     template: './src/index.html', // 模版html
  //     filename: 'home.html', // 打包后的html文件名
  //     chunks: ['home'] // --------------------------------- 每个chunk对应加载哪些打包后的 js 文件，即 output指定的输出js文件
  //   }),
  //   new HtmlWebpackPlugin({
  //     template: './src/index.html',
  //     filename: 'other.html',
  //     chunks: ['other']
  //   }),
  // ]

  entry: {
    main: "./src/index.js", // 这里entry是一个对象，main 就是打包后的 thunk 名称
    other: "./src/other.js",
  },

  // output
  //  1. filename
  //      - filename: 表示打包后的 thunk 的名字
  //      - '[name].[hash:8].js'
  //        - []: 表示占位符
  //        - [name]: 表示使用 entry 属性对象中的 key 作为thunk名
  //        - [hash:8]: 表示加上hash串，长度为 8
  //  2. path
  //      - path: 表示打包生成的文件夹的路径
  //  3. hash chunkhash contenthash 之间的区别？
  //      - hash
  //          - 作用：只要项目中有文件修改，整个项目构建的hash都会改变，并且全部文件都共用相同的hash
  //          - 弊端：如果只修改了一个文件，整个文件的缓存都将失效，因为真个文件的hash都改变了
  //      - chunkhash
  //          - 相对于hash，chunkhash的影响范围较小
  //          - 原理：
  //            - 根据不同的入口文件(Entry)进行依赖文件解析、构建对应的chunk，生成对应的哈希值
  //            - 不同入口打包生成的chunk的hash不一样
  //          - 测试
  //            - 请使用 cnpm run build 进行 chunkhash 的测试，main和other的js文件的hash值就不一样
  //          - 例子：
  //            - 策略：比如一个项目有6个组件，123打包为一个thunk1输出一组js/css，456打包为另一个thunk2输出另一组js/css
  //            - 结果： 如果使用chunkhash，打包完成后chunk1的hash和chunk2的hash就不一样，改动了123，456的chunk2的hash就不会变，缓存仍然有效
  //      - contenthash
  //          - 1. 影响范围最小，在hash，chunkhash，contenthash三者中
  //          - 2. 遇到问题
  //            - 使用chunkhash，如果index.css被index.js引用了，那么 ( css文件和js文件 ) 就会 ( 共用相同的chunkhash值 )
  //            - 如果index.js更改了代码，css文件就算内容没有任何改变，由于是该模块发生了改变，导致css文件会重复构建
  //          - 3. 解决方法
  //            - 使用 ( mini-css-extract-plugin ) 里的 ( contenthash ) 值，保证即使css文件所处的模块里就算其他文件内容改变，只要css文件内容不变，那么不会重复构建
  //      - 总结
  //          - hash(任何一个文件修改，整个打包所有文件的hash都会改变)： - 是根据整个项目构建，要项目里有文件更改，整个项目构建的hash值都会更改，并且全部文件都共用相同的hash值
  //          - chunkhash(只影响到不同entry划分的chunk)：chunkhash根据不同的入口文件(Entry)进行依赖文件解析、构建对应的代码块（chunk），生成对应的哈希值，某文件变化时只有该文件对应代码块（chunk）的hash会变化
  //          - contentHash(即使是相同chunk的js和css，改动js只会影响对应的js而不会影响到css)：每一个代码块（chunk）中的js和css输出文件都会独立生成一个hash，当某一个代码块（chunk）中的js源文件被修改时，只有该代码块（chunk）输出的js文件的hash会发生变化
  //  4. 在哪些地方可以使用到 hash chunkhash contenthash
  //      - 凡是在 webpack.config.js 中具有 ( filename ) 属性的地方都可以使用 ( 占位符的方式 [hash] ) 使用到这几种hash

  output: {
    // filename: '[name].[hash:8].js',
    filename: "[name].[chunkhash:8].js",
    // filename: '[name].[content:8].js',
    path: path.resolve(__dirname, "build"),
  },

  // devServer
  //  1. proxy
  //      - 表示跨域代理
  //      - 如果不希望传递 '/api' 需要用 pathRewrite 重写路径
  //  2. contentBase
  //      - contentBase: 表示服务器的内容来源
  //      - contentBase需要和output.path保持一致
  //  3. host主机 port端口 compress开启gzip压缩 hot开启热更新
  devServer: {
    // 开发服务器配置项
    contentBase: path.join(__dirname, "build"),
    host: "localhost", // 主机，可以从外部访问
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

  // devtool
  // - source-map
  // - eval-source-map
  devtool: "source-map", // 显示行数，产生map文件
  // devtool: 'eval-source-map', // 显示行数，不产生map文件

  resolve: {
    // resolve.fallback 是 webpack5 新增加的配置
    // fallback: {
    //   path: require.resolve("path-browserify"), // path相关
    // },
    alias: {
      "@images": path.resolve(__dirname, "./src/images"), // 设置别名
    },
  },

  // module
  //  1. loader --------------------------------------------------------------------- loader
  //      - loader顺序: 从右往左，从下往上
  //      - 比如css相关的loader顺序: sass-loader => css-loader => style-loader
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
  //      - url-loader // 当图片小于阈值时转成base64，大于于阈值时使用file-loader
  module: {
    noParse: /jquery|lodash/, // ------ 不去解析jquery或lodash的依赖关系，因为它们俩都没有依赖其他库，从而提高构建速度
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      // { // 非单独抽离，插入html的head部分
      //   test: /\.scss$/,
      //   use: [
      //     {loader: 'style-loader'},
      //     {loader: 'css-loader'},
      //     {loader: 'sass-loader'},
      //   ]
      // },
      {
        // 单独抽离
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          { loader: "postcss-loader" }, // 先处理sass => 处理前缀 => 处理@import => 抽离css
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader", // options已在 .babelrc 文件中单独配置
            // options: { // ------------- use数组中如果是对象的方式，则可以配置 ( options配置对象 ) 和 ( loader ) 等
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
          },
        ],
      },
      // 加载自定义的 loader - replaceLoader
      {
        test: /\.js$/,
        use: [path.resolve(__dirname, "./loaders/replace-loader.js")],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 200 * 1024, // 小于200k转成base64, 大于200k使用file-loader来处理加载图片
              esModule: false, // 用于html-withimg-plugin生效
              outputPath: "img/", // 输出到 img 文件夹中
              publicPath: "", // 单独配置img的公共路径，而不是在output中全部配置
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: "html-withimg-loader",
      },
    ],
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
      template: "./src/index.html",
      filename: "index.html", // 打包过后的html的文件名
      hash: true, // 在打包后的build文件夹中的html文件引入资源时，是否加hash串
      // minify: {
      //   removeAttributeQuotes: true, // 删除html属性的双引号
      //   collapseWhitespace: true, // 将html折叠成一行
      // }
      // chunks: ['home']
    }),
    new HtmlWebpackPlugin({
      // 打包多页应用时，可以指定 chunks
      template: "./src/index.html",
      filename: "other.html", // 打包过后的html的文件名
      hash: true, // 在打包后的build文件夹中的html文件引入资源时，是否加hash串
      // minify: {
      //   removeAttributeQuotes: true, // 删除html属性的双引号
      //   collapseWhitespace: true, // 将html折叠成一行
      // }
      // chunks: ['other']
    }),
    // copy-webpack-plugin
    // 这是webpack5的配置，本项目中用到的webpack4，所以不能使用这种写法
    // 报错信息：TypeError: compilation.getCache is not a function
    // 解决办法：移除copy-webpack-plugin, 安装5.0版本的copy-webpack-plugin即可解决！
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, "./toCopyConsume"), // 将 toCopyConsume 中的文件拷贝到 to中的文件夹中
    //       to: "./", // 将会拷贝到打包后的文件中的根目录，比如build文件夹
    //     },
    //   ],
    // }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "./toCopyConsume"), // 将 toCopyConsume 中的文件拷贝到 to中的文件夹中
        to: "./", // 将会拷贝到打包后的文件中的根目录，比如build文件夹
      },
    ]),
    new MiniCssExtractPlugin({
      filename: "css/main.css", // 指定被打包后的文件夹，和文件名
      // filename: 'main.css', 抽离出来的css文件名
    }),
    new webpack.DefinePlugin({
      AUTH: JSON.stringify("AUTH_NAME"), // --- 需要使用 JSON.stringify()
    }),
    new webpack.BannerPlugin({ banner: " by woow_wu7" }), // webpack自带的plugin，用于在js文件开头注释一些说明内容
    new webpack.IgnorePlugin(/\.\/local/, /moment/), // 表示从moment中如果引入了 ./local 文件路径，则把 ./local  中的所有文件忽略掉
  ],

  // optimization
  //  - optimization 优化项 (optimization：是最佳优化的意思)
  //  1. 压缩打包后的css和js
  //    - 压缩过后的css，js都只有一行
  //    - 注意：压缩css和js要在 ( mode=production ) 中才能看到效果，和 html的优化一样
  optimization: {
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin(),
      new UglifyjsWebpackPlugin({
        cache: true,
        parallel: true, // 平行，并行的意思
        sourceMap: true, // 调试映射
      }),
    ],
  },
  // resolve.fallback 是 webpack5 新增加的配置，我们这里安装的是 webpack4，所以把代码注释掉
  // resolve: {
  //   fallback: {
  //     path: require.resolve("path-browserify"), // path相关，需要使用path需要这样设置，因为webpack5把polyfill单独抽离了
  //   },
  // },
};
