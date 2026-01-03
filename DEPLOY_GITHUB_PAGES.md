# GitHub Pages 自动部署说明 ✅

以下步骤会帮助你通过 GitHub Actions 自动把本仓库的 Vite 构建产物部署到 GitHub Pages（地址为 `https://<OWNER>.github.io/<REPOSITORY>/`）。

## 已做的自动化工作 🔧

- 已添加 GitHub Actions Workflow：`.github/workflows/deploy-pages.yml`。
  - 触发条件：`push` 到 `main` 分支 或 手动触发（`workflow_dispatch`）。
  - 功能：安装依赖、运行 `npm run build -- --base /<repo>/`（自动使用仓库名作为 base），并使用 `peaceiris/actions-gh-pages@v4` 将 `dist/` 内容发布到 `gh-pages` 分支（原因见下）。

## 如何发布（两种方式）

1) 自动：推送到 `main`
- 直接把变更推送到 `main` 分支（例如 `git push origin main`），Action 会自动运行并在成功后部署。

2) 手动触发：
- 进入仓库的 GitHub 页面 → Actions → 选择 `Deploy to GitHub Pages` workflow → Click `Run workflow`。

## 验证部署

- 在 Actions 中检查 workflow 日志，确保 `Build (Vite)` 与 `Deploy to gh-pages branch (peaceiris)` 步骤都成功。
- 等待几分钟后访问：
  `https://<OWNER>.github.io/<REPOSITORY>/`（将 `<OWNER>` 和 `<REPOSITORY>` 替换为你的仓库信息）。
- 当前 workflow 已改为直接把构建产物复制到 `main` 分支的 `docs/` 目录并提交（commit 消息包含 `[skip ci]`，避免触发循环）。
- 如果 `docs/` 无法成功提交（或 push 返回权限错误），请在仓库 Settings → Secrets → Actions 新增一个具有写 repo 权限的个人访问令牌（PAT），命名为 `GH_PAGES_PAT`，Workflow 会使用它来推送 `docs/` 到 `main`。  
- 请在仓库 **Settings → Pages** 中把 Source 更改为：**Branch: main** / **Folder: /docs**（Root），保存后等待几分钟生效。
- 也可以在仓库 Settings → Pages 查看当前发布状态和 URL。

## 本地构建注意事项

- 要在本地构建并保证资源路径正确（仓库子路径情形），使用：

  ```bash
  npm run build -- --base /<REPOSITORY>/
  ```

  举例：如果仓库名为 `LGBT-dapp`，则 `--base /LGBT-dapp/`。

## 自定义域名（可选）

- 若使用自定义域名，请把域名添加到仓库 Settings → Pages → Custom domain，并在仓库根目录添加 `CNAME` 文件或在 GitHub Pages 设置中填写。确保 DNS A / CNAME 记录指向 GitHub Pages。

## 修复说明（关于出错）

- 错误原因：GitHub Actions 报错提示内部使用了已弃用的 `actions/upload-artifact@v3`，这是 `actions/upload-pages-artifact` 或其它动作的内部依赖造成的兼容性问题；因此工作流自动中止。
- 额外问题：工作流中使用了 `npm ci`，但本仓库没有 `package-lock.json`，导致 `npm ci` 失败并中止流程。
- 解决方案：我已把 workflow 改为使用 `peaceiris/actions-gh-pages@v4` 将构建产物推送到 `gh-pages` 分支；同时把安装命令从 `npm ci` 改为 `npm install --no-audit --no-fund` 以适应没有 lockfile 的仓库环境。

---
