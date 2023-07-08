'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}
const isProd = process.env.BUILD_FOR === 'production'
const isTest = process.env.BUILD_FOR === 'test'
const isOnline = isProd || isTest
console.log(isProd, isTest, isOnline)
process.env.VUE_APP_BUILD_FOR = isProd ? 'production' : isTest ? 'test' : 'local'

const name = defaultSettings.title || '二手书后台管理' // page title
const port = process.env.port || process.env.npm_config_port || 9528 // dev port

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: !isOnline,
  productionSourceMap: !isOnline,
  devServer: {
    port: port,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
        '/node': {
            target: 'https://serve.sirbook.top',
            // target: 'http://47.113.229.104:4000',
            // target: 'http://localhost:4000',
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '^/node': ''
            }
        }
    }
  }
}
