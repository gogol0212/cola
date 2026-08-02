# 阶段 4：Decap CMS 启用说明

后台入口为 `/admin/`。代码侧已完成产品、需求标签、团队、网站设置、图片上传、审核流程和统一产品模板字段。

## 编辑能力

- 新增和修改产品，选择“健康 / 长期规划 / 财富管理”及具体需求标签。
- 编辑客户痛点、产品优势、保障内容、案例、比较表、FAQ 和咨询区。
- 修改团队成员和网站资料，上传图片到 GitHub。
- 使用 Editorial Workflow 保存草稿、审核并发布到 `main`；Cloudflare Pages 自动构建。

## 首次启用登录（账户所有者完成一次）

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App。
2. Homepage URL：`https://auth.fangzhongda.com`。
3. Authorization callback URL：`https://auth.fangzhongda.com/callback`。
4. 在 Cloudflare 创建 Worker，代码使用仓库 `cms-auth/`。
5. 添加加密 Secret：`GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`、`OAUTH_STATE_SECRET`。
6. 将 `auth.fangzhongda.com` 绑定到 Worker。
7. 打开 `https://www.fangzhongda.com/admin/`，测试新增草稿、预览和发布。

Client Secret 和 OAuth state secret 禁止提交到 GitHub。敏感值必须保存为 Cloudflare Worker Secret。

## 发布规则

- `draft`：网站不显示。
- `reviewed`：预览分支展示，便于审核。
- `published`：正式发布。
- 只有拥有 `gogol0212/cola` 写入权限的 GitHub 用户可以提交内容。
