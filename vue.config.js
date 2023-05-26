const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

console.log('---current env----')
console.log(process.env)
console.log('------------------')

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    entry: './src/main.js',
    plugins: [
      new NodePolyfillPlugin(),
    ],
    resolve: {
      extensions: ['.js', '.ts'],
      fallback: {
        "fs": false,
        "readline": false,
        'ffjavascript': require.resolve('ffjavascript-browser'),
      },
    }
  }

})
