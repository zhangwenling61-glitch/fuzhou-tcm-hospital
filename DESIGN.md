# DESIGN.md — MH3.0 门户设计规范

> 所有尺寸按 **750px @2x** 写入代码：Figma 1x 标注 ×2。颜色不换算。
> Less token 来源：`src/assets/less/variables.less`。页面不得硬编码色值、字号、行高、字重、标准圆角、卡片阴影。

## 一、文档职责

| 文档 | 用途 |
|------|------|
| `DESIGN.md` | 全局 token、布局、组件、资产与硬规则 |
| `DESIGN.list.md` | 二级列表/表单列表页 |
| `DESIGN.form.md` | 表单组件页 |
| `SKILL.md` | Codex 执行索引与红线，不放长示例 |

## 二、核心红线

- 纯移动端，禁止 PC 组件库和桌面布局。
- Figma 1x 尺寸必须 ×2 后写 Less；小数先换算后四舍五入。
- Vue 样式不使用 `scoped`，用页面根类名隔离。
- 自定义 `<button>` 必须洗白微信默认样式，尤其 `button::after`。
- 分割线使用 hairline，普通列表/卡片内禁止厚 1px/2px 线。
- 位图 PNG/JPG 按 @3x 导出，CSS 展示尺寸仍按 1x ×2。
- 渐变、色块、文字不用切图；复杂插画、纹理、无法 CSS 精准还原的视觉才切图。
- **全量页面用户敏感信息脱敏展示红线**：所有用户卡片、列表、详情、表单回显、记录页和弹窗中的用户敏感信息展示态必须默认脱敏；仅实名认证、编辑录入、授权校验等用户主动输入/核验流程可按业务需要显示正在输入的原值。脱敏规则统一如下：
  - 姓名：2 个字时，第一个字打码；多于 2 个字时，保留首尾，中间打码。
  - 身份证号：只显示第一位和最后一位，中间全部打码。
  - 手机号：显示前 3 位和后 2 位，中间全部打码。
  - 银行卡号：只显示最后 4 位，前面全部打码。
- **微信真机首帧点击层失效红线**：
  - Tab / Segment / 分类按钮只保留一条状态切换事件链，优先使用 `@tap`（公共组件可统一使用 `@click`）；禁止在同一节点同时用 `touchstart`、`touchend` 更新响应式按压状态后再依赖 `tap` 切换，避免微信小程序在 `tap` 前重绘并吞掉首次点击。
  - 按压反馈统一交给 `hover-class` 或 CSS `:active`，不额外维护临时按压状态。
  - 绝对定位背景、渐变、插画、伪元素和滑块必须设置 `pointer-events: none`；真实 Tab 容器和按钮必须显式设置 `pointer-events: auto`，并位于装饰层之上。
  - `position: sticky` 的祖先节点禁止使用 `transform` 入场动画，也禁止使用 `overflow-x: hidden` / `overflow: hidden` 制造隐式滚动容器；首屏容器如需入场仅使用透明度动画，避免微信真机命中区域与视觉位置不同步。
  - 若完成上述检查后，新建干净的全新测试页面仍复现“首次进入需滚动一下点击才恢复”，立刻停止修改业务代码，优先进行微信缓存清理和 `dist/weapp` 物理重建产物测试。

## 三、Design Token

### 3.1 颜色

| 用途 | Less 变量 | 色值 |
|------|-----------|------|
| 福州中医院品牌主绿 | `@hospital-primary`（`@blue` / `@green` / `@theme-color` 仅为历史兼容别名） | `#457130` |
| 品牌辅助青 | `@cyan` | `#36CFC9` |
| 一级文字 | `@text-color-dark` | `#222222` |
| 二级文字 | `@text-color` | `#666666` |
| 三级/占位 | `@text-color-secondary` | `#999999` |
| 成功 | `@success-color` | `#07C160` |
| 警告 | `@warning-color` | `#FF9D0B` |
| 危险/错误 | `@danger-color` | `#FF595E` |
| 默认边框 | `@border-color-light` | `#EBEDF0` |
| 浅分割/点击态 | `@border-color` | `#F2F3F5` |
| 页面浅灰底 | `@bg-color-light` | `#F7F8FA` |
| 白底 | `@bg-color` / `@white` | `#FFFFFF` |
| 门户主绿浅背景 | `@bg-color-blue-1` | `#ECF6E7` |
| 门户内容浅绿 | `@bg-color-blue-2` | `#F7FAF6` |
| 二级页背景 | `@bg-color-blue-1` | `#ECF6E7` |
| 二级页渐变底 | `@bg-color-secondary-end` | `#F4FAF2` |
| 箭头色 | `@arrow-color` | `#DCDEE0` |

