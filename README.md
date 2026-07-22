# 小程序模板

> Taro + Vue3 + Vuex支持微信/支付宝小程序及h5

* Taro: https://taro-docs.jd.com/taro/docs/README/index.html
* Vue3: https://v3.cn.vuejs.org/
* Vuex: https://next.vuex.vuejs.org/
* vue3-taro-ui: https://b2nil.gitee.io/taro-ui-vue3/docs/introduction.html

## 开始
```bash
npm install #安装依赖
```

# 开发及打包
更具所需环境进行开发和打包
```bash
// package.json
{
  ...
  "scripts": {
    "dev:weapp": "npm run build:weapp -- --watch", # 微信小程序开发
    # 微信小程序生产开发模式: 在开发模式下, 压缩代码, 减少代码体积. 注意此时process.env.NODE_ENV=production,可能影响url配置
    "build-watch:weapp": "taro build --type weapp --watch --env production",
    "dev:alipay": "npm run build:alipay -- --watch", # 支付宝小程序开发
    "dev:h5": "npm run build:h5 -- --watch", # h5开发
    "build:weapp": "taro build --type weapp", # 打包微信小程序
    "build:alipay": "taro build --type alipay", # 打包支付宝小程序
    "build:h5": "taro build --type h5" # 打包h5
  },
  ...
}
```

## 目录结构
```bash
├── config # 开发配置
│   ├── dev.js
│   ├── index.js
│   └── prod.js
├── public
│   └── static # 静态资源
│       └── js
├── src
│   ├── api # 接口
│   │   └── index.js
│   ├── assets # 资源
│   ├── components # 公共组件
│   ├── config
│   │   └── api.js # 接口请求配置
│   ├── pages # 页面
│   │   └── demo
│   │       ├── index.vue # 页面内容
│   │       └── index.config.js # 页面配置
│   ├── store # 状态管理
│   ├── utils # 工具类
│   │   ├── axios # 自定义 axios
│   │   ├── https.js
│   │   └── index.js
│   ├── app.config.js # 全局配置, 页面路由
│   ├── app.js #入口文件
│   └── index.html # 只h5用到
├── README.md
├── babel.config.js
├── tsconfig.json # ts配置文件
├── package-lock.json
├── package.json
└── project.config.json #微信小程序配置文件
```

## 开发注意事项FAQ
1. **taro不支持vue文件样式的scoped属性**. 请在命名组件/页面时注意唯一性, 页面/组件样式需要在根类下定义, 避免影响到其他页面


