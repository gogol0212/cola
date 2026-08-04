---
description: 检查本 Astro 站点的 SEO 基础项（sitemap、robots、meta/canonical、标题、图片 alt 与性能）
agent: build
---

对当前 Astro 项目做一次 SEO 检查，不要修改任何文件，只输出报告。按以下清单逐一核对并给出问题与修复建议：

1. **sitemap 与 robots**：`public/sitemap.xml` 是否覆盖全部页面（`src/pages` 下所有路由，含 404 除外）；`public/robots.txt` 是否允许搜索引擎、并指向 sitemap。
2. **每页 meta**：`src/layouts/BaseLayout.astro` 及每个 `.astro` 页面是否设置了 `title`、`description`、canonical URL、Open Graph、twitter card。
3. **标题层级**：每个页面是否只有一个 `<h1>`，且标题层级无跳跃（h1→h2→h3）。
4. **图片**：页面中的图片是否都有 `alt`；体积较大的图片（>200KB）是否建议转 WebP/AVIF 或压缩。
5. **性能**：检查是否使用 `@astrojs/image` 或 `astro:assets` 做响应式图片；`_headers` 的缓存策略是否合理（`/assets/*` 应 immutable）。
6. **结构化数据**：是否包含 `application/ld+json`（如 Organization、Person、FAQPage）。
7. **规范约束**：确认没有违反 `docs/AIA-BRAND-GUIDELINES.md` 的配色与品牌规则。

输出为 markdown 报告：按「通过 / 问题」分类列出，问题给出具体文件路径、行号与修复建议。
