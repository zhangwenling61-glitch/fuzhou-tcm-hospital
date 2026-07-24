# AGENT.md

本文件为 AI 编码助手在本仓库中工作时提供指引（基于实际代码分析，2026-05-18 更新）。

## ⚠️ 关于 CLAUDE.md 的说明

CLAUDE.md 中描述的技术栈已过时，项目已完成大版本升级。以下为实际技术栈对比：

| 维度 | CLAUDE.md 描述（旧） | 实际代码（新） |
|---|---|---|
| **Taro** | 3.6.37 | **4.2.0** |
| **Vue** | Vue 2 | **Vue 3** (`^3.5.0`) |
| **状态管理** | Vuex 3 + vuex-persistedstate | **Pinia 3** + `pinia-plugin-persistedstate` |
| **UI 组件库** | Vant 2 | **Vant 4** (`^4.9.0`) |
| **框架插件** | plugin-framework-vue2 | **plugin-framework-vue3** |

`app.ts` 中使用 `createApp`、`createPinia` 等 Vue 3 API，确认已完成升级。项目根目录下的 `upgrade-plan.md` 记录了升级详情。

## 项目概述

跨平台小程序应用，基于 **Taro 4.2.0 + Vue 3 + Pinia 3 + TypeScript** 构建。核心业务为医保平台的数字身份认证，目标平台包括微信小程序、支付宝小程序和 H5（移动端网页）。

## 核心技术栈

- **框架**: Taro 4.2.0 + Vue 3 + TypeScript
- **状态管理**: Pinia 3，使用 Taro Storage 做持久化（`pinia-plugin-persistedstate`）
- **UI 组件库**: Vant 4 + `@yh/ui`（内部私有组件库，registry: `http://npm.ylzpay.com`）
- **样式**: Less 预处理器 + `@yh/postcss-px-transform` 做 px 单位转换（排除 Vant 组件）
- **构建**: Webpack 5（`@tarojs/webpack5-runner`）
- **HTTP**: Axios 0.21.4，含自定义 Taro 适配器（`src/utils/axios/taroAdapter.ts`）
- **工具库**: dayjs、lodash-es

## 业务领域

**医保平台数字身份认证**（邯郸医保经办视频工作台），从路由结构看：

- **主包**：`home`（首页）、`user`（用户中心）
- **分包 `identification`**：身份认证模块，包含 14 个页面
  - `loading` — 加载页
  - `home` — 认证首页
  - `authSuccess` — 认证成功
  - `twoElem` — 二要素认证
  - `ocr` — OCR 识别
  - `ehc` — 电子健康卡
  - `chs` / `chs/familyPhone` — 居民健康/家庭成员手机
  - `face` — 人脸识别
  - `phone` — 手机号认证
  - `alipay` — 支付宝认证
  - `ncidas` — 国家认证
  - `direct` — 直接认证
  - `webview` — 内嵌网页

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

## 项目结构

```
src/
├── app.ts              # Vue 3 入口，初始化 Pinia + Taro 生命周期
├── app.config.ts       # Taro 路由配置（主包 + 分包）
├── index.html          # H5 入口 HTML
├── api/                # 全局 API 层
├── assets/             # 静态资源 + Less 变量/函数
│   └── less/
│       ├── variables.less  # 全局 Less 变量
│       ├── functions.less  # 全局 Less mixins
│       └── index.less      # 全局样式入口
├── components/         # 全局公共组件
├── config/             # 请求配置
│   ├── api.ts          # 基础请求配置（URL、响应解析、错误码）
│   └── serviceConfig.ts # 环境相关 URL（dev/prod）
├── pages/              # 页面目录
│   ├── home/           # 首页
│   ├── user/           # 用户中心
│   └── identification/ # 身份认证分包（自包含模块）
│       ├── api/        # 分包独立 API
│       ├── components/ # 分包独立组件
│       ├── config/     # 分包独立配置
│       ├── store/      # 分包独立 Store
│       ├── utils/      # 分包独立工具
│       └── pages/      # 分包页面（14个）
├── store/              # Pinia store
├── types/              # TypeScript 类型定义
└── utils/              # 工具函数
    ├── https.ts        # Axios 实例 + 拦截器封装
    └── axios/
        └── taroAdapter.ts  # 小程序环境 Axios → Taro.request 桥接
```

## 架构要点

### 入口与路由
- `src/app.ts` — 应用入口，Vue 3 实例初始化 + Pinia 挂载，小程序生命周期钩子（`onShow`、`onHide`、`onLaunch`）
- `src/app.config.ts` — Taro 页面路由与分包配置

### 网络请求层（双配置体系）
- `src/config/api.ts` — 基础请求配置。小程序环境从 `serviceConfig` 读取，H5 从 `window.YHSERVICECONFIG` 读取
- `src/config/serviceConfig.ts` — 环境相关 URL（development / production）
- `src/utils/https.ts` — Axios 实例，含请求/响应拦截器，自动注入 `sessionId`、`appId`、`sign` 等字段
- `src/utils/axios/taroAdapter.ts` — 小程序环境下将 Axios 桥接到 `Taro.request`（H5 不使用）
- `src/pages/identification/api/` — 分包内独立的 API 调用

### 状态管理
- `src/store/` — 全局 Pinia store，通过 `pinia-plugin-persistedstate` 持久化到 Taro storage
- `src/pages/identification/store/` — 分包内独立的 Pinia store

### 分包结构
`identification` 分包为自包含模块，拥有独立的 `api/`、`components/`、`config/`、`store/`、`utils/`、`pages/` 目录，与 Taro 分包优化策略一致——构建时按分包拆分代码。

### 路径别名
- `@` → `src/`（在 `tsconfig.json` 和 `config/index.ts` 中配置）

## 开发规范

### 样式体系
- Less 预处理器，全局变量/函数通过 `lessLoaderOption.additionalData` 自动注入
- `@yh/postcss-px-transform` 处理 px 单位转换（排除 Vant 组件）
- **Vue 组件样式中不要使用 `scoped` 属性** — Taro 不支持。使用根类名下的唯一类名来隔离样式

### 环境判断
- `process.env.TARO_ENV` — 平台标识：`'weapp'`、`'alipay'` 或 `'h5'`
- `process.env.NODE_ENV` — `'development'` 或 `'production'`
- ESLint 中已配置全局变量 `wx`（微信）和 `ap`（支付宝）

### 构建配置
- `config/index.ts` — 基础配置：Webpack 5、tsconfig-paths 插件、px-transform 自定义
- `config/dev.ts` — 开发环境覆盖
- `config/prod.ts` — 生产环境覆盖
- `config/h5.ts` — H5 专属配置：dev server 代理到 `mstpay.com:1811`、输出文件名哈希、CSS 提取

### 代码风格
- 2 空格缩进、单引号、无分号（ESLint 强制）
- 配置和工具类文件使用 TypeScript；页面和组件使用 Vue SFC
- 分包页面可使用 Mixin 模式（`*Mixin.js`）共享逻辑
