const path = require('path')

const defaultOptions = {
  weapp: {
    excludes: ['project.private.config.json'],
    filename: 'project.config.json'
  },
  alipay: {
    excludes: ['.mini-ide'],
    filename: 'mini.project.json'
  },
  /**
   * 是否保持IDE中的配置修改
   */
  keep: false,
  /**
   * 是否清空output文件夹
   */
  clearable: false
}

/**
 * 重新编译时,防止清空开发工具修改的小程序配置
 */
export default (ctx, options) => {
  options = Object.assign({}, defaultOptions, options)
  if (options.clearable) {
    return
  }
  // 修改默认清空output文件夹配置
  ctx.initialConfig.mini.needClearOutput = false
  const platform = process.env.TARO_ENV
  const { filename, excludes } = options[platform] || {}
  if (!filename) {
    return
  }
  let ideConfig = {}
  const { outputPath } = ctx.paths
  const { fs } = ctx.helper
  const filepath = path.join(outputPath, filename)
  ctx.onBuildStart(() => {
    if (options.keep && fs.existsSync(filepath)) {
      ideConfig = fs.readJSONSync(filepath)
    }
    emptyDirectory(outputPath, { excludes })
  })

  ctx.onBuildComplete(() => {
    try {
      const content = fs.readJSONSync(filepath)
      const config = ctx.helper.recursiveMerge(content, ideConfig)
      ctx.writeFileToDist({
        filePath: filename,
        content: JSON.stringify(config, null, 2)
      })
    } catch (error) {
      // 防止文件不存在时报错
    }
  })

  function emptyDirectory(dirPath, opts = { excludes: [] }) {
    const retries = (process.platform === 'win32') ? 100 : 1
    if (fs.existsSync(dirPath)) {
      fs.readdirSync(dirPath).forEach(file => {
        const curPath = path.join(dirPath, file)
        const removable = !opts.excludes.length || !opts.excludes.some(item => curPath.indexOf(item) >= 0)
        if (fs.lstatSync(curPath).isDirectory()) {
          let removed = false
          let i = 0 // retry counter
          do {
            try {
              if (removable) {
                emptyDirectory(curPath)
                fs.rmdirSync(curPath)
              }
              removed = true
            } catch (e) {
            } finally {
              if (++i < retries) {
                // eslint-disable-next-line no-unsafe-finally
                continue
              }
            }
          } while (!removed)
        } else {
          removable && fs.unlinkSync(curPath)
        }
      })
    }
  }
}
