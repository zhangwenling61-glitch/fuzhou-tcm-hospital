# DESIGN.list.md — 二级列表页规范

> 本文档是 MH3.0 二级列表/表单列表页面的强制规范。所有尺寸均为 **750px @2x** 基准：Figma 1x 标注 × 2 = 代码值。

## 一、适用范围

- 二级列表页、表单列表页、设置页、记录列表页、协议/说明入口页、消息中心页。
- 非首页、非一级 Tab 页面（含从 Tab 页面跳入的带导航栏子页面）。
- **后续新建二级页面默认强制执行本规范，不需要重复说明或确认。**

## 二、页面骨架

二级列表页必须使用统一页面骨架：

```vue
<template>
  <div class="yh-secondary-page" :style="{ paddingTop: contentTop + 'px' }">
    <PortalNavBar title="页面标题" :scroll-top="scrollTop" secondary />

    <div class="yh-secondary-content">
      <!-- yh-secondary-card / yh-secondary-row -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePageScroll } from '@tarojs/taro'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import { getSafeMenuButtonBoundingClientRect } from '@/utils'

const menuButtonInfo = getSafeMenuButtonBoundingClientRect()
// 导航栏高度为 menuButtonInfo.bottom + 8，首个底色卡片容器在此基础上再外加 8px 完美固定间隙，因此为 +16
const contentTop = menuButtonInfo.bottom + 16

const scrollTop = ref(0)
usePageScroll((res) => {
  scrollTop.value = res.scrollTop
})
</script>
```

## 三、强制视觉规则

