import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import { resolve } from 'path'
import dayjs from 'dayjs'
import type { UserConfigExport } from '@tarojs/cli'

export default {
  copy: {
    patterns: [
      {
        from: 'public/',
        to: 'dist/h5/',
        ignore: ['**/index.html']
      }
    ],
    options: {
    }
  },
  h5: {
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    staticDirectory: 'static',
    output: {
      filename: 'static/js/[name].[chunkhash:8].js',
      chunkFilename: 'static/js/[name].[chunkhash:8].js',
      environment: {
        asyncFunction: true
      }
    },
    esnextModules: ['@yh/ui'],
    miniCssExtractPluginOption: {
      ignoreOrder: true,
      filename: 'static/css/[name].[hash].css',
      chunkFilename: 'static/css/[name].[chunkhash].css'
    },
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          baseFontSize: 50,
          maxRootSize: 100
        }
      },
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    },
    lessLoaderOption: {
      additionalData: `@import "~@/assets/less/variables.less";@import "~@/assets/less/functions.less";`
    },
    htmlPluginOption: {
      timestamp: dayjs().format('YYYYMMDDHHmmss')
    },
    webpackChain(chain) {
      chain.resolve.plugin('tsconfig-paths').use(TsconfigPathsPlugin)

      // Force SVGs to be inlined as base64 instead of relative assets
      chain.module
        .rule('image')
        .test(/\.(png|jpe?g|gif|bpm|webp)(\?.*)?$/)

      chain.module
        .rule('svg')
        .test(/\.svg(\?.*)?$/)
        .set('type', 'asset/resource')

      if (process.env.NODE_ENV === 'production') {
        /**
         * 去除license.txt文件
         */
        chain.optimization.minimizer('terserPlugin').tap(args => {
          args[0].extractComments = false
          return args
        })
      }
      require('fs').writeFileSync(resolve(__dirname, '..', `${process.env.TARO_ENV}.inspect.config.js`), 'module.exports = ' + chain.toString())
    },
    devServer: {
      host: '0.0.0.0',
      port: 8088,
      proxy: {
        '/uec-portal-web-jkyl': {
          target: 'http://mstpay.com:1811',
          changeOrigin: true,
          pathRewrite: {
            // '^/ep-auth': '/XC'
          },
          onProxyReq: (proxyReq) => {
            const { protocol, host, method, path, connection } = proxyReq
            const port = connection?.remotePort ? ':' + connection.remotePort : ''
            console.log(`[${method}]: ${protocol}//${host}${port}${path}`)
          }
        }
      }
    }
  }
} satisfies UserConfigExport