### 3.2 字号 / 行高 / 字重

| Token | 字号 | 行高 | 默认字重 | 用途 |
|-------|------|------|----------|------|
| display | `@font-size-display` 56px | `@line-height-display` 72px | 500/800 | 展示级标题 |
| title-lg | `@font-size-title-lg` 48px | `@line-height-title-lg` 64px | 500 | 大标题 |
| title-md | `@font-size-title-md` 40px | `@line-height-title-md` 56px | 500 | 导航/模块标题 |
| title-sm | `@font-size-title-sm` 36px | `@line-height-title-sm` 52px | 500 | 卡片/列表标题 |
| body-lg | `@font-size-body-lg` 34px | `@line-height-body-lg` 48px | 400 | 大正文 |
| body-md | `@font-size-body-md` 32px | `@line-height-body-md` 44px | 400 | 默认正文 |
| body-sm | `@font-size-body-sm` 28px | `@line-height-body-sm` 40px | 400 | 副文本 |
| caption | `@font-size-caption` 24px | `@line-height-caption` 36px | 400 | 辅助说明 |

字重：`@font-weight-regular`=400，`@font-weight-medium`=500，`@font-weight-semibold`=600，`@font-weight-heavy`=800。字体：`@font-regular`、`@font-medium`。

### 3.3 卡片与圆角

| Token | 值 | 用途 |
|------|----|------|
| `@card-radius` | 32px | 标准白底卡片圆角 |
| `@card-padding-x` | 32px | 标准卡片左右内边距 |
| `@card-padding-y` | 32px | 标准卡片上下内边距 |
| `@card-border-color` | `@white` | 标准卡片白色描边 |
| `@card-bg` | `@white` | 标准卡片底色 |
| `@card-shadow` | `0 8px 32px rgba(166, 186, 214, 0.18)` | 标准卡片阴影 |
| `@icon-corner-radius` | 16px | 72×72 圆角方形图标，Figma 1x 半径 8px |

标准卡片类：普通卡片 `.yh-card`；门户卡片 `.yh-portal-card`；二级列表卡片 `.yh-secondary-card`。禁止页面内重写标准卡片的背景、圆角、阴影、描边。

### 3.4 门户模块标题弧线

- 门户首页、互联网医院首页等主页面模块标题（如“名医专家”“特色科室”“健康科普”“历史就诊医生”“其他服务”）统一使用全局青色弧线装饰。
- 标题元素可直接使用 `.yh-portal-section-heading`，历史兼容类 `.portal-home__module-heading`、`.internet-home__module-heading` 已由全局样式接管。
- 门户服务分类页签（如“门诊服务 / 住院服务 / 便民服务 / 健康服务”）必须使用公共组件 `PortalServiceTabs`，不要在页面里重复写 `.portal-home__service-tabs` / `.portal-home__service-tab`。
- 页签类标题下方的青色弧线统一使用 `.yh-portal-title-mark`；历史兼容类 `.portal-home__service-tab-line` 仍由全局样式接管。
- 青色弧线必须由 CSS 绘制，颜色使用 `@cyan`，出现动画使用全局 `yh-section-underline-check-pop`；禁止再使用 `选中.png`、`tab-active-mark.svg` 等旧切图。

## 四、布局规范

| 项 | 代码值 |
|----|--------|
| 页面左右 gutter | 24px |
| 卡片间距 | 32px |
| 小卡/宫格间距 | 16px |
| 板块间距 | 16px |
| 卡片内分割线 | `@border-color-light` hairline |

布局类型：

- 通栏式：普通列表/分组，左右 24px，板块间距 16px。
- 卡片式：表单/信息卡，默认用 `.yh-card`。
- 二级列表式：必须看 `DESIGN.list.md`，默认 `.yh-secondary-*`。
- 双行列表：统一使用 `.yh-secondary-row.is-double`，禁止页面局部自定义行高、图标尺寸、标题/副标题字号。

### 3.9 二级页面滚动头部高遮罩规范