- 背景：使用 `.yh-secondary-page`，统一实色背景 `@bg-color-blue-1`（Background Color Blue1，`#D6E8FE`），不使用页面背景渐变。
- 导航：必须使用 `PortalNavBar`，并传入 `secondary`，自动带返回和主页按键。
- 滚动导航：必须传 `:scroll-top="scrollTop"`；页面初始透明，滚动后出现蓝色渐变毛玻璃底。
- 内容容器：必须使用 `.yh-secondary-content`，作为大面积的浅蓝底色卡片容器（Figma Frame 89）。顶部圆角 `40px 40px 0 0`，背景为 `linear-gradient(180deg, var(--Background-Color-4, #F0F6FF) 0%, rgba(240, 246, 255, 0.00) 100%)`，左右内边距 24px，底内边距 `calc(100px + env(safe-area-inset-bottom))` (即 Figma 50px 优雅底隙 + 安全区)，子元素间距 (gap) 32px。具体与底部固定按钮区域的适配请参阅 [DESIGN.md](./DESIGN.md#41-移动端页面底部预留与安全区规范)。
- 卡片：必须使用 `.yh-secondary-card`，它已绑定最新全局标准卡片样式（冰羽蓝底色 #F9FCFF、2px 白色描边、32px 圆角、#E9F0FC 柔和微蓝阴影及 20px 磨砂模糊滤镜）。
- 行：必须使用 `.yh-secondary-row`，内置微信 button 洗白 and hairline 分割线。**分割线（hairline）采用全局统一对齐规范：若行内包含左侧图标 `.yh-secondary-row__icon`，分割线起点左缩进自动设为 `96px`（72px 图标宽度 + 24px 间距）以与正文文本左边缘完美对齐；若无左侧图标（如 `.no-icon`、键值行、输入框等），分割线起点为 `0`（通栏通底）。**
- **正文行字号与颜色规范**：
  - 非预约挂号流程的二级列表/表单列表页面，卡片内部主正文和键值行统一使用字号 **`15号/30px`**（Figma 1x 规格 `15px`），行高 **`42px`**，用于在信息密度与可读性之间保持平衡。
  - 预约挂号流程（`/pages/appointment/**`）保持原有较大字号 **`16号/32px`**（即 `@font-size-body-md`），不参与全局紧凑化覆盖。
  - 信息标签（Key）字色统一为灰色 `@text-color` (`#666666`)，具体内容值（Val）字色统一为主要深灰 `text/primary` 对应的 `@text-color-dark` (`#222222`)。
- **金额高亮规范**：
  - 凡是页面卡片中涉及“费用总额”、“费用合计”、“处方金额”、“开票总金额”等账单合计金额，其数值文本颜色必须全局统一强制渲染为 **品牌主色蓝**（`@blue`，`#3186ff`），以提示核心信息。
- **卡片内键值列表间隙与排版规范（结算缴费标准间隙）**：
  - 对于不带小标题的多行键值列表卡片（如结算缴费、住院记录、住院充值记录、开药记录、电子票夹等类似业务卡片主体），为了保持优雅的紧凑型纵向呼吸感，其内容容器（如 `&__body`）必须统一设置为 `gap: 0`。
  - 非预约挂号流程下，每一个键值信息行 `.info-row` 统一使用紧凑最小高度 **`36px`**（Figma 1x 规格 `18px`），上下内边距 **`2px 0`**。
  - 预约挂号流程仍保持原有最小高度 **`56px`**、上下内边距 **`8px 0`**。
- 左侧图标：必须使用 `.yh-secondary-row__icon`，尺寸 72×72，圆角 `@icon-corner-radius` = 16px。
- 右侧箭头：必须使用 `PortalRowArrow`，不得页面内重新画箭头。
- 双行列表：必须使用 `.yh-secondary-row.is-double`，行高、标题、副标题、图标 and 箭头尺寸全部来自全局样式。

## 四、标准行结构

### 4.0 标准底色内容容器 (Frame 89)

```vue
<div class="yh-secondary-content">
  <!-- 放入多个 yh-secondary-card 容器 -->
</div>
```

规则：

- `.yh-secondary-content` 承载了新的底色大卡片设计，背景从 `@bg-color-blue-2` 渐变到透明，顶部圆角为 `40px 40px 0 0`，将内部所有列表卡片包裹在一起。
- 它自动负责了 `gap: 32px` 间距和 `padding: 24px 24px calc(100px + env(safe-area-inset-bottom)) 24px` 的内缩（底内边距已全局兼容 Figma 50px 精美底隙 + 底部安全区），使得内部的卡片宽度完美自适应为 702px (Figma 351px) 并预留安全底隙。
- 内部的 `.yh-secondary-card` 作为独立小卡片，使用冰羽蓝底色 #F9FCFF、2px 白色描边、32px 圆角、#E9F0FC 微蓝底阴影与 20px 磨砂玻璃效果。

### 4.1 单行带图标

```vue
<button class="yh-secondary-row" type="button">
  <div class="yh-secondary-row__left">
    <span class="yh-secondary-row__icon">
      <img class="yh-secondary-row__icon-img" :src="icon" alt="" />
    </span>
    <span class="yh-secondary-row__text">单行带图标</span>
  </div>
  <PortalRowArrow />
</button>
```

### 4.2 双行带图标

全局尺寸：

| 项 | 代码值 |
|----|--------|
| 行最小高度 | 148px |
| 行上下 padding | 24px |
| 图标 | 72×72px |
| 标题 | 30px / 44px / `@font-weight-regular` |
| 副标题 | 24px / 36px / `@text-color` |
| 标题与副标题间距 | 2px |

```vue
<button class="yh-secondary-row is-double" type="button">
  <div class="yh-secondary-row__left">
    <span class="yh-secondary-row__icon">
      <img class="yh-secondary-row__icon-img" :src="icon" alt="" />
    </span>
    <div class="yh-secondary-row__info">
      <span class="yh-secondary-row__title">双行带图标</span>
      <span class="yh-secondary-row__sub">2023/06/09 17:20:06</span>
    </div>
  </div>
  <PortalRowArrow />
</button>
```

### 4.3 单行无图标

```vue
<button class="yh-secondary-row" type="button">
  <div class="yh-secondary-row__left">
    <span class="yh-secondary-row__text no-icon">单行显示</span>
  </div>
  <PortalRowArrow />
</button>
```

### 4.4 键值行

```vue
<div class="yh-secondary-row is-key-value">
  <span class="yh-secondary-row__key">列表</span>
  <span class="yh-secondary-row__val">加粗正文</span>
</div>
```

### 4.5 分组小标题

- 类名：`.yh-secondary-section-title`
- 规则：统一在 Less 中设置 `padding-left: 32px`，使文字对齐线与卡片内部内容的左对齐线保持完全一致（父容器内边距 `24px` + 自身 `padding-left: 32px` = `56px`）。
- 字号：26px，常规字重，行高 36px，颜色为 `@text-color-secondary`。
- 标准结构间距：当 `.yh-secondary-section-title` 后面紧跟 `PortalFormCard`、`.yh-secondary-card`、卡片列表容器或同等白色圆角卡片内容块时，小标题底部到下方卡片顶部的视觉间距必须统一为 **4px**，代码值为 **8px**（Figma 1x ×2）。这类结构不得直接吃到父级 `.yh-secondary-content` 的 `gap: 32px`，否则标题到卡片会被放大；实现时应对该内容容器关闭父级 gap 或建立同结构白名单规则，让“标题 + 下一块内容”为 `8px`，同时保留“卡片/内容块到下一个小标题或下一块内容”为 `32px`。
- 禁止事项：不得为了缩小标题到卡片的间距去改 `.yh-secondary-card` 内部 padding、卡片内部行距、卡片列表内部 gap、顶部导航栏、用户卡、Tab/Segment 或普通无小标题列表页的大结构间距。

```vue
<div class="yh-secondary-section-title">小标题文字</div>
```

### 4.6 hairline 分割线统一规范

为了保证列表项视觉节奏的连贯性与精美对齐，`.yh-secondary-row` 的 hairline 分割线（`::after` 伪元素）在全局样式中实现了自适应对齐设计：

1. **带左侧图标**（结构包含 `.yh-secondary-row__icon`，例如单行带图标、双行带图标等）：
   - **分割线起点自动缩进 `96px`**（图标宽度 `72px` + 间距 `24px` @2x），使其起始位置与上方文本内容的左边缘完全保持在同一条垂直对齐线上，实现极简与高度和谐的视觉节奏。
   - **实现机制**：全局样式中通过 `&:has(.yh-secondary-row__icon)` 及 `&.has-icon` 自动应用 `left: 96px`。
2. **无左侧图标**（包含 `.no-icon`、键值行 `is-key-value`、输入框行 `is-input` 等）：
   - **分割线通底（`left: 0`）**，在卡片内部横跨整宽，作为纯文字区域之间的分隔。
   - **实现机制**：默认 `left: 0`。
3. **末尾项隐藏**：
   - 无论是否带图标，卡片或列表容器中的最后一项（`:last-child`）的分割线必须自动隐藏，避免在卡片圆角底部出现露出的细线影响视觉美观。

## 五、禁止事项

- 禁止新建二级页面时手写页面背景、导航栏、卡片、列表行、右箭头。
- 禁止页面内自定义白底卡片视觉；二级列表页统一使用 `.yh-secondary-card`，普通卡片统一使用 `.yh-card`。
- 禁止页面内自定义双行列表行高、图标大小、标题/副标题字号；统一使用 `.yh-secondary-row.is-double`。
- 禁止使用 `GNavBar` 替代本门户二级页的 `PortalNavBar secondary`。
- 禁止把导航栏做成固定白底；必须保持初始透明、滚动后渐变毛玻璃。
- 禁止在列表行里使用未洗白的 `<button>` 默认样式。
- 禁止把圆角方形图标写成 `border-radius: 50%` 或 `32px`。

## 六、段选择器（Segment Switcher）

当列表页需要顶部分类切换时，使用统一的 Segment Switcher 样式。

视觉规格：

| 项 | 值 |
|----|----|
| 布局 | `display: grid; grid-template-columns: repeat(N, 1fr)` |
| 间距 | 16px |
| 行高 | 80px |
| 圆角 | 24px |
| 默认态 | 白底 + 品牌蓝文字 |
| 激活态 | 品牌蓝底 + 白色文字 + 底部三角指示器 |
| 字体 | 默认 `@font-regular` / 激活 `@font-medium` |

参考实现：`src/pages/message/index.less` `.message-page__segment`、`src/pages/user/index.less` `.profile-page__segment`。

### 6.2 页签切换底边与内容列表间隙规范 (Spacing Rule)

当页签切换条下方直接跟内容大卡片 `.yh-secondary-content` 时，必须强制执行全局统一的高度对齐规则，以防止过密或过旷：

1. **有小标题时**：保持底边与小标题的可视差距为 **`16px`** ($32\text{rpx}$，即 Figma 1x 规格 $8\text{px}$)。通常在 Less 中使用 `.yh-secondary-tab-bar + .yh-secondary-content { padding-top: 16px !important; }` 来自动达成。
2. **无小标题时**：页签底边与首个卡片顶边沿的可视垂直差距必须全局强制锁定在 **`40px`** ($80\text{rpx}$，即 Figma 1x 规格 $20\text{px}$)。
   - **吸顶/固定页签 (如 `PortalSegmentNav` + `scroll-view` 结构)**：页签下方固定预留 `8px` 间距，内容容器 `.yh-secondary-content` 的 `padding-top` **必须强制指定为 `32px !important;`** ($64\text{rpx}$)，即 $8\text{px} + 32\text{px} = 40\text{px}$。
   - **普通流页签 (如 `.yh-inline-segment` 结构)**：页签下方包裹 `.yh-user-card-segment-content`（顶内补白 `16px`），内部内容容器 `.yh-secondary-content` 保持默认 `padding-top: 24px`，即 $16\text{px} + 24\text{px} = 40\text{px}$。


## 六.A 医疗项目二级列表页标准规范（强制执行）

### 1. 适用范围
本规范适用于所有 **Secondary Sticky Segment Page（二级页 + 吸顶 Tab 页）**，包括但不限于以下业务页面：
- 门诊取号
- 结算缴费
- 检查检验开单
- 检验报告
- 检查报告
- 我的预约
- 我的挂号
- 就诊记录
- 住院服务
- 医保服务
以及任何组合使用 `PortalNavBar` + 顶部用户卡 + `Tab/Segment切换` + 列表内容区域的二级页面。

### 2. 页面结构规范
页面结构顺序必须严格遵循以下**固定顺序（禁止调整顺序）**：
```text
PortalNavBar  ➔  PortalUserCard  ➔  SegmentNav(Tab)  ➔  List Content
```

### 3. Segment 吸顶规范
如果页面存在 `activeTab`、`PortalSegmentNav` 或 `yh-inline-segment` 中的任何分类切换页签，则默认必须支持吸顶。
所有页面**禁止自定义手写吸顶**，必须复用全局公共定位结构：
```vue
<div
  class="yh-secondary-tab-sticky-wrap"
  :style="{ top: menuButtonInfo.bottom + 8 + 'px' }"
>
  <PortalSegmentNav ... />
</div>
```

### 4. 毛玻璃渐变规范
所有吸顶 Segment 页面默认必须复用全局 `.yh-secondary-page--sticky-segment-glass` 类，统一覆盖 `.portal-nav-bar__gradient.is-secondary` 样式，拉伸渐变高度至 `340px`，并将强黑渐变阈值精准延后至 `82%`。
**禁止在单个业务页面中重复书写、覆盖或微调遮罩层样式。**

### 5. 新建页面自动执行规则
当 AI 在后续创建或开发符合上述多项组合的全新二级列表页时，**必须无条件且自动地**应用：
- 根容器类名添加：`class="yh-secondary-page yh-secondary-page--sticky-segment-glass"`
- 生成粘性吸顶包裹层：`yh-secondary-tab-sticky-wrap`，并与 `menuButtonInfo` 高度绑定。

### 6. 禁止事项
- 禁止每个页面单独手写 gradient 样式；
- 禁止每个页面各自手写 sticky 吸顶逻辑与 top 高度偏移；
- 禁止每个页面单独调整 mask-image 渐变区间；
- 禁止页面内自行调整 PortalNavBar 渐变遮罩高度。


## 七、页面实例

| 页面 | 路由 | 说明 |
|------|------|------|
| 通用二级表单页面 | `pages/common-list/index` | 规范参考页，含四种行变体 |
| 消息中心 | `pages/message/index` | 带 Segment + Tabbar 的二级列表 |
| 个人中心服务列表 | `pages/user/index` | 带 Segment 的服务管理列表 |
