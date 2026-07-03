# 福州中医院服务入口 Banner

## 文件

- `index.html`：静态 banner 结构
- `styles.css`：按 Figma 原始尺寸 `2160×800` 等比实现
- `src/`：Remotion 版本的 5 秒视频 composition
- `public/assets/`：Remotion 使用的静态资源
- `assets/`：从 Figma 节点导出的 SVG 服务图标、PNG 院内制剂图标和 JPG 小程序码
- `verification/figma-reference.png`：Figma 节点参考截图

## 说明

- 当前版本已实现 5 秒轻量循环动效。
- 时间线：四个服务入口依次播放内部小动效；在线问诊为 SVG 内部聊天点依次跳动，续方申请为处方单轻微上浮和横线淡入，预约挂号为日历轻翻页和 “+” 轻亮，院内制剂为药包/制剂盒图标轻点亮。
- 二维码本体不旋转、不变形，只做外框轻描边和小程序角标轻微放大。
- 底部提示条保留柔和流光从左到右扫过。
- 动效使用 CSS animation 与 SVG/图片叠加层实现，未引入第三方依赖，也没有 hover 态。
- 已支持 `prefers-reduced-motion: reduce`，系统减少动态效果时会关闭循环动画。
- DOM 动效层包括：`.prescription-paper-overlay`、`.calendar-plus-flash`、`.preparation-soft-light`、`.qr-outline`、`.mini-program-badge`、`.bar-shine`；问诊图标的聊天点动画写在 `assets/icon-consult.svg` 内部，连接线层已保留在结构中但默认隐藏。

## Remotion

- 已安装 Remotion、React、TypeScript 和 Remotion CLI。
- 预览 Studio：`npm run remotion:studio`
- 单帧检查：`npm run remotion:still`
- 导出视频：`npm run remotion:render`
- Composition ID：`FuzhouHospitalBanner`
- 尺寸与时长：`2160×800`，`30fps`，`150 frames`，总时长 `5s`

Remotion 版本遵循视频渲染规则：不使用 CSS animation，所有动效通过 `useCurrentFrame()` 和 `interpolate()` 按帧驱动。
