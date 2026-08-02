# Decap CMS 启用说明

阶段 4 已完成内容后台页面、字段模型和 GitHub 工作流配置。后台入口为 `/admin/`。

## 当前能力

- 新增、编辑产品知识内容。
- 修改团队成员资料。
- 修改网站基础资料和合规提示。
- 上传图片到 GitHub 仓库。
- 使用 Editorial Workflow 创建内容分支和审核流程。
- 内容提交后由 Cloudflare Pages 自动构建。

## 启用 GitHub 登录前的必要步骤

Decap CMS 的 GitHub 后端需要 OAuth 服务。官方推荐使用独立的边缘代理，因此规划使用：

`https://auth.fangzhongda.com`

1. 在 GitHub Developer Settings 创建 OAuth App。
2. Homepage URL 设置为 `https://auth.fangzhongda.com`。
3. Authorization callback URL 设置为 `https://auth.fangzhongda.com/callback`。
4. 在 Cloudflare 部署 Decap 官方文档链接的 OAuth Proxy Worker。
5. 将 GitHub OAuth Client ID 与 Client Secret 作为 Worker Secrets 保存，禁止写入仓库。
6. 将 `auth.fangzhongda.com` 绑定到该 Worker。
7. 合并本分支后，通过 `https://www.fangzhongda.com/admin/` 登录测试。

## 权限边界

- 只有拥有 `gogol0212/cola` 仓库写入权限的 GitHub 用户可以使用后台提交内容。
- CMS 默认写入 `main`，并使用 Editorial Workflow 生成内容分支和审核记录。
- 产品 `status` 字段分为草稿、已审核和已发布；展示层在阶段 3 中只输出 `published` 内容。
- GitHub OAuth Secret 与 Cloudflare API Token 不得提交到 GitHub。

## 阶段依赖

产品内容字段已经建立，但阶段 3 的统一产品页面尚未实施。当前友童行内容仅作为迁移种子，后台可编辑；正式产品详情展示仍需阶段 3 完成。
