# GitHub Pages 自动部署说明 ✅

以下步骤会帮助你通过 GitHub Actions 自动把本仓库的 Vite 构建产物部署到 GitHub Pages（地址为 `https://<OWNER>.github.io/<REPOSITORY>/`）。

## 已做的自动化工作 🔧

- 已添加 GitHub Actions Workflow：`.github/workflows/deploy-pages.yml`。
  - 触发条件：`push` 到 `main` 分支 或 手动触发（`workflow_dispatch`）。
  - 功能：安装依赖、运行 `npm run build -- --base /<repo>/`（自动使用仓库名作为 base）、上传 `dist/` 并调用 `actions/deploy-pages` 发布到 Pages。

## 如何发布（两种方式）

1) 自动：推送到 `main`
- 直接把变更推送到 `main` 分支（例如 `git push origin main`），Action 会自动运行并在成功后部署。

2) 手动触发：
- 进入仓库的 GitHub 页面 → Actions → 选择 `Deploy to GitHub Pages` workflow → Click `Run workflow`。

## 验证部署

- 在 Actions 中检查 workflow 日志，确保 `Upload artifact for GitHub Pages` 与 `Deploy to GitHub Pages` 步骤都成功。
- 等待几分钟后访问：
  `https://<OWNER>.github.io/<REPOSITORY>/`（将 `<OWNER>` 和 `<REPOSITORY>` 替换为你的仓库信息）。
- 也可以在仓库 Settings → Pages 查看当前发布状态和 URL。

## 本地构建注意事项

- 要在本地构建并保证资源路径正确（仓库子路径情形），使用：

  ```bash
  npm run build -- --base /<REPOSITORY>/
  ```

  举例：如果仓库名为 `LGBT-dapp`，则 `--base /LGBT-dapp/`。

## 自定义域名（可选）

- 若使用自定义域名，请把域名添加到仓库 Settings → Pages → Custom domain，并在仓库根目录添加 `CNAME` 文件或在 GitHub Pages 设置中填写。确保 DNS A / CNAME 记录指向 GitHub Pages。

## 故障排查小贴士 ⚠️

- 如果页面 404：确认 `--base` 正确或确认访问的 URL 是否包含仓库名。
- 如果 Actions 失败：查看控制台日志中失败步骤的详细输出，常见原因是依赖安装失败或构建错误。

---

如果你愿意，我可以现在把这些更改提交并推送到 `main`。想让我现在提交吗？