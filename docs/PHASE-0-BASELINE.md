# 阶段 0：迁移基线

- 规范主域名：`https://www.fangzhongda.com/`
- 主仓库：`gogol0212/cola`
- 生产分支：`main`（本次工作位于 `architecture/phase-0-1`）
- 原始首页：保存在 `legacy/index.html`
- 现有产品站：`https://aia.fangzhongda.com/`，暂不切换或删除
- 回退策略：Cloudflare Pages 回滚至改造前生产部署，或将生产分支恢复到改造前提交

## 已核验部署

- `www.fangzhongda.com` CNAME 指向 `cola-dr4.pages.dev`
- `aia.fangzhongda.com` CNAME 指向 `aia-84f.pages.dev`
- 两个站点均返回 Cloudflare Pages 静态资源响应

## 阶段 1 边界

- 建立 Astro 静态构建、基础组件、设计令牌、SEO、404、响应头和稳定路由
- 保留既有人物与品牌图片
- 不切换 DNS，不修改 Cloudflare 生产项目，不安装 CMS
- `aia.fangzhongda.com` 到产品知识库的重定向留到友童行迁移验收后执行
