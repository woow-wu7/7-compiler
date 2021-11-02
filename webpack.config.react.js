const path = require("path");
const webpack = require("webpack");

// 专门用来打包 react reactDOM 的webpack配置文件
// 1
// 单独打包第三方库的好处
// - 不用每次修改业务文件后，又重新打包第三方库，而是只重新打包修改过的业务代码
// - 因为第三方库根本没有修改过
// - 所以：我们只需要每次都引用打包好的第三方库，加快打包速度

module.exports = {
  mode: "development",
  entry: {
    react: ["react", "react-dom"], // 入口文件是react和reactDOM
  },
  output: {
    filename: "dll_[name].js",
    path: path.resolve(__dirname, "dist"),
    library: "dll_[name]", // 将打包后的模块赋值给变量，并导出
    libraryTarget: "var", // 1. 使用commonjs的方式导出，即 export.default 的方式导出； 2.可以设置的值比如 var commonjs umd
  },
  plugins: [
    new webpack.DllPlugin({
      // 1
      // 作用：
      // - 引用打包好第三方库的动态链接库
      // - 如果找不到动态连结库中打包好的第三方包，再进行打包
      // 功能
      // - webpack.DllPlugin 在第三方webpack打包配置文件中使用，这里是 webpack.config.react.js
      // - webpack.DllReferencePlugin 在项目的webpack配置文件中指定
      // 单词
      // - manifest：是清单的意思
      // 最终
      //  - 完成动态链接库需要配合如下
      //  - 1. 在 webpack.config.react.js 中使用 webpack.DllPlugin 单独打包，生成动态连结库json文件
      //  - 2. 在 webpack.config.js 中使用 webpack.DllReferencePlugin 去查找动态链接库
      //  - 3. 在 模版HTML 中去手动引入打包好的库
      name: "dll_[name]", // ( name ) 必须和上面 ( output指定的library相同 )
      path: path.resolve(__dirname, "dist", "manifest.json"),
    }),
  ],
};
