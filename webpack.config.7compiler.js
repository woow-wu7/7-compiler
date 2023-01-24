const path = require('path')
const {
  EntryOptionPlugin,
  AfterPlugin,
  RunPlugin,
  CompilePlugin,
  AfterCompilePlugin,
  EmitPlugin,
  DonePlugin,
} = require('./plugins/index.js')

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    filename: 'main2.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          path.resolve(__dirname, 'loaders', 'style-loader'),
          path.resolve(__dirname, 'loaders', 'less-loader')
        ]
      }
    ]
  },
  plugins: [
    // 这里的插件是 - 生命周期相关的插件
    new EntryOptionPlugin(),
    new AfterPlugin(),
    new RunPlugin(),
    new CompilePlugin(),
    new AfterCompilePlugin(),
    new EmitPlugin(),
    new DonePlugin(),
  ]
}