# Taro 4.2.0 + Vue 3 + Pinia + TypeScript 升级计划

## 背景

当前项目基于 Taro 3.6.37 + Vue 2 + Vuex 3，升级到 Taro 4.2.0 + Vue 3 + Pinia + TypeScript。

## 确认的技术选型
- 组件风格：`<script setup>` + Composition API
- 组件库：Vant 升级到 Vant 4
- @yh/ui：暂不处理，先升级框架核心

## 升级范围总览

- 30 个 .vue 文件改写为 `<script setup>` + Composition API
- 8 个 Mixin 文件转换为 Composable（`.ts`）
- 2 个 Vuex Store 迁移为 Pinia Store（`.ts`）
- 5 个构建/配置文件更新
- 2 个 Axios 相关文件调整 store 引用
- package.json 依赖全面更新

---

## 第一步：依赖升级

### 修改文件：`package.json`

**移除/替换的依赖：**
- `vue` ^2.5.0 → `vue` ^3.5.x
- `vuex` ^3.0.0 → 移除，替换为 `pinia`
- `vuex-persistedstate` → 移除，使用 `pinia-plugin-persistedstate`（自定义 Taro storage）
- `vue-template-compiler` → 移除，替换为 `@vue/compiler-sfc`
- `vue-loader` ^15.9.2 → 升级为 Taro 4 兼容版本
- `vant` ^2.12.47 → `vant` ^4.x
- `@tarojs/plugin-framework-vue2` → `@tarojs/plugin-framework-vue3`

**Taro 相关全部升级到 4.2.0：**
所有 `@tarojs/*` 包统一升级版本号

**新增依赖：**
- `pinia` ^3.x（Pinia 3.x，最新版本）
- `pinia-plugin-persistedstate`（用于 Pinia 持久化，需自定义 Taro storage 适配器）
- `@vue/compiler-sfc`

**babel.config.js 更新：**
- Vant 4 不再需要 `babel-plugin-import`（内置按需导入），移除 vant 相关 babel-plugin-import 配置
- `framework: 'vue'` 保持不变

---

## 第二步：构建配置更新

### `config/index.ts`
- `framework: 'vue'` 保持
- `plugins` 中将 `@tarojs/plugin-framework-vue2` 替换为 `@tarojs/plugin-framework-vue3`
- `compiler.type: 'webpack5'` 保持
- `lessLoaderOption` 保持不变
- `runtime.enableContains` 检查 Taro 4 是否仍支持

### `config/h5.ts`
- `esnextModules` 配置保持
- devServer proxy 配置保持
- 检查 webpackChain 中 TerserPlugin 配置兼容性

### `tsconfig.json`
- `jsx` 改为 `"vue"` 或保持 `"preserve"`（取决于 vue-tsc 要求）
- 可能需要添加 `@vue/runtime-core` 类型

### `.eslintrc.js`
- `extends` 中 `'taro/vue'` → `'taro/vue3'`（eslint-config-taro 升级后）
- `plugins` 保持 `@typescript-eslint`

---

## 第三步：应用入口重写

### `src/app.ts`

重写为 Vue 3 + Pinia 格式：
```ts
import { createPinia } from 'pinia'
import '@/assets/less/index.less'

const App = {
  onShow(options) { ... },
  onHide() {},
  onLaunch() {},
  setup() {
    // Pinia 在 Taro 入口中通过插件注册，不在此处直接使用
  }
}
export default App
```

**移除：**
- `import Vue from 'vue'` 和所有 `Vue.xxx` 调用
- `Vue.prototype.$platform = ...` → 改用 `app.config.globalProperties.$platform` 或 `provide/inject`
- `optionMergeStrategies` 自定义合并策略（Vue 3 不需要）
- `render(h)` 函数（Taro 4 Vue 3 不需要手动 render）

**Pinia 注册位置：** 在 `src/app.ts` 或单独的 `src/main.ts` 中创建 pinia 实例。Taro 4 Vue 3 框架插件会自动处理 app 创建，需参考 Taro 4 Vue 3 模板确认 pinia 注册方式。

