# Decap CMS GitHub OAuth Worker

为 `/admin/` 提供 GitHub 登录代理。部署前在 Cloudflare 中设置三个加密 Secret：`GITHUB_CLIENT_ID`、`GITHUB_CLIENT_SECRET`、`OAUTH_STATE_SECRET`。部署后将自定义域 `auth.fangzhongda.com` 绑定到 Worker；GitHub OAuth App 回调地址必须为 `https://auth.fangzhongda.com/callback`。
