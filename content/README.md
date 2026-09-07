# 更新主页内容

以后只需要编辑这两个文件：

- `news.json`：News / 最新动态，按时间从新到旧排列。
- `publications.json`：Publications / 出版物。

保存后提交并推送：

```bash
git add content
git commit -m "Update news and publications"
git push origin gh-pages
```

主页会在加载时读取 JSON 数据。GitHub Pages 通常需要几分钟完成缓存刷新；如果仍看到旧内容，请使用 `Ctrl + F5`。
