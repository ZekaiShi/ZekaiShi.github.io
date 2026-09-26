# 更新主页内容

- 编辑 `news.json` 更新 News，按时间从新到旧排列。
- 编辑 `publications.json` 更新 Publications，使用 `#` 表示暂时没有链接。
- 修改完成后提交并推送到 `main` 分支；GitHub Actions 会自动构建并发布到 `gh-pages`。

## 界面与研究信息

- `profile.js`：中英文简介、界面文案、社交链接及研究方向面板。
- `../index.css`：日间／夜间配色变量、液态玻璃材质、动效和响应式布局。
- `../components/GlassSurface.jsx`：共用磨砂玻璃、边缘高光和指针光泽。内容文字不随光效移动。
- `../hooks/usePreferences.js`：白天／黑夜／跟随系统、语言与动效偏好；兼容旧的 retro/modern 主题记录。

论文缺少代码或项目链接时，对应入口会自动隐藏；DOI 链接显示为 DOI / IEEE。
不支持背景模糊的浏览器会使用实色面板；系统减少动态效果设置会关闭动画。
研究图形是示意图，不显示虚构的实时推理状态、训练进度或研究指标。

```bash
git add src/content
git commit -m "Update profile content"
git push origin main
```
