# Cloudflare 内容保护与防盗配置建议

本文档为线上部署（Cloudflare）建议配置，用于降低内容批量盗用、图片盗链与异常爬虫成本，同时不影响正常用户浏览体验。

> 注意：这些是站点部署层的建议，需在 Cloudflare 控制台按需开启。与 `public/robots.txt`、`public/_headers` 配合使用。

## 1. Hotlink Protection（图片防盗链）

场景：防止其他网站直接引用本站图片，节省带宽并减少图片被移植使用。

配置（在 Cloudflare 控制台 → **Scrape Shield** → **Hotlink Protection**）：

- 开启 Hotlink Protection
- Allowed hostnames 填当前站点域名（如 `fangzhongda.com` 与 `www.fangzhongda.com`），可按需加入微信等允许引用的域名
- 不要对 `/assets/images/uploads/`（后台上传的二维码等）设置过于严格的规则，避免正常站内引用失效

建议用防火墙规则做更精细控制（见下文规则 2），因为 Hotlink Protection 只按 Referer 判断，空 Referer 会被放行。

## 2. Rate Limiting（异常高频访问限流）

场景：抓取工具或爬虫高频请求拖垮源站。

建议规则（Cloudflare 控制台 → **Security** → **Rate limiting**）：

| 规则名 | 匹配 | 阈值 | 动作 |
|--------|------|------|------|
| 防采集限流 | 任意 URI，同 IP 高频 | 1 分钟内超过 60 次页面请求 | Block / Challenge |
| 静态资源限流 | `/assets/*` 同 IP 高频 | 1 分钟内超过 300 次 | Challenge |

- 阈值不要设太低，避免影响正常用户的多次刷新与移动网络出口共享 IP
- 对验证码验证成功的用户可放行，降低误伤

## 3. 明显爬虫 User-Agent 设置 Challenge

场景：批量采集工具 UA 已知，直接给 Challenge（JS 质询）即可拦截。

Cloudflare 控制台 → **Security** → **WAF** → **Custom rules**：

```
Rule: Known scraper bots
Expression: (http.user_agent contains "MJ12bot") or (http.user_agent contains "SemrushBot")
  or (http.user_agent contains "AhrefsBot") or (http.user_agent contains "DotBot")
  or (http.user_agent contains "Bytespider") or (http.user_agent contains "PetalBot")
  or (http.user_agent contains "DataForSeoBot") or (http.user_agent contains "YisouSpider")
  or (http.user_agent contains "serpstatbot") or (http.user_agent contains "Barkrowler")
Action: Managed Challenge
```

与 `robots.txt` 的 Disallow 配合（robots 只约束遵守规则的爬虫，Challenge 兜底不遵守的）。

## 4. 海外异常流量更严格规则

场景：目标用户主要在中国大陆，海外异常流量可收紧，但不要影响正常海外用户与微信等渠道。

建议规则：

```
Rule: Suspected overseas scraping
Expression: (not cf.country in {"CN" "HK" "MO" "TW"} and http.user_agent missing "")
  and not (http.request.uri.path starts with "/assets/")
Action: Managed Challenge
```

- 不要对所有非中国流量直接 Block，使用 Challenge（JS 质询）更温和
- 保留 `/assets/` 放行，避免图片正常加载被误拦

## 5. 一般防护建议

- 开启 **Under Attack Mode**（仅在有明显攻击时临时使用，不要常开）
- 开启 **Security Level**: Medium
- 开启 **Browser Integrity Check**
- 若站点通过 Workers/Pages，可参考 `public/_headers` 中的安全响应头，保持站点自带
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `/admin/*` 等后台路径已配置 `X-Robots-Tag: noindex, nofollow` 与 `Cache-Control: no-store`

## 6. 需要避免的配置

- 不要对静态资源开启 **Under Attack Mode**，否则影响加载速度
- 不要对所有流量开启 Managed Challenge，会显著降低正常用户体验
- Rate Limiting 阈值不要设过低，避免移动网络共享出口 IP 被误伤
- 不要拦截来自微信、百度等搜索爬虫的合理抓取（它们可能使用境外 IP）
