const merge = require("webpack-merge"); // --------------- webpack-merge
const base = require("./webpack5.config.js"); // ------- 加载dev环境的配置

// webpack-merge 合并配置
module.exports = merge(base, {
  mode: "development",
  devServer: {
    contentBase: "./dist",
    port: 8000,
    open: true,
    compress: true,
  },
});