1. **大遮罩平滑消隐**：
   - 所有的二级页面（即使用 `PortalNavBar` 或 `PortalSegmentNav` 且 `secondary` 为 `true` 的结构），为了避免页面向上滚动时内容穿透到导航栏下方并与标题重叠，必须全局统一将滚动头部的底部毛玻璃渐变遮罩高度设定为较高的 **`240px`**，并配合 `-webkit-mask-image: linear-gradient(180deg, #000000 55%, transparent 100%);` 进行平滑淡化消隐。
   - 这能有效在文字向上滚动时提供足够的遮挡和毛玻璃模糊距离，确保标题文字的清晰可读。
2. **一级页面无感隔离**：
   - 该高遮罩规范仅对二级页面（`secondary: true`）生效，4个一级页面的头部遮罩依然保持默认的 `100%`（约 88px 胶囊高度）不变，实现绝对的安全隔离设计。

### 4.1 移动端页面底部预留与安全区规范

1. **基本倍率换算**：
   - Figma 设计稿为 **`375px`** 宽的 1x 逻辑尺寸。
   - 当前开发环境按 **`2x`** 倍率换算，小程序中 `1px` 设计值 = `2rpx`，开发时**不要**把 Figma 标注再除以 2（代码中直接按 Figma 标注 ×2 写入像素值）。
2. **普通页面内容底部预留 (无底部固定操作区)**：
   - 普通页面内容底部预留：**`16px` (代码 `32px`) + safe-area-bottom**。
   - 小程序换算为：`32rpx + env(safe-area-inset-bottom)`。
   - 对于采用大底色容器的二级页面，为保证最后内容的呼吸感及安全区，全局 `.yh-secondary-content` 的 `padding-bottom` 统一规定为：
     `padding-bottom: calc(50px + env(safe-area-inset-bottom)); // 最后一个卡片与屏幕底部保持 50px 黄金留白，防留白过大`
3. **底部固定按钮区域 (FixedBottom) 结构规范**：
   - 底部固定操作按钮区必须按照以下严格的结构比例实现：
     - **顶部间隙 (Top Gap)**：`20px` (代码 `40px`)
     - **左右间隙 (Left/Right Gap)**：`16px` (代码 `32px`)
     - **按钮高度 (Button Height)**：`48px` (代码 `96px`)
     - **底部间隙 (Bottom Gap)**：`12px` (代码 `24px`) + `safe-area-bottom`
   - 小程序换算为：`顶部 40rpx`、`左右 32rpx`、`按钮高 96rpx`、`底部 24rpx + env(safe-area-inset-bottom)`。
   - **全局强制悬浮遮罩 (Gradient Mask)**：**只要页面底部有悬浮/固定按钮，都必须统一强制使用标准蓝灰渐变遮罩作为背景**。该渐变遮罩的背景样式统一为：`background: linear-gradient(0deg, @bg-color-blue-1 80%, fade(@bg-color-blue-1, 0%) 100%);`（即最底为背景色 `@bg-color-blue-1` `#D6E8FE`）。
   - **标准类名复用**：开发时必须统一套用全局样式类 `.fixed-bottom-bar.is-transparent` 或组件封装，严禁在页面局部硬编码其他颜色、渐变或使用白底，确保全平台视觉高度一致性。
4. **全面屏高度适配防重叠原则**：
   - **全面屏安全区去重**：如果 Figma 标注的底部固定按钮区高度为 **`375×114`**，表示这个高度已经按 iPhone 全面屏包含了安全区，**不要**再额外重复增加 34px/68px 的安全区。
   - **内容防遮挡预留**：页面内容区必须预留底部固定按钮的高度作为 `padding-bottom`，避免滚动内容被底部固定按钮遮挡。如果使用了 `FixedBottom` 全局组件，其占位和高度获取逻辑会自动处理。

### 4.2 卡片内/行分割线对齐红线 (Hairline Alignment)

