/**
 * ============================================================================
 * GEO / SEO 注入过滤器
 * ============================================================================
 * 在 hexo generate 之后运行，给每个 HTML 产物注入：
 *   1. <link rel="canonical">      —— 声明唯一权威 URL
 *   2. Open Graph / Twitter Card   —— 社交与 AI 引用时的展示元数据
 *   3. JSON-LD 实体图谱             —— Person / WebSite / Organization / Article
 *
 * ⚠️ 为什么用过滤器而不是改主题的 head.pug：
 *   1. 主题 maupassant-hexo 是独立仓库，同步更新会覆盖 head.pug 的改动。
 *      过滤器在自己仓库里，主题更新不受影响。
 *   2. 在 Pug 里内嵌 JSON-LD 极易踩坑 —— JSON 里的双引号或 #{} 会破坏
 *      Pug 编译，产物变成 0 字节且构建不报错（实测踩过）。
 *      用 JS 生成 JSON 完全规避这类问题。
 *   3. 过滤器对所有页面类型统一生效，不需要区分 post/page/archive。
 *
 * ⚠️ 关键：JSON-LD 必须在初始 HTML 里（不能 JS 注入）——
 *    除了 Googlebot，AI 爬虫基本不执行 JavaScript。
 *
 * 启用方式：在 _config.yml 中确认存在以下配置
 *   # inject: 是的
 *   inject:
 *     - tools/geo-inject.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// ── 实体档案数据（全站唯一事实源）──────────────────────────
// ⚠️ positioning 这句话必须与以下三处一字不差：
//    1. source/about/index.md 首段
//    2. source/llms.txt 的 Description 字段
//    3. GitHub profile README 顶部
const PROFILE = {
  url: 'https://hyqskevin.github.io',
  name: 'Kevin W',
  siteName: 'MonoShow',
  positioning: 'Kevin W 是聚焦 AI Agent 落地与知识工坊实践的 AI 从业者，运营 706 AI 学习路径与 AI 知识工坊，持续产出大模型工程、RAG、Agent 架构与 AI 政策类深度内容。',
  jobTitle: 'AI 从业者',
  org: '706 AI',
  knowsAbout: ['AI Agent', 'RAG', '大模型工程', 'AI 知识工坊', 'MCP', '上下文工程'],
  sameAs: [
    'https://github.com/hyqskevin',
    'https://twitter.com/hyqskevin',
    'https://instagram.com/hyqskevin'
  ],
  avatar: '/img/avatar.png'
};

const SITE_URL = PROFILE.url.replace(/\/$/, '');

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function escAttr(s) {
  return esc(s).replace(/\n/g, ' ');
}

function buildGraph(page, siteConfig) {
  // ⚠️ page.permalink 在 Hexo 里可能是【完整 URL】也可能是【路径】，
  //    取决于主题与配置。必须先归一化，否则会出现
  //    "https://site.comhttps://site.com/path/" 这种重复域名的 URL。
  let canonical;
  const p = page.permalink || '/';
  if (/^https?:\/\//i.test(p)) {
    canonical = p;
  } else {
    canonical = SITE_URL + (p.startsWith('/') ? p : '/' + p);
  }
  // 去掉可能的尾斜杠不一致问题（保留目录式）
  canonical = canonical.replace(/([^:])\/{2,}/g, '$1/');
  // ⚠️ 统一去掉末尾的 index.html
  //   source/about/index.md 的 permalink 是 /about/index.html，
  //   直接用会让 canonical 指向 /about/index.html 而不是 /about/ ——
  //   AI 爬虫会把这两个 URL 当成两个不同的页面，权重被分散。
  //   目录式的 URL（/about/）才是该页面的规范地址。
  canonical = canonical.replace(/\/index\.html?$/i, '/');
  // 根路径特殊情况：/index.html → /
  if (canonical === SITE_URL + '/index.html') canonical = SITE_URL + '/';

  const graph = [
    {
      '@type': 'Person',
      '@id': SITE_URL + '/about/#person',
      name: PROFILE.name,
      alternateName: ['hyqskevin', 'Kevin'],
      url: SITE_URL + '/about/',
      image: SITE_URL + PROFILE.avatar,
      description: PROFILE.positioning,
      jobTitle: PROFILE.jobTitle,
      knowsAbout: PROFILE.knowsAbout,
      worksFor: { '@type': 'Organization', '@id': SITE_URL + '/#organization', name: PROFILE.org },
      knowsLanguage: ['zh-CN', 'en'],
      sameAs: [SITE_URL + '/about/'].concat(PROFILE.sameAs)
    },
    {
      '@type': 'WebSite',
      '@id': SITE_URL + '/#website',
      url: SITE_URL + '/',
      name: PROFILE.siteName,
      description: (siteConfig && siteConfig.description) || PROFILE.positioning,
      inLanguage: 'zh-CN',
      publisher: { '@id': SITE_URL + '/#organization' },
      author: { '@id': SITE_URL + '/about/#person' }
    },
    {
      '@type': 'Organization',
      '@id': SITE_URL + '/#organization',
      name: PROFILE.org,
      url: SITE_URL + '/',
      founder: { '@id': SITE_URL + '/about/#person' },
      sameAs: ['https://github.com/hyqskevin']
    }
  ];

  // 文章页追加 Article，author 用 @id 引用唯一 Person 节点
  if (page.layout === 'post') {
    const iso = d => {
      if (!d) return '';
      if (typeof d.toISOString === 'function') return d.toISOString();
      return String(d);
    };
    graph.push({
      '@type': 'Article',
      '@id': canonical + '#article',
      headline: page.title || '',
      description: page.description || (siteConfig && siteConfig.description) || '',
      url: canonical,
      datePublished: iso(page.date),
      dateModified: iso(page.updated || page.date),
      author: { '@id': SITE_URL + '/about/#person' },
      publisher: { '@id': SITE_URL + '/#organization' },
      inLanguage: 'zh-CN'
    });
  }
  return { graph, canonical };
}

// ══════════════════════════════════════════════════════════════
// after_render:html 过滤器
// ══════════════════════════════════════════════════════════════
// 逐页处理 HTML 渲染结果，注入 canonical / Open Graph / JSON-LD。
//
// ⚠️ 为什么用 after_render:html 而不是 after_generate 或 config.inject：
//   · config.inject 走的是 injector 机制，要求主题模板里有
//     `<!-- hexo injector head -->` 标记 —— maupassant 主题没有这个标记，
//     注入了也不会生效。
//   · after_generate 需要自己遍历文件系统、重新解析 permalink，
//     容易和 Hexo 内部状态不一致。
//   · after_render:html 直接拿到 Hexo 渲染好的 HTML 与完整的 page 对象
//     （permalink / title / date / layout 全部现成），最准确也最省事。
//
// ⚠️ 注意：JSON-LD 必须在初始 HTML 里（不能 JS 注入）——
//    除了 Googlebot，AI 爬虫基本不执行 JavaScript。
hexo.extend.filter.register('after_render:html', function (str, data) {
  // 重定向页不注入（它们已有自己的 canonical 与 noindex）
  if (/http-equiv="refresh"/i.test(str)) return str;
  // 避免重复注入
  if (str.indexOf('"@type": "Person"') !== -1 || str.indexOf('"@type":"Person"') !== -1) return str;

  const page = data.page || {};
  const siteConfig = hexo.config;

  // ⚠️ 分页页特例
  //   Hexo 对分页页（/page/2/）的 page.permalink 返回首页路径，
  //   直接用会导致所有分页的 canonical 都指向首页 —— 这是错的，
  //   分页页有独立内容，应该指向自己。
  //   page.path 是渲染时的真实输出路径，从产物反推更可靠。
  const pageInfo = detectPageInfo(str, data, page);

  const { graph, canonical } = buildGraph(pageInfo, siteConfig);

  const pageTitle = pageInfo.title
    ? pageInfo.title + ' | ' + PROFILE.siteName
    : PROFILE.siteName;
  const description = pageInfo.description || (siteConfig && siteConfig.description) || PROFILE.positioning;

  const snippet = [
    `<link rel="canonical" href="${escAttr(canonical)}">`,
    `<meta property="og:type" content="${pageInfo.layout === 'post' ? 'article' : 'website'}">`,
    `<meta property="og:title" content="${escAttr(pageTitle)}">`,
    `<meta property="og:description" content="${escAttr(description)}">`,
    `<meta property="og:url" content="${escAttr(canonical)}">`,
    `<meta property="og:site_name" content="${escAttr(PROFILE.siteName)}">`,
    `<meta name="twitter:card" content="summary">`,
    `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph })}</script>`
  ].join('\n  ');

  // 注入到 </head> 之前
  if (str.indexOf('</head>') === -1) return str;
  return str.replace('</head>', `  ${snippet}\n</head>`);
});

/**
 * 判断当前渲染的是哪一类页面，并算出正确的 canonical 路径。
 * 优先级：page.layout > 路径特征
 */
