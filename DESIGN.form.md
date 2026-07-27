# DESIGN.form.md — 表单规范

> 750px @2x：Figma 1x 标注 ×2 写入 Less。全局 token 来自 `src/assets/less/variables.less`。

## 一、适用范围

- 编辑信息、地址、协议、实名资料、筛选/设置类表单。
- 二级表单列表页还必须遵守 `DESIGN.list.md`。

## 二、页面骨架

- 顶部：`PortalNavBar title="..." :scroll-top="scrollTop" secondary`。
- 页面根：优先使用 `.yh-secondary-page`。
- 内容容器：`.yh-secondary-content`，自带底内边距 `100px` (Figma 50px) 确保普通内容区域底部间距。
- 多卡片结果列表：统一用 `.yh-secondary-list-stack`，卡片上下间距为 `24px` (Figma 12px)，不要页面局部写 `margin-bottom`。
- 自定义业务卡片内部：统一用 `.yh-secondary-card-flow` + `.yh-secondary-card-flow__divider`，标题、说明、表格、按钮之间的纵向间距保持 `24px` (Figma 12px)。
- 表单卡片：普通白底卡片用 `.yh-card`；二级列表式表单推荐直接使用 **`<PortalFormCard>`** 全局组件（或 Class `.yh-secondary-card`）。
- 底部主操作：`FixedBottom` + `.eux-btn.eux-btn--primary`。

## 三、表单卡片与行组件

| 项 | 规则 |
|----|------|
| 背景 | 冰羽蓝白 `#F9FCFF` (普通白底卡片用 `@card-bg`) |
| 圆角 | `32px` (Figma 1x 16px × 2) |
| 描边 | `2px` 实白 `#ffffff` (Figma 1x 1px × 2) |
| 阴影 | 柔和微蓝阴影 `0 4px 20px 0 #E9F0FC` (Figma 1x 0 2px 10px 0) |
| 磨砂毛玻璃 | `backdrop-filter: blur(20px)` (Figma 1x blur(10px)) |
| 卡片组件 | **`<PortalFormCard>`** (推荐，映射 `.yh-secondary-card`) |
| 行字段组件 | **`<PortalFormRow>`** (推荐，映射 `.yh-secondary-row`，支持 input, key-value, select 类型) |
| 普通卡片类 | `.yh-card` |
| 二级列表卡片类 | `.yh-secondary-card` |

禁止页面内重新硬编码卡片 `background`、`border-radius`、`box-shadow`、`border`。

## 四、表单项

| 项 | 代码值 | 说明 |
|----|--------|------|
| 单行最小高度 | 108px | Figma 54px ×2 |
| 上下 padding | 20px | Figma 10px ×2 |
| label 默认宽 | 180px | 同一卡片取最长 label 对齐 |
| label 字号 | `@font-size-body-md` | 32px |
| value/input 字号 | `@font-size-body-md` | 32px |
| 副文本字号 | `@font-size-body-sm` | 28px |
| 分割线 | hairline | `@border-color-light` |

label 宽度参考：

| label 字数 | 推荐宽度 |
|------------|----------|
| 2 字 | 128px |
| 3 字 | 160px |
| 4 字 | 192px |
| 5 字 | 224px |

### 4.1 展示型键值列表行特别规范 (结算缴费标准间隙)

对于只读/展示型卡片内部的多行键值列表（如结算缴费、住院记录、住院充值、开药记录、电子票夹等非编辑表单页的卡片内部结构），为了保持优雅的紧凑型纵向呼吸感，必须强制遵循以下规范：
- **容器间距**：内容容器（如 `&__body` 或列表容器）必须设为 `gap: 0`。
- **单行尺寸**：每一行（如 `.info-row`）最小高度强制设为 **`56px`** (Figma 1x 28px)，上下 padding 设为 **`8px 0`** (Figma 1x 4px)。
- **字号标准**：正文字号统一为 `@font-size-body-md` (32px/16号)，标签字色为次级灰 `@text-color`，内容值字色为主要深灰 `@text-color-dark`。

## 五、字段类型

- 文本输入：无边框、透明背景，placeholder 使用 `@text-color-secondary`。
- 选择器/跳转：整行点击，右侧统一用全局箭头或 `PortalRowArrow`。
- 日期选择：格式统一 `YYYY年MM月DD日`。
- 多行文本：`line-height: @line-height-body-md`，高度按设计 ×2。
- 数字输入：使用数字键盘；需要步进时放右侧控件。
- 必填：红色星号使用 `@danger-color`。

## 六、状态

| 状态 | 规则 |
|------|------|
| 错误 | label/input/error text 使用 `@danger-color` |
| 成功 | 可选，使用 `@success-color` |
| 禁用 | 文本使用 `@text-color-secondary`，禁用点击 |
| 只读 | 保持普通文字色，不显示输入态光标 |

错误提示：字号 `@font-size-caption`，行高 `@line-height-caption`。

## 七、上传与搜索

- 图片上传：默认 200×200px，圆角 16px，虚线边框 `@arrow-color`。
- 文件上传：显示文件名 + 大小 + 删除，上传进度使用细进度条。
- 搜索栏：高 72px，圆角 36px，背景 `@border-color`，图标 36×36px。

## 八、组件推荐用法 (PortalFormCard & PortalFormRow)

后续开发新的表单页或列表页时，推荐直接使用组件化方式，能大幅减少冗余的 HTML 标记：

```vue
<template>
  <div class="yh-secondary-page" :style="{ paddingTop: contentTop + 'px' }">
    <PortalNavBar title="表单页面" :scroll-top="scrollTop" secondary />

    <div class="yh-secondary-content">
      <PortalFormCard>
        <!-- 文本输入行 -->
        <PortalFormRow
          v-model="username"
          label="姓名"
          placeholder="请输入真实姓名"
        />

        <!-- 只读/禁用输入行 -->
        <PortalFormRow
          v-model="idCard"
          label="身份证号"
          disabled
          placeholder="暂无身份证信息"
        />

        <!-- 选择器/跳转行 -->
        <PortalFormRow
          type="select"
          label="所属医院"
          value="智慧医院"
          show-arrow
          @click="selectHospital"
        />

        <!-- 展示型键值行 -->
        <PortalFormRow
          type="key-value"
          label="创建日期"
          value="2023-06-09"
        />
      </PortalFormCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PortalNavBar from '@/components/PortalNavBar/index.vue'
import PortalFormCard from '@/components/PortalFormCard/index.vue'
import PortalFormRow from '@/components/PortalFormRow/index.vue'

// 正常使用 v-model 进行绑定
const username = ref('')
const idCard = ref('350100******1234')

const selectHospital = () => {
  // 处理选择逻辑
}
</script>
```
## 九、分组小标题

- 类名：`.yh-secondary-section-title`
- 规则：统一在 Less 中设置 `padding-left: 32px`，使文字对齐线与卡片内部内容的左对齐线保持完全一致（父容器内边距 `24px` + 自身 `padding-left: 32px` = `56px`）。
- 字号：26px，常规字重，行高 36px，颜色为 `@text-color-secondary`。

```vue
<div class="yh-secondary-section-title">小标题文字</div>
```

## 十、禁止事项

- 禁止使用未洗白的 `<button>` 做表单行。
- 禁止页面内新写弹窗、选择器、底部操作区；优先使用 Vant/全局封装。
- 禁止单个页面随意改 label 宽度、分割线厚度、卡片圆角。
- 禁止硬编码色值、字号、字重、行高。

---

主规范：[DESIGN.md](./DESIGN.md)；二级列表规范：[DESIGN.list.md](./DESIGN.list.md)