1. **行内分割线全局统一对齐规范**：
   - 在卡片内或列表行 `.yh-secondary-row` 中，为保持文本起点的整齐度，分割线不能生硬地跨越整行，必须遵循对齐文本起点的原则。
   - **带左侧图标**：如果行内包含左侧图标 `.yh-secondary-row__icon`（例如头像、分类图标等），分割线 `::after` 的左边起点必须自动缩进 **`96px`**（即图标宽度 `72px` + 间距 `24px` @2x），使其与右侧文本标题的左侧边缘在视觉上垂直绝对对齐。
   - **无左侧图标**：如果是表单输入项（`is-input`）、键值展示项（`is-key-value`）或无图标单/双行文本列表，分割线 `::after` 保持通底，即左边起点为 **`0`**。
   - **实现机制**：全局样式中已经通过 `&:has(.yh-secondary-row__icon)` 和 `&.has-icon` 自动判定，开发时无需手动对齐。
2. **末尾项隐藏线**：
   - 属于卡片或列表容器中最后一项的行（`:last-child`），其底部分割线必须自动隐藏。

## 五、全局组件

| 组件 | 路径 | 默认用途 |
|------|------|----------|
| `PortalNavBar` | `src/components/PortalNavBar/index.vue` | 门户顶部导航 |
| `PortalTabbar` | `src/components/PortalTabbar/index.vue` | 一级 Tab 底部标签栏 |
| `PortalRowArrow` | `src/components/PortalRowArrow/index.vue` | 列表行右箭头 |
| `PortalFormCard` | `src/components/PortalFormCard/index.vue` | 表单/列表标准卡片容器 |
| `PortalFormRow` | `src/components/PortalFormRow/index.vue` | 表单/列表标准行组件 (支持 input, key-value, select) |
| `PortalEmptyState` | `src/components/PortalEmptyState/index.vue` | 全屏缺省状态内容组件 |
| `FixedBottom` | `src/components/FixedBottom/index.vue` | 底部固定操作区 |
| `GNavBar` | `src/components/GNavBar/index.vue` | 旧通用导航，门户二级页优先不用 |

### 5.1 顶部导航

- 一级页：`<PortalNavBar title="首页" :scroll-top="scrollTop" />`
- 二级页：`<PortalNavBar title="页面标题" :scroll-top="scrollTop" secondary />`
- 二级页必须接入 `usePageScroll` 并传 `scrollTop`。
- 初始透明；滚动后渐变毛玻璃；`secondary` 自动显示返回 + 主页按钮。

### 5.2 二级列表页

二级列表/表单列表页必须使用：

- `.yh-secondary-page`
- `.yh-secondary-content`
- `.yh-secondary-card`
- `.yh-secondary-row`
- `PortalRowArrow`

详见 `DESIGN.list.md`。

#### 5.2.1 用户信息卡 + 页签 + 内容卡结构

当二级业务页顶部包含 `PortalUserCard`，下方紧跟双页签切换，再进入列表/表单内容区时，必须复用以下全局结构，禁止页面局部重新手写页签样式：

- 用户卡外层：页面自有 `*-user-card-wrap`，左右 `24px`，上内距 `24px`，下内距 `24px`，内部 `PortalUserCard` 宽度 `100%`、最大宽度 `702px`。
- 页签：使用 `.yh-inline-segment` + `.yh-inline-segment__active-bg`，按钮必须单行无空白字符书写；滑块宽度/位置使用 `Taro.pxTransform(8/24/4)` 计算，避免 H5 和小程序单位差异导致左右间距错位。
- 页签与内容卡间距：页签后包一层 `.yh-user-card-segment-content`，该类统一提供 `16px` 顶部间距（Figma 8px）和底部安全区预留。
- 内容大卡：在 `.yh-user-card-segment-content` 内部再放 `.yh-secondary-content`，列表卡片继续使用 `.yh-secondary-card`。不要把页签和 `.yh-secondary-content` 粘在同一个圆角底色容器里。
- 典型页面：结算缴费、预约签到、候诊叫号、取药信息。后续相同结构必须直接复用这套全局类。
- **页签底边与内容列表无小标题时的间距全局红线**：若页签下方直接是卡片列表且没有分组小标题，页签底边与首张卡片上边沿的视觉距离全局必须强制统一为 **`40px`** ($80\text{rpx}$，即 Figma 1x 规格 $20\text{px}$)，绝不允许采用其他随意数值。
  - **吸顶/固定页签 (如 `PortalSegmentNav` + `scroll-view` 结构)**：页签下方固定留白 `8px`，内容大卡片 `.yh-secondary-content` 的 `padding-top` **必须强制指定为 `32px !important;`** ($64\text{rpx}$)，从而满足 $8\text{px} + 32\text{px} = 40\text{px}$ 的黄金间距要求。
  - **普通流页签 (如 `.yh-inline-segment` 结构)**：页签下包裹 `.yh-user-card-segment-content`（顶边距 `16px`），内部 `.yh-secondary-content` 保持默认 `padding-top: 24px`，完美实现 $16\text{px} + 24\text{px} = 40\text{px}$。


