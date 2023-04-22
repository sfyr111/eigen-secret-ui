const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

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
