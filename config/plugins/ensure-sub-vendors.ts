import { IPluginContext } from '@tarojs/service'
import fs from 'fs'
import path from 'path'

function toPosixPath(filePath: string) {
  return filePath.split(path.sep).join('/')
}

function writeMissingSubVendor(outputPath: string, filePath: string) {
  const chunkName = toPosixPath(path.relative(outputPath, filePath)).replace(/\.js$/, '')
  const content = `"use strict";(wx["webpackJsonp"]=wx["webpackJsonp"]||[]).push([["${chunkName}"],{}]);\n`
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

function walkJsFiles(dir: string, result: string[] = []) {
  if (!fs.existsSync(dir)) return result

  fs.readdirSync(dir, { withFileTypes: true }).forEach(item => {
    const filePath = path.join(dir, item.name)
    if (item.isDirectory()) {
      walkJsFiles(filePath, result)
      return
    }

    if (item.isFile() && filePath.endsWith('.js')) {
      result.push(filePath)
    }
  })

  return result
}

function ensureSubVendors(outputPath: string) {
  const missingFiles = new Set<string>()
  const requirePattern = /require\(["']((?:\.\.\/)+sub-vendors\.js)["']\)/g

  walkJsFiles(outputPath).forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf8')
    let match: RegExpExecArray | null
    while ((match = requirePattern.exec(content))) {
      const subVendorPath = path.resolve(path.dirname(filePath), match[1])
      if (!fs.existsSync(subVendorPath)) {
        missingFiles.add(subVendorPath)
      }
    }
  })

  missingFiles.forEach(filePath => {
    writeMissingSubVendor(outputPath, filePath)
  })
}

export default function(ctx: IPluginContext) {
  if (process.env.TARO_ENV !== 'weapp') return

  ctx.onBuildFinish(() => {
    ensureSubVendors(ctx.paths.outputPath)
  })
}