#### 5.2.2 多卡片列表与业务卡片内部流

业务列表、记录列表、套餐列表、表格详情等页面禁止再用页面局部 `margin-bottom` 堆间距，统一复用以下全局类：

- 多张结果卡片：外层使用 `.yh-secondary-list-stack`，卡片上下间距统一为 `24px`（Figma 12px）。
- 自定义业务卡片内部：卡片同时加 `.yh-secondary-card-flow`，卡片内标题、说明、表格、分割线、按钮等纵向间距统一为 `24px`（Figma 12px）。
- 卡片内分割线：使用 `.yh-secondary-card-flow__divider`，禁止页面局部重复写 divider margin。
- 能用 `.yh-secondary-row` / `PortalFormRow` 的键值行和表单行必须复用全局行样式；只有复杂业务块才使用 `.yh-secondary-card-flow` 扩展。

### 5.3 表单页

表单卡片、字段、上传、搜索、状态规则详见 `DESIGN.form.md`。

### 5.4 全屏缺省状态

- `PortalEmptyState` 是业务结果为空时的**全屏缺省状态内容组件**，不是小图标占位。典型场景：我的预约记录、开票记录、结算记录、配药申请记录等列表数据为 0。
- 业务列表/记录页为空时，统一使用 `.yh-secondary-card.yh-empty-state-screen` 包裹 `PortalEmptyState`，让缺省状态占据结果区剩余高度：`<div class="yh-secondary-card yh-empty-state-screen"><PortalEmptyState desc="当前暂无相关记录" /></div>`。
- 禁止页面局部手写 emoji 图标、`.empty-state`、`.empty-icon`、`.empty-text` 等重复缺省结构；页面只传入业务描述文案，默认标题保持“暂无数据”。
- 页面不得重写 `PortalEmptyState` 内部插画尺寸、动画、标题字号和描述字号；只能控制外层结果区是否全屏、是否有额外操作按钮。
- 单独展示空状态的页面可禁用页面滚动，使用 `disableScroll: true`，并让内容在一屏内完成展示。

## 六、组件视觉规则

- 主按钮：使用 `.eux-btn--primary`，蓝色立体渐变、内外阴影、白字、48px 圆角；禁止扁平蓝色按钮。
- 标签/徽标/Toast/Dialog/ActionSheet：优先使用全局封装或 Vant 兼容层，业务页禁止重复手写蒙层和弹窗结构。
- 列表项：右箭头用 `PortalRowArrow` 或指定本地箭头资产，禁止用 Vant 内置图标替代。
- 图文同行小图标偏低时，用 `transform: translateY(-2px)` 做视觉修正。

## 七、图标与资产

| 类型 | 目录 / 方式 |
|------|-------------|
| 医疗服务图标 | `src/assets/icons/medical-service/` + `icon-map.ts` |
| Tabbar 图标 | `src/assets/icons/tabbar/` + `icon-map.ts` |
| 科室图标 | `src/assets/icons/dept/` + `icon-map.ts` |
| 通用箭头/下拉 | `src/assets/icons/base/style1/dropdown.svg` |
| 顶部返回/主页 | `src/assets/images/顶部导航栏/返回.png` / `home.png`，仅供 `PortalNavBar` |

规则：

- SVG 优先保持矢量；PNG/JPG 必须 @3x。
- 图标保持原比例，不得拉伸。
- 圆角方形图标使用 `@icon-corner-radius`，禁止 `50%`，除非设计明确是圆形。

## 八、弹窗与蒙层规范 (Popup & Overlay)

为保证全平台交互一致性与精致的用户体验，弹窗与蒙层实现必须严格遵循以下规则：

