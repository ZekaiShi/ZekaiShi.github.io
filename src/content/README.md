# 更新主页内容

- 编辑 `news.json` 更新 News，按时间从新到旧排列。
- 编辑 `publications.json` 更新 Publications，使用 `#` 表示暂时没有链接。
- 修改完成后提交并推送到 `main` 分支；GitHub Actions 会自动构建并发布到 `gh-pages`。

## 界面与研究信息

- `profile.js`：中英文简介、界面文案、社交链接及研究方向面板。
- `../index.css`：日间／夜间配色变量、液态玻璃材质、动效和响应式布局。
- `../components/GlassSurface.jsx`：共用透明玻璃、边缘折射高光和指针光泽。底色／模糊／折射合并为单个材质层，光斑、边缘和前景鼠标反光共用扩展绘制区域及动态轮廓。文字不参与局部折射扭曲；导航和底部控制条的磨砂同样跟随液体边界。
- `../hooks/useGlassRefraction.js`：复用轮廓的低分辨率距离场与画布，仅当轮廓或局部透镜改变时更新位移图；`../lib/glassRefraction.js` 从当前边界法线生成折射，包含鼓包、液颈和分离水滴，不再残留旧矩形透镜。独立水滴使用较细采样；融合后保留跟随鼠标的凸面折射，进入卡片深处也不关闭。
- `../components/LiquidCursor.jsx`：与卡片共用材质的水滴光标和近边缘磁吸；细指针设备启用，键盘、触摸、减少动效或增强对比度时恢复原生光标。
- `../lib/liquidSurface.js`：圆角卡片与水滴的共享距离场，生成单一连续外轮廓。卡片向外鼓起、液颈收窄和断开、进入后吸收都由几何形状变化完成，不叠加独立的圆圈。
- `../lib/surfaceTension.js`：表面张力的弹簧状态和连接／分离迟滞；离开后卡片边缘先回缩再稳定。只改变材质轮廓，文字和点击区域不参与局部扭曲。
- `../lib/glassMaterial.js`：静止、靠近、融合与分离共用同一套材质及柔和渐变边缘，同步提交轮廓、裁切与折射贴图，不按距离切换白色描边；绘制范围包含分离水滴，拒绝被裁切的开放轮廓。不得重新添加固定矩形的填色、伪元素光斑或阴影。
- `.glass-pointer-relief`：独立、接近、融合状态共用非封闭的弧面反光和底部暗面；融合后跟随实际鼠标位置，并补偿卡片的悬浮缩放。反光也受共享轮廓裁切，靠近边缘时不溢出，不叠加独立的白圈。
- `../hooks/useSurfaceSpring.js`：卡片悬浮微缩放和按压回弹；`../lib/liquidPhysics.js` 集中管理弹簧与接触几何。
- `../hooks/usePreferences.js`：白天／黑夜／跟随系统、语言与动效偏好；兼容旧的 retro/modern 主题记录。

论文缺少代码或项目链接时，对应入口会自动隐藏；DOI 链接显示为 DOI / IEEE。
不支持背景模糊的浏览器会使用实色面板；系统减少动态效果设置会关闭动画。
边缘采用 SVG displacement + backdrop-filter；支持情况因浏览器而异，不支持 SVG 背景滤镜时保留基础透明玻璃与高光。
运行 `node --test tests/liquidPhysics.test.mjs` 检查折射、磁吸边界、轮廓融合／分离、圆角和弹簧回弹。
研究图形是示意图，不显示虚构的实时推理状态、训练进度或研究指标。

```bash
git add src/content
git commit -m "Update profile content"
git push origin main
```
