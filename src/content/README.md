# 更新主页内容

- 编辑 `news.json` 更新 News，按时间从新到旧排列。
- 编辑 `publications.json` 更新 Publications，使用 `#` 表示暂时没有链接。
- 修改完成后提交并推送到 `main` 分支；GitHub Actions 会自动构建并发布到 `gh-pages`。

```bash
git add src/content
git commit -m "Update profile content"
git push origin main
```
