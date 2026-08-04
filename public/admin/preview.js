/* 产品后台实时预览模板
 * 由 Decap CMS 预览面板加载。
 * 不加载外部 React：Decap CMS 3.15.1 内部打包 React 19，并通过 window.h 暴露内部 createElement，
 * 直接使用即可避免 React 双实例冲突（React 18 UMD 元素无法被 React 19 reconciler 识别，报 #525）。
 * 渲染 products 集合的核心模块：Hero、费用、责任一览、产品比较、FAQ、CTA。
 * 数据通过 entry.get('data') 读取（Immutable Map），用 val()/toArray() 兼容普通数组。
 */
(function () {
  if (!window.CMS) return;

  var h = window.h || (window.React && window.React.createElement);
  if (!h) return;

  // ---- 品牌色（与站点保持一致：AIA 品牌规范）----
  var BRAND = '#d31145';
  var CHARCOAL = '#262b31';
  var OLIVE = '#a5915c';
  var INK = '#1f2430';
  var MUTED = '#6b7078';
  var LINE = '#e4e1dc';
  var BG = '#faf9f7';

  // ---- 兼容 Immutable List/Map 与普通数组/对象 ----
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

  var secTitle = { fontSize: 22, fontWeight: 750, letterSpacing: '-0.02em', color: INK, margin: '0 0 16px' };
  var eyebrow = { fontSize: 11, fontWeight: 800, letterSpacing: '0.12em', color: OLIVE, textTransform: 'uppercase', margin: '0 0 8px' };
  var section = { padding: '24px 0', borderTop: '1px solid ' + LINE, background: BG };
  var box = { border: '1px solid ' + LINE, borderRadius: 12, background: '#fff', padding: 16, marginBottom: 12 };
  var rowStyle = { display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid ' + LINE };
  var label = { flex: '0 0 120px', fontWeight: 700, color: MUTED, fontSize: 12 };
  var value = { flex: 1, color: INK, fontSize: 13, lineHeight: 1.5 };
  var mutedValue = Object.assign({}, value, { color: MUTED, fontSize: 12 });

  function Section(props) {
    return h('section', { style: section },
      h('div', { style: { maxWidth: 640, margin: '0 auto', padding: '0 16px' } },
        props.children));
  }

  function EyebrowText(props) {
    return h('p', { style: eyebrow }, props.children);
  }

  // ---- Hero 模块 ----
  function HeroPreview(props) {
    var d = props.data;
    var title = val(d, 'title');
    var summary = val(d, 'summary');
    var audience = toArray(val(d, 'audience'));
    var image = props.getAsset(val(d, 'heroImage'));
    var tags = toArray(val(d, 'productLines')).slice(0, 3);
    var lines = [
      ['保障方向', val(d, 'category') || ''],
      ['适用人群', audience.join('、')],
    ];

    return h('section', { style: { padding: '32px 16px', background: 'linear-gradient(145deg,#fff 0%,rgba(165,145,92,.15) 100%)' } },
      h('div', { style: { maxWidth: 640, margin: '0 auto', display: 'flex', gap: 20, alignItems: 'center' } },
        h('div', { style: { flex: 1 } },
          EyebrowText({ children: '产品 · Product Guide' }),
          h('h1', { style: { fontSize: 34, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 1, color: INK, margin: '0 0 12px' } },
            title || '（未填写产品名称）'),
          summary ? h('p', { style: { color: MUTED, fontSize: 14, lineHeight: 1.6, margin: '0 0 16px' } }, summary) : null,
          tags.length
            ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } },
                tags.map(function (t) { return h('span', { key: t, style: { padding: '6px 12px', border: '1px solid rgba(211,17,69,.22)', borderRadius: 999, background: 'rgba(211,17,69,.06)', color: BRAND, fontSize: 12, fontWeight: 750 } }, t); }))
            : null,
          h('div', { style: { marginTop: 16, padding: '12px 16px', borderLeft: '3px solid ' + OLIVE, background: 'rgba(255,255,255,.72)', borderRadius: '0 8px 8px 0' } },
            h('strong', { style: { fontSize: 12, display: 'block', marginBottom: 4 } }, '适合人群'),
            lines.map(function (line, i) {
              return h('div', { key: i, style: { display: 'flex', gap: 10, fontSize: 12, color: MUTED } },
                h('span', { style: { flex: '0 0 70px', fontWeight: 700 } }, line[0]),
                h('span', null, line[1] || '—'));
            }))
        ),
        image
          ? h('div', { style: { flex: '0 0 160px' } },
              h('img', { src: image.toString(), style: { width: 160, aspectRatio: '4/5', objectFit: 'cover', borderRadius: 12, border: '1px solid ' + LINE } }))
          : null
      ));
  }

  // ---- 费用模块 ----
  function CostSection(props) {
    var d = props.data;
    var variant = val(d, 'layoutVariant') || 'medical';
    var medical = toArray(val(d, 'medicalCosts'));
    var cards = toArray(val(d, 'premiumCards'));
    var critical = toArray(val(d, 'criticalPremiums'));
    var wealth = toArray(val(d, 'wealthCashflows'));

    var body = null;
    if (variant === 'critical' && critical.length) {
      body = critical.map(function (row, i) {
        return h('div', { key: i, style: rowStyle },
          h('span', { style: label }, '档位 ' + val(row, 'tier')),
          h('div', { style: { flex: 1 } },
            h('div', { style: value }, '基本保额：' + (val(row, 'coverage') || '—')),
            h('div', { style: value }, '年交保费：' + (val(row, 'premium') || '—')),
            val(row, 'riders') ? h('div', { style: mutedValue }, '附加：' + val(row, 'riders')) : null));
      });
    } else if (variant === 'wealth' && wealth.length) {
      body = wealth.map(function (row, i) {
        return h('div', { key: i, style: rowStyle },
          h('span', { style: label }, val(row, 'age')),
          h('div', { style: { flex: 1 } },
            h('div', { style: value }, '保费/保额：' + (val(row, 'premiumCoverage') || '—')),
            h('div', { style: value }, '领取年龄：' + (val(row, 'payoutAge') || '—')),
            h('div', { style: value }, '年金/满期：' + (val(row, 'benefit') || '—'))));
      });
    } else if (cards.length) {
      body = cards.map(function (c, i) {
        return h('div', { key: i, style: box },
          h('div', { style: { fontWeight: 800, marginBottom: 8 } }, val(c, 'ageRange')),
          h('div', { style: rowStyle }, h('span', { style: label }, '主险'), h('span', { style: value }, val(c, 'primaryName') + ' ' + val(c, 'primaryPrice'))),
          val(c, 'riderName') ? h('div', { style: rowStyle }, h('span', { style: label }, '附加险'), h('span', { style: value }, val(c, 'riderName') + ' ' + val(c, 'riderPrice'))) : null,
          h('div', { style: rowStyle }, h('span', { style: label }, '组合'), h('strong', { style: { color: BRAND } }, val(c, 'total'))));
      });
    } else if (medical.length) {
      body = medical.map(function (m, i) {
        return h('div', { key: i, style: rowStyle },
          h('span', { style: label }, val(m, 'responsibility')),
          h('div', { style: { flex: 1 } },
            h('div', { style: value }, (val(m, 'limit') || '') + (val(m, 'ratio') ? ' · ' + val(m, 'ratio') : '')),
            val(m, 'deductible') ? h('div', { style: mutedValue }, '免赔：' + val(m, 'deductible')) : null,
            val(m, 'note') ? h('div', { style: mutedValue }, val(m, 'note')) : null));
      });
    } else {
      body = h('p', { style: { color: MUTED, fontSize: 13 } }, '未填写费用数据');
    }

    return Section({ children: [
      EyebrowText({ children: '费用一览' }),
      h('h2', { style: secTitle }, '保费与费用'),
      body,
    ] });
  }

  // ---- 责任一览 ----
  function CoverageSection(props) {
    var d = props.data;
    var plans = toArray(val(d, 'coveragePlans'));
    if (!plans.length) return null;

    return Section({ children: [
      EyebrowText({ children: '责任一览' }),
      h('h2', { style: secTitle }, '保障责任'),
      plans.map(function (plan, i) {
        var resps = toArray(val(plan, 'responsibilities'));
        return h('div', { key: i, style: box },
          h('div', { style: { fontWeight: 800, marginBottom: 10 } }, val(plan, 'title')),
          resps.map(function (r, j) {
            var num = val(r, 'number');
            return h('div', { key: j, style: { padding: '7px 0', borderBottom: '1px solid ' + LINE } },
              h('div', { style: { fontWeight: 650, fontSize: 13 } }, (num ? num + '、' : '') + val(r, 'title')),
              val(r, 'text') ? h('div', { style: { color: MUTED, fontSize: 12, marginTop: 3, lineHeight: 1.5 } }, val(r, 'text')) : null,
              val(r, 'emphasis') ? h('div', { style: { color: BRAND, fontSize: 12, fontWeight: 700, marginTop: 4 } }, val(r, 'emphasis')) : null);
          }));
      }),
    ] });
  }

  // ---- 产品比较 ----
  function CompareSection(props) {
    var d = props.data;
    var rows = toArray(val(d, 'comparison'));
    if (!rows.length) return null;

    return Section({ children: [
      EyebrowText({ children: '产品比较' }),
      h('h2', { style: secTitle }, '对比口径'),
      h('div', { style: { border: '1px solid ' + LINE, borderRadius: 12, overflow: 'hidden' } },
        h('div', { style: { display: 'grid', gridTemplateColumns: '90px 1fr 1fr', background: CHARCOAL, color: '#fff', fontSize: 12, fontWeight: 700 } },
          h('div', { style: { padding: 8 } }, '维度'),
          h('div', { style: { padding: 8 } }, '本产品'),
          h('div', { style: { padding: 8 } }, '市场方案')),
        rows.map(function (r, i) {
          return h('div', { key: i, style: { display: 'grid', gridTemplateColumns: '90px 1fr 1fr', borderTop: '1px solid ' + LINE, fontSize: 12, lineHeight: 1.5 } },
            h('div', { style: { padding: 8, fontWeight: 700, background: '#f3f1ed' } }, val(r, 'label')),
            h('div', { style: { padding: 8 } }, val(r, 'product')),
            h('div', { style: { padding: 8, color: MUTED } }, val(r, 'market')));
        }))
    ] });
  }

  // ---- FAQ ----
  function FaqSection(props) {
    var d = props.data;
    var faq = toArray(val(d, 'faq'));
    if (!faq.length) return null;

    return Section({ children: [
      EyebrowText({ children: 'FAQ' }),
      h('h2', { style: secTitle }, '常见问题'),
      faq.map(function (item, i) {
        return h('div', { key: i, style: box },
          h('div', { style: { fontWeight: 700, fontSize: 13, marginBottom: 6 } }, val(item, 'question')),
          h('div', { style: { color: MUTED, fontSize: 12, lineHeight: 1.6 } }, val(item, 'answer')));
      }),
    ] });
  }

  // ---- CTA + Meta ----
  function CtaSection(props) {
    var d = props.data;
    var qr = props.getAsset(val(d, 'qrImage'));
    return Section({ children: [
      EyebrowText({ children: '咨询区' }),
      h('div', { style: box },
        h('div', { style: { fontWeight: 800, fontSize: 15 } }, val(d, 'ctaTitle') || '预约一对一咨询'),
        h('div', { style: { color: MUTED, fontSize: 12, margin: '6px 0 12px' } }, val(d, 'ctaText') || ''),
        qr ? h('img', { src: qr.toString(), style: { width: 120, height: 120, objectFit: 'contain', border: '1px solid ' + LINE, borderRadius: 8 } }) : h('div', { style: { color: MUTED, fontSize: 12 } }, '未上传二维码')),
      h('div', { style: Object.assign({}, box, { background: '#f3f1ed' }) },
        h('div', { style: { color: MUTED, fontSize: 11, lineHeight: 1.7 } },
          (val(d, 'sourceText') ? '来源：' + val(d, 'sourceText') + '\n' : '') +
          (val(d, 'disclaimer') ? '免责声明：' + val(d, 'disclaimer') : '')))
    ] });
  }

  // ---- 主预览组件 ----
  function ProductPreview(props) {
    var entry = props.entry;
    var d = entry.get('data');
    var p = { data: d, getAsset: props.getAsset };
    return h('div', { style: { fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC",sans-serif', background: BG, minHeight: '100%', paddingBottom: 40 } },
      HeroPreview(p), CostSection(p), CoverageSection(p), CompareSection(p), FaqSection(p), CtaSection(p));
  }

  window.CMS.registerPreviewTemplate('products', ProductPreview);
})();
