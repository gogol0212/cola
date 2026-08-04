/* 产品后台实时预览模板（元数据版）
 * 由 Decap CMS 预览面板加载。
 * 不加载外部 React：Decap CMS 3.15.1 内部打包 React 19，并通过 window.h 暴露内部 createElement，
 * 直接使用即可避免 React 双实例冲突（React 18 UMD 元素无法被 React 19 reconciler 识别，报 #525）。
 *
 * products 集合在阶段 3 起瘦身为「元数据仅用」：产品详情页由前端定制生成（友童行 / 智选逸生），
 * 后台仅维护 title/slug/category/summary/audience/productLines/heroImage/status/SEO 等字段，
 * 用于产品列表、上下架与 SEO 管理。本预览对应展示这些字段。
 */
(function () {
  if (!window.CMS) return;

  var h = window.h || (window.React && window.React.createElement);
  if (!h) return;

  var BRAND = '#d31145';
  var CHARCOAL = '#262b31';
  var OLIVE = '#a5915c';
  var INK = '#1f2430';
  var MUTED = '#6b7078';
  var LINE = '#e4e1dc';
  var BG = '#faf9f7';

  function toArray(v) {
    if (!v) return [];
    if (typeof v.toArray === 'function') return v.toArray();
    if (Array.isArray(v)) return v;
    return [];
  }
  function val(o, k) {
    if (!o) return undefined;
    if (typeof o.get === 'function') return o.get(k);
    return o[k];
  }

  var labels = {
    children: '儿童保险', medical: '医疗保险', 'critical-illness': '重疾保险',
    savings: '储蓄保险', pension: '养老规划', 'overseas-assets': '海外资产配置',
    health: '健康保障', accident: '意外保障', retirement: '享老保障',
    wealth: '财富管理', legacy: '传世系列', adult: '成人', child: '儿童',
    draft: '草稿', reviewed: '已审核', published: '已发布',
  };
  function label(v) { return labels[v] || v || '—'; }

  function Row(props) {
    return h('div', { style: { display: 'flex', gap: 12, padding: '9px 0', borderBottom: '1px solid ' + LINE } },
      h('div', { style: { flex: '0 0 120px', fontSize: 12, fontWeight: 700, color: MUTED } }, props.k),
      h('div', { style: { flex: 1, fontSize: 13, color: INK, lineHeight: 1.5 } }, props.v));
  }

  function Chip(props) {
    return h('span', { style: { padding: '4px 10px', borderRadius: 999, border: '1px solid rgba(165,145,92,.4)', background: 'rgba(165,145,92,.1)', color: CHARCOAL, fontSize: 12, fontWeight: 700, marginRight: 6 } }, props.children);
  }

  function ProductMetaPreview(props) {
    var d = props.data;
    var title = val(d, 'title') || '（未填写产品名称）';
    var status = val(d, 'status') || 'draft';
    var statusColor = status === 'published' ? BRAND : status === 'reviewed' ? OLIVE : MUTED;
    var image = props.getAsset && val(d, 'heroImage') ? props.getAsset(val(d, 'heroImage')) : null;

    return h('div', { style: { fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif', background: BG, minHeight: '100%', padding: '24px 16px 40px' } },
      h('div', { style: { maxWidth: 640, margin: '0 auto' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 } },
          h('span', { style: { padding: '5px 12px', borderRadius: 999, background: statusColor, color: '#fff', fontSize: 12, fontWeight: 800 } }, label(status)),
          h('span', { style: { color: MUTED, fontSize: 12 } }, '后台仅维护产品元数据，详情页由前端定制生成')),
        h('div', { style: { display: 'flex', gap: 20, alignItems: 'flex-start', background: '#fff', border: '1px solid ' + LINE, borderRadius: 16, padding: 20 } },
          image
            ? h('img', { src: image.toString(), style: { flex: '0 0 120px', width: 120, aspectRatio: '4/5', objectFit: 'cover', borderRadius: 10 } })
            : h('div', { style: { flex: '0 0 120px', height: 150, display: 'grid', placeItems: 'center', background: 'rgba(211,17,69,.08)', color: BRAND, fontSize: 12, fontWeight: 800, borderRadius: 10 } }, '无封面'),
          h('div', { style: { flex: 1 } },
            h('h1', { style: { fontSize: 28, fontWeight: 800, margin: '0 0 8px', color: INK } }, title),
            h('p', { style: { color: MUTED, fontSize: 13, margin: '0 0 12px', lineHeight: 1.6 } }, val(d, 'summary') || '（未填写一句话定位）'),
            h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 6 } },
              toArray(val(d, 'productLines')).map(function (l) { return h(Chip, { key: l }, label(l)); }),
              toArray(val(d, 'audiences')).map(function (a) { return h(Chip, { key: a }, label(a)); })))),
        h('div', { style: { background: '#fff', border: '1px solid ' + LINE, borderRadius: 16, marginTop: 14, padding: '6px 20px' } },
          h(Row, { k: '产品分类', v: label(val(d, 'category')) }),
          h(Row, { k: '页面路径', v: '/products/' + (val(d, 'slug') || '…') + '/' }),
          h(Row, { k: '适合人群', v: toArray(val(d, 'audience')).join('、') || '—' }),
          h(Row, { k: '排序值', v: String(val(d, 'sortOrder') ?? '—') }),
          h(Row, { k: '更新日期', v: val(d, 'updatedAt') ? String(val(d, 'updatedAt')).slice(0, 10) : '—' }),
          h(Row, { k: 'SEO 标题', v: val(d, 'seoTitle') || '—' }),
          h(Row, { k: 'SEO 描述', v: val(d, 'seoDescription') || '—' }),
          h(Row, { k: '友邦官网链接', v: val(d, 'officialUrl') || '—' }))));
  }

  window.CMS.registerPreviewTemplate('products', ProductMetaPreview);
})();
