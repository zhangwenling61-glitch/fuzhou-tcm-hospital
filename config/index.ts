import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import devConfig from './dev'
import prodConfig from './prod'
import h5Config from './h5'
import { join } from 'path'

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig(async(merge) => {
  const baseConfig: UserConfigExport = {
    projectName: 'taro3635',
    date: '2024-9-16',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    // 目录/文件别名
    alias: {
      '@': join(__dirname, '..', 'src'),
      axios$: 'axios/dist/axios.min.js'
    },
    sourceRoot: 'src',
    outputRoot: `dist/${process.env.TARO_ENV}`,
    plugins: [
      ['@tarojs/plugin-html', {
        modifyElements(inline: string[], block: string[]) {
        // i修改为view(默认为text)避免内部元素无法渲染问题
          inline.splice(inline.indexOf('i'), 1)
          block.push('i')
        }
      }],
      join(__dirname, 'keep-ide-config.js'),
      join(__dirname, 'plugins/vant.ts'),
      join(__dirname, 'plugins/mini-config.ts'),
      join(__dirname, 'plugins/ensure-sub-vendors.ts')
    ],
    defineConstants: {
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
    },
    copy: {
      patterns: [
      ],
      options: {
      }
    },
    framework: 'vue3',
    compiler: {
      type: 'webpack5',
      prebundle: {
        exclude: ['@yh/ui']
      }
    },
    cache: {
      enable: false // Webpack 持久化缓存配置，建议开启。默认配置请参考：https://docs.taro.zone/docs/config-detail#cache
    },
    mini: {
      miniCssExtractPluginOption: {
        ignoreOrder: true
      },
      postcss: {
        pxtransform: {
          enable: false
        },
        url: {
          enable: true,
          config: {
            limit: 1024 // 设定转换尺寸上限
          }
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

        // const needPxPluginRules = ['normalCss', 'less']
        // needPxPluginRules.forEach(ruleName => {
        //   chain.module.rule(ruleName).oneOf('0').use('2').tap(options => {
        //     options.postcssOptions.plugins.push(require('@yh/postcss-px-transform')({
        //       exclude: /[\\/]node_modules[\\/]vant/i
        //     }))
        //     return options
        //   })
        // })

        /**
       * 输出webpack配置
       */
        // require('fs').writeFileSync(join(__dirname, `${process.env.TARO_ENV}.inspect.config.js`), 'module.exports = ' + chain.toString())
      },
      runtime: {
        // fix: 修复h5组件使用Element.contains报错问题,例如: van-checkbox
        enableContains: true
      }
    }
  }
  if (process.env.TARO_ENV === 'h5') {
    Object.assign(baseConfig, h5Config)
  }
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