1. **阻止背景页面滚动 (Background Scroll Blocking)**：
   - 当弹窗或半屏遮罩层开启时，下方的背景页面**禁止**产生任何滚动或回弹。
   - **实现红线 1**：在 Taro 项目中，弹窗根容器必须绑定 `:catch-move="true"` (对应小程序的 `catchtouchmove`)。此机制由 Taro 编译器在小程序端转化为原生事件拦截，在 H5 端不影响弹窗内滚动容器。
   - **实现红线 2 (yh-scroll-locked)**：仅依赖 `:catch-move="true"` 并不能完全锁死复杂的底层穿透滚动。凡是包含 `PortalActionSheet`、选项选择器、业务提示弹窗或半屏 `van-popup` 的页面，其页面根容器（如 `.yh-secondary-page`、`.profile-page` 或 `.internet-home`）**必须全局强制绑定动态类** `:class="{ 'yh-scroll-locked': isPopupOpen }"`。其中 `isPopupOpen` 必须是该页**所有弹窗/动作面板显示状态的合并值**，例如 `store.showPatientSwitcher || showFilterPopup || showNoticePopup`；禁止只绑定某一个弹窗变量，以实现物理级别的 100% 滚动锁定。
2. **弹窗高度自适应规则 (Height Mode & Auto-Upgrading)**：
   - 弹窗支持两种标准高度设定：
     - `max`（高尺寸）：高度定为 `calc(100vh - 280px)` (保留顶部导航栏与状态栏的精美呼吸感)。
     - `compact`（矮/紧凑尺寸）：高度定为 `calc(66.6667vh - 187px)`。
   - **动态升轨机制**：若初始高度设为 `compact`，但弹窗内的实际内容高度溢出当前视口（即 `scrollHeight > clientHeight + 1`），代码逻辑中必须**自动升轨**，将高度模式升级至 `max`，并利用 `ResizeObserver` (H5) 或 `SelectorQuery` (小程序) 实现动态监测与平滑自适应。
3. **内容滚动与回弹拦截 (Content Scroll & Elasticity Control)**：
   - **文字多可滚动 (图二)**：当内容溢出（`scrollHeight > clientHeight + 1`）时，启用容器垂直滚动 (`scroll-y="true"` / `overflow-y: auto`)，使文本具有良好的滑行性能。
   - **文字少不滚动 (图三)**：当内容极少未溢出时，必须**禁用/锁定**容器滚动 (`scroll-y="false"` / `overflow-y: hidden`)，阻止在 iOS/微信端产生不自然的回弹橡皮筋效果。
   - **滚动渐变遮罩 (Gradient Shadow Mask)**：当文字可滚动且用户向下滚动超过 `6px` 时，为容器顶部启用标准渐变半透明遮罩 (`.is-scrolled`)，利用 CSS `mask-image` 实现自然的淡出阴影，指示上方仍有内容。
4. **动作面板 ActionSheet 全局规范**：
   - 底部选择类弹窗统一使用 `PortalActionSheet`，业务页禁止重新手写 `van-popup` + 自定义列表结构。适用场景包括：切换就诊人、意见类型选择、普通选项面板、查询时段/筛选面板等。
   - 默认选项面板使用 `actions` + `value`，组件自动渲染 `.premium-action-sheet-item`、选中蓝色描边与右侧对勾；就诊人切换自动复用患者头像、医保/自费标签和卡号信息。
   - 复杂内容面板使用 `PortalActionSheet` 默认插槽承载内容，并使用全局类：`.premium-action-sheet-custom-body`、`.premium-action-sheet-section-title`、`.premium-action-sheet-footer`、`.premium-action-sheet-footer-btn`。不得在页面内重复定义底部按钮渐变、面板圆角、蒙层或安全区规则。
   - 视觉标准：面板顶部圆角 `60px`，蒙层 `rgba(0,0,0,0.7)`，标题区高 `112px`，底部按钮区使用蓝灰透明渐变并包含 `env(safe-area-inset-bottom)`；取消按钮为浅蓝胶囊，确认按钮为品牌蓝胶囊。
   - 需要右上角关闭按钮时传 `show-close`；不需要默认取消按钮时传 `:show-cancel-button="false"` 并用 `#footer` 插槽提供全局 footer 结构。

## 九、实现检查

- 是否按 Figma 1x ×2 写入尺寸。
- 是否全部使用 token。
- 是否复用全局组件和全局卡片/列表类。
- 是否清除了 button 默认样式。
- 是否 H5 与微信小程序都能构建。

---

专项文档：[DESIGN.list.md](./DESIGN.list.md) / [DESIGN.form.md](./DESIGN.form.md)