---

## 第四步：Vuex → Pinia 迁移

### 根 Store：`src/store/index.ts`

**Vuex 版本：** State 包含 `token`、`openId`、`authState`、`userInfo`，使用 `vuex-persistedstate` 持久化

**Pinia 版本：** 拆分为 composable 风格的 store：
```ts
// src/store/index.ts
import { defineStore } from 'pinia'
import Taro from '@tarojs/taro'

export const useAppStore = defineStore('app', {
  state: () => ({
    token: '',
    openId: '',
    authState: '',
    userInfo: {}
  }),
  getters: {
    token: (state) => state.token,
    openId: (state) => state.openId,
    // ...
  },
  actions: {
    setToken(token: string) { this.token = token },
    // 持久化需手动处理或使用 pinia-plugin-persistedstate（需确认 Taro 兼容性）
    // 替代方案：使用 watch + Taro.setStorageSync 手动持久化
  }
})
```

**持久化替代方案：** `vuex-persistedstate` 不兼容 Pinia。使用 Pinia 插件或手动 `watch` + `Taro.setStorageSync`。推荐使用 `pinia-plugin-persistedstate` 并自定义 Taro storage。

### 分包 Store：`src/pages/identification/store/index.js`

**Vuex namespaced module** → **Pinia independent store**

当前 Vuex 模块包含复杂逻辑：`nextAuthMethod`、`recordAuthResult`、`operateCurrentAuthMethodIndex`、`successCallback` 等。

迁移为 Pinia store：
```ts
// src/pages/identification/store/index.ts
export const useIdentificationStore = defineStore('identification', {
  state: () => ({ ... }),
  getters: { ... },
  actions: { ... }  // mutations 合并到 actions
})
```

**关键变化：** 所有 `commit` 调用需改为直接赋值或 action 调用。`dispatch('identification/xxx')` → 直接调用 store action。

**动态注册 `registerModule`：** Pinia 不支持动态注册。loading 页面中的 `this.$store.registerModule('identification', ...)` 需要移除，改为直接导入 `useIdentificationStore` 并调用 `resetState()` action。

---

## 第五步：Mixin → Composable 转换

### 8 个 Mixin 文件转为 Composable

| Mixin 文件 | 转为 Composable | 说明 |
|---|---|---|
| `resetMixin.js` | `useReset.ts` | `onLoad`/`onUnload` 生命周期 + data |
| `privacyMixin.js` | `usePrivacy.ts` | `mounted` + Vuex mapGetters |
| `ehcMixin.js` | `useEhc.ts` | `onLoad` + 复杂方法 + mapGetters |
| `phoneMixin.js` | `usePhone.ts` | `onLoad` + 多个方法 + mapGetters |
| `chsMixin.js` | `useChs.ts` | `onLoad`/`onShow`/`onUnload` + 复杂回调 |
| `alipayMixin.js` | `useAlipay.ts` | `onLoad` + 方法 + mapGetters |
| `ocrMixin.js` | `useOcr.ts` | 嵌套 mixin + mapGetters |
| `home 页面多 mixin` | 拆分组合 | 5 个 mixin 同时使用，改为 composable 组合 |

**Mixin 转换模式：**
```ts
// Vue 2 Mixin
export default {
  data() { return { reset: false } },
  onLoad() { ... },
  computed: { ...mapGetters('identification', ['currentAuthMethod']) }
}

// Vue 3 Composable
import { ref } from 'vue'
import { useIdentificationStore } from '../../store'
export function useReset() {
  const reset = ref(false)
  const authMethod = ref({})
  const store = useIdentificationStore()
  // Taro onLoad → onMounted 或 Taro 生命周期
  return { reset, authMethod }
}
```

---

## 第六步：全部 .vue 组件改写（30 个文件）

### 核心转换规则

1. **Options API → Composition API（`<script setup>`）**
   - `data()` → `ref()` / `reactive()`
   - `computed: {}` → `computed()`
   - `methods` → 普通函数
   - `watch: {}` → `watch()` / `watchEffect()`
   - `mixins: [...]` → composable 函数调用
   - `components: {}` → 直接 import（`<script setup>` 自动注册）

