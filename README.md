# 方仲达个人品牌与保险知识平台

基于 Astro 的静态网站，由 GitHub 与 Cloudflare Pages 自动构建。

运行环境使用 Node.js 24，并由仓库根目录的 `.node-version` 固定。

## 本地开发

```sh
npm install
npm run dev
```

## 生产构建

```sh
npm run build
```

Cloudflare Pages 构建命令为 `npm run build`，输出目录为 `dist`。

旧版单页完整保存在 `legacy/index.html`，用于迁移对照与回退。
