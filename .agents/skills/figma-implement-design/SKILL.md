---
name: figma-implement-design
description: Ensure pixel-perfect 1:1 visual parity and design system token usage when implementing Figma designs into front-end code. Use Figma MCP to extract layout, colors, fonts, margins, and border-radii directly from nodes.
---

# Figma 还原度约束规范 (figma-implement-design)

本 Skill 旨在确保在将 Figma 设计稿转化为前端代码时，达到 1:1 的高精度视觉还原，规范取数，并正确应用设计系统中的 Token 和资产。

## 核心要求与指导原则

### 1. Figma MCP 数据提取 (不靠猜测尺寸)
* **不要猜测尺寸**：严禁通过截图或目测猜测组件的间距、高度、字号或颜色。
* **使用 Figma MCP 工具**：直接从 Figma 节点中读取以下精确数据：
  * **布局与定位**：Flexbox (Auto Layout) 属性、外边距 (Margin)、内边距 (Padding)、宽高 (Width/Height)。
  * **视觉属性**：填充颜色 (Fill Color)、边框 (Border)、阴影 (Box Shadow)、圆角半径 (Border Radius)。
  * **排版字体**：字号 (Font Size)、字重 (Font Weight)、行高 (Line Height)、字体家族 (Font Family)。

### 2. 1:1 视觉高保真还原
* **视觉一致性**：最终渲染出来的页面代码，应在各种设备尺寸上尽量贴近设计稿。
* **像素级精确 (Pixel-Perfect)**：间距、对齐、元素大小需严格按照设计稿规范实现。

### 3. 正确使用 Design Tokens (设计系统变量)
* **优先使用 Token**：在编写 CSS 时，不要直接硬编码 (Hardcode) 颜色或字号。
* **设计系统变量映射**：
  * 优先使用项目预定义的 Less/CSS 变量（例如 `variables.less` 中定义的全局变量）。
  * 将 Figma 中的颜色/字体样式正确映射为项目中的组件变量或全局 Token。

### 4. 规范导出 Assets
* **资源处理**：图片、图标和 SVG 矢量图形必须直接从 Figma 设计源导出。
* **防失真**：图标类优先使用 SVG 格式，确保高清不失真，并统一存放在项目的静态资源目录中。

### 5. 严格遵守项目约定
* 遵循现有的前端工程结构和组件规范。
* 使用合理的组件拆分逻辑，确保组件是高内聚、低耦合、可复用的。

### 6. 实现检查与迭代修正
* **对比修正**：实现完成后，必须对比最终效果图/截图与 Figma 原设计稿，发现视觉偏差后立即迭代修正。
