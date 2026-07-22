# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本仓库中工作时提供指引。

## 项目概述

跨平台小程序应用，基于 **Taro 3.6.37 + Vue 2 + Vuex 3 + TypeScript** 构建。核心业务为医保平台的数字身份认证，目标平台包括微信小程序、支付宝小程序和 H5（移动端网页）。

**关键技术细节：**
- Vue 2（非 Vue 3，尽管 package name 为 `taro-vue3-ts`）
- Vuex 3 + `vuex-persistedstate`，使用 Taro storage 适配持久化
- Vant 2 组件库，通过 `babel-plugin-import` 按需加载
- `@yh/ui` — 内部私有组件库（registry: `http://npm.ylzpay.com`）
- Webpack 5 构建系统，使用 `@tarojs/webpack5-runner`
- Axios 封装了自定义 Taro 适配器（`src/utils/axios/taroAdapter.ts`），在小程序环境下桥接 `Taro.request`

## 常用命令

```bash
npm install          # 安装依赖

# 开发模式（watch）
npm run dev:weapp    # 微信小程序
npm run dev:alipay   # 支付宝小程序
npm run dev:h5       # H5 网页（开发服务器端口 8088）

# 生产构建
npm run build:weapp
npm run build:alipay
npm run build:h5

# 微信小程序生产模式 watch（压缩代码，NODE_ENV=production）
npm run build-watch:weapp
```

代码检查：`npx eslint src/ --ext .js,.ts,.vue`

项目中安装了 Jest 和 `jest-environment-jsdom`，但 npm scripts 中未配置测试命令。

## 架构

### 入口与路由
- `src/app.ts` — 应用入口，Vue 实例初始化，小程序生命周期钩子（`onShow`、`onHide`、`onLaunch`），自定义 `optionMergeStrategies` 解决 mixin 生命周期合并问题
- `src/app.config.ts` — Taro 页面路由与分包配置。主包页面：`home`、`user`；分包：`identification`，包含 14 个页面

### 网络请求层（双配置体系）
- `src/config/api.ts` — 基础请求配置（URL、响应解析规则、错误码）。小程序环境从 `serviceConfig` 读取，H5 从 `window.YHSERVICECONFIG` 读取
- `src/config/serviceConfig.ts` — 环境相关 URL（development / production）
- `src/utils/https.ts` — Axios 实例，含请求/响应拦截器。请求自动注入 `sessionId`、`appId`、`sign` 等字段。封装为统一的 `https<T>()` 函数，内置 loading 和错误处理
- `src/utils/axios/taroAdapter.ts` — 小程序环境下将 Axios 桥接到 `Taro.request`（H5 不使用）
- `src/pages/identification/api/` — 分包内独立的 API 调用和 `https.js` 实例

### 状态管理
- `src/store/index.ts` — 根 Vuex store：`token`、`openId`、`authState`、`userInfo`，通过 `vuex-persistedstate` 持久化到 Taro storage
- `src/pages/identification/store/` — 分包内独立的 Vuex store，管理认证流程状态

### 分包结构
`identification` 分包为自包含模块，拥有独立的 `api/`、`components/`、`config/`、`store/`、`utils/`、`pages/` 目录，与 Taro 分包优化策略一致——构建时按分包拆分代码。

### 路径别名
- `@` → `src/`（在 `tsconfig.json` 和 `config/index.ts` 中配置）

### 样式体系
- Less 预处理器，全局变量/函数通过 `lessLoaderOption.additionalData` 自动注入
- `src/assets/less/variables.less` — 全局 Less 变量
- `src/assets/less/functions.less` — 全局 Less mixins
- `@yh/postcss-px-transform` 处理 px 单位转换（排除 Vant 组件）
- **Vue 组件样式中不要使用 `scoped` 属性** — Taro 不支持。使用根类名下的唯一类名来隔离样式

### 环境判断
- `process.env.TARO_ENV` — 平台标识：`'weapp'`、`'alipay'` 或 `'h5'`
- `process.env.NODE_ENV` — `'development'` 或 `'production'`
- `Vue.prototype.$platform` — Vue 实例上暴露的平台标识，用于运行时平台判断
- ESLint 中已配置全局变量 `wx`（微信）和 `ap`（支付宝）

### 构建配置
- `config/index.ts` — 基础配置：Webpack 5、tsconfig-paths 插件、px-transform 自定义
- `config/dev.ts` — 开发环境覆盖
- `config/prod.ts` — 生产环境覆盖
- `config/h5.ts` — H5 专属配置：dev server 代理到 `mstpay.com:1811`、输出文件名哈希、CSS 提取

### 代码风格
- 2 空格缩进、单引号、无分号（ESLint 强制）
- 配置和工具类文件使用 TypeScript；页面和组件使用 Vue SFC + JS
- 分包页面大量使用 Mixin 模式（`*Mixin.js`）共享逻辑