2. **生命周期映射：**
   - `created` → 直接在 setup 顶层执行
   - `mounted` → `onMounted`
   - `beforeDestroy` → `onBeforeUnmount`
   - `destroyed` → `onUnmounted`
   - Taro `onLoad` → `onMounted` 或 Taro 的 `useLoad` hook（Taro 4 Vue 3 支持）
   - Taro `onShow` → `useDidShow`
   - Taro `onUnload` → `useUnload` / `onUnmounted`

3. **Vuex → Pinia 调用替换：**
   - `this.$store.commit('identification/setXxx', val)` → `identificationStore.setXxx(val)` 或 `identificationStore.xxx = val`
   - `this.$store.dispatch('identification/xxx', data)` → `await identificationStore.xxx(data)`
   - `...mapGetters('identification', ['xxx'])` → `const { xxx } = storeToRefs(identificationStore)`
   - `this.$store.hasModule()` / `registerModule()` → 移除，直接使用 Pinia store
   - `this.$store.commit('setAgreement', true)` → `appStore.setAgreement(true)`

4. **v-model 变化（Vue 2 → Vue 3）：**
   - 组件 `v-model`：`value` prop + `input` event → `modelValue` prop + `update:modelValue` event
   - `.sync` 修饰符 → `v-model:propName`
   - `this.$emit('input', val)` → `this.$emit('update:modelValue', val)`
   - `van-popup v-model="show"` → `van-popup v-model:show="show"`（Vant 4）
   - `van-checkbox v-model="checked"` → `van-checkbox v-model:modelValue="checked"`（或确认 Vant 4 API）

5. **$attrs / $listeners 变化：**
   - Vue 3 移除了 `$listeners`，所有事件监听器合并到 `$attrs`
   - `v-bind="$attrs" v-on="$listeners"` → `v-bind="$attrs"`（已包含事件）
   - 组件需声明 `inheritAttrs: false` 并在模板中使用 `v-bind="$attrs"`

6. **渲染函数变化：**
   - `Vue.prototype.$platform` → 通过 `provide/inject` 或 `useAttrs()` / 全局属性 `app.config.globalProperties.$platform`
   - `app.ts` 中的 render 函数需使用 Vue 3 h 函数

### 受影响的 .vue 文件清单

**全局组件（3 个）：**
- `src/components/GNavBar/index.vue` — Vue.extend + Vant Icon
- `src/components/GUserKnow/index.vue` — Vuex mapGetters + Vant Popup + v-model + $store
- `src/components/FixedBottom/index.vue` — $refs + @yh/ui Button + Taro API

**主包页面（2 个）：**
- `src/pages/home/index.vue` — Vant 组件 + $refs
- `src/pages/user/index.vue` — Vant 组件 + @tarojs/router

**分包组件（12 个）：**
- `AuthMethod.vue` — $emit
- `AuthPage.vue` — $emit
- `CertTop.vue` — props
- `GButton.vue` — $emit
- `GEmpty.vue` — props
- `GInput.vue` — v-model (value/input → modelValue/update:modelValue)
- `GPicker.vue` — v-model
- `GPopupPicker.vue` — Vant Popup + $attrs/$listeners + v-model
- `GUserKnow.vue` — Vuex + $store + Vant Popup + v-model + .sync
- `TwoElem.vue` — props + $emit + v-model
- `TwoElemNcidas.vue` — props + $emit + v-model + watch
- `TwoElemPlus.vue` — props + $emit + v-model

**分包页面（13 个）：**
- `loading/index.vue` — 动态注册 Vuex module + mixin
- `home/index.vue` — 5 个 mixin + 大量 Vuex 调用
- `twoElem/index.vue` — mixin + Vuex
- `ehc/index.vue` — mixin
- `chs/index.vue` — mixin
- `chs/familyPhone.vue` — mixin + Vuex + v-model
- `alipay/index.vue` — mixin
- `phone/index.vue` — mixin
- `ocr/index.vue` — mixin + Vuex + v-model
- `face/index.vue` — mixin + Vuex
- `ncidas/index.vue` — mixin + Vuex
- `direct/index.vue` — mixin + Vuex
- `authSuccess/index.vue` — Vuex
- `webview/index.vue` — 简单页面

