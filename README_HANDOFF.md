# 前端设计交接说明

交接日期：2026-07-22

## 当前工程

- 技术栈：Taro 4.2.0 + Vue 3.5 + Pinia 3 + TypeScript + Less
- 包管理器：pnpm 10.33.3（以 `package.json` 中的 `packageManager` 为准）
- 目标端：微信小程序、支付宝小程序、H5
- 当前源码包不含原仓库的 Git 历史，接手后可直接初始化新的 GitHub 仓库
- 页面目前以静态展示和 mock 数据为主，接口联调及真实业务事件仍需后续接入

## 安装与启动

建议使用 Node.js 20 LTS 或更新的 LTS 版本，并启用 Corepack。

```bash
corepack enable
pnpm install
pnpm run dev:h5
```

其他平台：

```bash
pnpm run dev:weapp
pnpm run dev:alipay
pnpm run build:h5
pnpm run build:weapp
pnpm run build:alipay
```

H5 开发服务默认端口为 `8088`。

## 当前路由

路由入口为 `src/app.config.ts`，当前注册：

```text
主包：pages/home/index
分包：pages/appointment/ai-assistant/index
```

`src/components/` 和 `src/assets/` 中还保留了后续页面可复用的门户组件及设计资源。

## 交付前验证

- 2026-07-22：`pnpm run build:h5` 通过
- 2026-07-22：`pnpm run build:weapp` 通过
- H5 构建存在现有的包体积和 Browserslist 数据过期警告，不影响本次编译成功

## 接手注意事项

- 开始 UI 开发前先阅读 `AGENTS.md` 和 `.agents/skills/figma-implement-design/SKILL.md`。其中 UI/Figma 约束需继续遵守；`AGENTS.md` 的早期技术栈概述已滞后，实际依赖版本以 `package.json` 和本文为准。
- Vue 单文件组件样式不要使用 `scoped`；使用唯一页面根类隔离样式。
- 全局 Less 变量和 mixin 位于 `src/assets/less/`。
- 路径别名 `@` 指向 `src/`。
- 微信小程序配置位于 `project.config.json`，支付宝小程序配置位于 `project.alipay.json`。
- `@yh/ui` 使用公司私有源，配置位于 `.npmrc`；外网环境若无法访问该源，需要先处理依赖源或网络。
- H5 服务配置位于 `public/static/js/serviceConfig.js`，小程序服务配置位于 `src/config/serviceConfig.ts`。
- `src/config/remoteAssets.ts` 中部分图片使用腾讯云 COS 地址，离线环境下不会显示。

## 上传到新的 GitHub 仓库

先在 GitHub 创建一个空仓库，不要预先生成 README 或 `.gitignore`，然后在解压后的工程目录执行：

```bash
git init
git add .
git commit -m "chore: initial design handoff"
git branch -M main
git remote add origin <GitHub 仓库地址>
git push -u origin main
```

后续双方同步时，建议各自在独立分支开发，通过 Pull Request 合并到 `main`，避免互相覆盖。

## 交接包未包含

```text
node_modules/
dist/
.git/
.temp/
.rn_temp/
.swc/
.DS_Store
*.inspect.config.js
scratch/
```