function detectPageInfo(str, data, page) {
  const info = {
    title: page.title || '',
    description: page.description || '',
    layout: page.layout || 'page',
    date: page.date,
    updated: page.updated,
    permalink: page.permalink || '/'
  };

  // 提取 <title> 里的真实标题（分页页的 page.title 是站点名）
  const t = str.match(/<title>([^<]*)<\/title>/i);
  if (t) {
    const raw = t[1].trim();
    const cleaned = raw.replace(new RegExp('\\s*\\|\\s*' + PROFILE.siteName + '\\s*$'), '').trim();
    //  cleaned 与站点名相同 → 说明这是首页或分页页，page.title 不可靠
    if (cleaned && cleaned !== PROFILE.siteName) info.title = cleaned;
    else info.title = '';
  }

  // 提取 description
  const d = str.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
  if (d && d[1].trim()) info.description = d[1].trim();

  // 提取日期
  const tm = str.match(/<time[^>]*datetime="([^"]+)"/i);
  if (tm && !info.date) info.date = new Date(tm[1]);

  // ⚠️ 分页页判断
  //   分页页的 page.permalink 是首页路径，但页面里有 /page/N/ 的分页链接。
  //   用 data.path（渲染输出路径）更准确。
  const outPath = data.path || '';
  const pageMatch = outPath.match(/^\/?page\/(\d+)\//);
  if (pageMatch) {
    const n = pageMatch[1];
    info.permalink = n === '1' ? '/' : `/page/${n}/`;
    info.layout = 'page';
    info.title = '';   // 分页页标题与首页相同，不要重复
    info.description = '';
  }

  // 归档页
  if (/^\/?archives\//.test(outPath)) {
    info.permalink = '/archives/';
    info.layout = 'page';
  }

  // 分类/标签页
  const catMatch = outPath.match(/^\/?(categories|tags)\/([^\/]+)\/?/);
  if (catMatch) {
    info.permalink = `/${catMatch[1]}/${catMatch[2]}/`;
    info.layout = 'page';
  }

  return info;
}