---

## 第七步：工具文件调整

### `src/utils/axios/taroAdapter.ts`
- 检查 `Taro.request` API 在 Taro 4 中是否变化（大概率兼容）
- Axios 版本保持 0.21.4 或升级（注意 API 兼容性）

### `src/utils/https.ts`
- `import store from '../store/index'` → 移除
- Axios 拦截器中获取 token：改为在拦截器函数内调用 `useAppStore()`（Pinia store 可在拦截器函数内使用，因为此时 app 已创建）
- `store.getters.token` → `appStore.token`

### `src/pages/identification/api/https.js`
- 同上，独立的 Axios 实例，需调整 store 引用方式
- 改为 `.ts` 文件

### `src/pages/identification/utils/navigation.js`、`index.js`、`validate.js`、`wxqrcode.js`
- 纯工具函数，不依赖 Vue，仅需确认 Taro API 兼容性

---

## 第八步：Vant 2 → Vant 4 适配

### 组件使用变化
- Vant 4 内置按需导入，移除 `babel-plugin-import` 的 vant 配置
- `import { Button, Popup, Icon, Checkbox, Field } from 'vant'` 导入方式保持不变
- 组件名注册方式保持 `[Button.name]: Button` 或直接使用（`<script setup>` 自动注册）

### API 变化
- `van-popup v-model="show"` → `van-popup v-model:show="show"`
- `van-checkbox v-model="checked"` → `van-checkbox v-model:checked="checked"`（Vant 4 Checkbox 使用 `checked` 而非 `modelValue`）
- 需确认 `Field` 组件是否仍在 Vant 4 中使用，或替换为自定义 `GInput`

### 风险点
当前项目通过 `@tarojs/plugin-html` 在小程序中使用 Vant H5 版本。需验证 Vant 4 + Taro 4 + plugin-html 组合可行性。如有问题，可考虑替换为 NutUI 或保留 Vant 2 的特定组件。

---

## 执行顺序

按以下顺序逐步执行，每步完成后可单独验证：

1. **配置先行** — 更新 `package.json` 依赖、`config/index.ts`、`babel.config.js`、`tsconfig.json`、`.eslintrc.js`，运行 `npm install`
2. **入口改造** — 重写 `src/app.ts` 为 Vue 3 格式
3. **Store 迁移** — 创建 Pinia store 替换 `src/store/index.ts` 和 `src/pages/identification/store/index.js`
4. **Composable 转换** — 8 个 Mixin 文件转为 composable 函数
5. **简单组件/页面** — 先改不依赖 mixin 的简单组件（CertTop、GButton、GEmpty、AuthMethod、AuthPage、webview）
6. **v-model 组件** — GInput、GPicker、GPopupPicker、GUserKnow 等 v-model 组件
7. **分包页面** — 从简单到复杂（twoElem → face → direct → phone → alipay → ehc → chs → ocr → ncidas → authSuccess → loading → home）
8. **主包页面** — home、user
9. **工具文件** — https.ts、identification/api/https.js 的 store 引用调整
10. **Vant 4 适配** — 更新所有 Vant 组件用法
11. **全局组件** — GNavBar、GUserKnow（根组件）、FixedBottom

## 验证方式

1. `npm run dev:weapp` 在微信开发者工具中打开，验证主页面和分包页面渲染正常
2. `npm run dev:h5` 验证 H5 页面正常运行
3. 验证完整认证流程（从 loading → home → 各认证页面 → authSuccess）
4. 检查 Pinia store 持久化：关闭重开后 token 等状态是否保留
5. 检查 `@yh/ui` 的 FixedBottom 组件在 Vue 3 下是否仍可用（暂不处理但需验证不报错）
6. ESLint 检查：`npx eslint src/ --ext .js,.ts,.vue`
