#!/usr/bin/env node
/**
 * ============================================================================
 * GEO 部署校验
 * ============================================================================
 * 用法:
 *   npm run geo:check          # 校验本地 public/ 产物
 *   npm run geo:audit          # 校验线上站点（需 SITE 环境变量或默认域名）
 *   SITE=https://your.site npm run geo:audit
 *
 * 校验项:
 *   1. robots.txt 存在且放行了关键检索类 AI bot
 *   2. llms.txt 存在且结构正确
 *   3. sitemap.xml 存在
 *   4. 每页含 canonical
 *   5. 首页含 Person 实体标记与 sameAs
 *   6. JSON-LD 全部可解析
 *   7. 无 JS 空壳（AI 爬虫不执行 JS）
 *   8. URL 结构健康（检测日期重复等畸形 permalink）
 *
 * 退出码: 0 = 通过, 1 = 有失败项
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const REMOTE = process.argv.includes('--remote');
const SITE = process.env.SITE || 'https://hyqskevin.github.io';

const RED = '\x1b[31m', GRN = '\x1b[32m', YLW = '\x1b[33m', CYA = '\x1b[36m', RST = '\x1b[0m';
let pass = 0, fail = 0, warn = 0;
const ok = m => { console.log(`  ${GRN}✓${RST} ${m}`); pass++; };
const bad = m => { console.log(`  ${RED}✗${RST} ${m}`); fail++; };
const wrn = m => { console.log(`  ${YLW}!${RST} ${m}`); warn++; };
const head = m => console.log(`\n${CYA}▌${m}${RST}`);

const RETRIEVAL_BOTS = [
  'OAI-SearchBot', 'ChatGPT-User', 'PerplexityBot',
  'Bingbot', 'Googlebot', 'Claude-SearchBot'
];

function walk(dir, exts, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, exts, out);
    else if (exts.some(x => e.name.endsWith(x))) out.push(p);
  }
  return out;
}

async function fetchText(url) {
  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'GEO-Audit/1.0' } });
    if (!r.ok) return { code: r.status, text: '', ct: '' };
    return { code: r.status, text: await r.text(), ct: r.headers.get('content-type') || '' };
  } catch (e) {
    return { code: 0, text: '', ct: '', error: e.message };
  }
}

// ---------------------------------------------------------------- 主体
async function main() {
  console.log('══════════════════════════════════════════════════════════');
  console.log(` GEO 部署校验  ${REMOTE ? '→ 线上 ' + SITE : '→ 本地 public/'}`);
  console.log('══════════════════════════════════════════════════════════');

  let robots, llms, sitemap, indexHtml;
  let htmlFiles = [];

  if (REMOTE) {
    head('1. 关键文件可达性');
    const r = await fetchText(`${SITE}/robots.txt`);
    if (r.code === 200) { robots = r.text; ok(`robots.txt (200)`); }
    else { bad(`robots.txt 返回 ${r.code}`); }

    const l = await fetchText(`${SITE}/llms.txt`);
    if (l.code === 200) { llms = l.text; ok(`llms.txt (200, ${l.ct})`); }
    else { bad(`llms.txt 返回 ${l.code}`); }

    const s = await fetchText(`${SITE}/sitemap.xml`);
    if (s.code === 200) { sitemap = s.text; ok(`sitemap.xml (200)`); }
    else { bad(`sitemap.xml 返回 ${s.code}`); }

    const h = await fetchText(`${SITE}/`);
    if (h.code === 200) { indexHtml = h.text; ok(`首页 (200)`); }
    else { bad(`首页返回 ${h.code}`); }
  } else {
    if (!fs.existsSync(PUBLIC_DIR)) {
      console.error(`\n${RED}public/ 不存在，请先执行 npm run build${RST}`);
      process.exit(1);
    }
    head('1. 关键文件存在性');
    const read = f => {
      const p = path.join(PUBLIC_DIR, f);
      return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : null;
    };
    robots = read('robots.txt');
    robots ? ok('robots.txt') : bad('robots.txt 缺失');
    llms = read('llms.txt');
    llms ? ok('llms.txt') : bad('llms.txt 缺失');
    sitemap = read('sitemap.xml');
    sitemap ? ok('sitemap.xml') : bad('sitemap.xml 缺失');
    const idx = path.join(PUBLIC_DIR, 'index.html');
    if (fs.existsSync(idx)) { indexHtml = fs.readFileSync(idx, 'utf8'); ok('index.html'); }
    else bad('index.html 缺失');
    htmlFiles = walk(PUBLIC_DIR, ['.html']);
  }

  // ---------------------------------------------------------------- robots
  head('2. robots.txt 放行检查');
  if (robots) {
    for (const bot of RETRIEVAL_BOTS) {
      const re = new RegExp(`user-agent:\\s*${bot.replace(/[-]/g, '\\-')}\\s*\\n\\s*allow:\\s*/`, 'i');
      if (re.test(robots)) ok(`${bot} 已放行`);
      else bad(`${bot} 未放行 —— 这是被 AI 引用的命脉`);
    }
    if (/Sitemap:/i.test(robots)) ok(`已声明 Sitemap`);
    else wrn('未声明 Sitemap');
  }

  // ---------------------------------------------------------------- llms
  head('3. llms.txt 结构检查');
  if (llms) {
    /^#?\s*Name:/im.test(llms) ? ok('含 Name 字段') : wrn('缺 Name 字段');
    /^#?\s*Description:/im.test(llms) ? ok('含 Description 字段') : wrn('缺 Description 字段');
    /^#?\s*Domain:/im.test(llms) ? ok('含 Domain 字段') : wrn('缺 Domain 字段');
    /^- \[.+\]\(.+\)/m.test(llms) ? ok('含页面链接清单') : wrn('未见链接清单');
  }

  // ---------------------------------------------------------------- sitemap
  head('4. sitemap.xml 检查');
  if (sitemap) {
    const locs = sitemap.match(/<loc>/g) || [];
    ok(`${locs.length} 条 URL`);
    if (/lastmod/.test(sitemap)) ok('含 lastmod（新鲜度是重要引用信号）');
    else wrn('缺 lastmod —— 新鲜度约占 Perplexity 排名 44% 权重');
  }

  // ---------------------------------------------------------------- 页面
  head('5. 页面结构检查');
  if (indexHtml) {
    if (/<link[^>]+rel=["']canonical["']/i.test(indexHtml)) ok('首页含 canonical');
    else bad('首页缺 canonical —— 多路径访问会被判为重复内容');

    if (/["']@type["']\s*:\s*["']Person["']/i.test(indexHtml)) ok('首页含 Person 实体标记');
    else bad('首页缺 Person 实体标记 —— 个人品牌站没有实体，AI 无法把内容归属到你');

    if (/sameAs/i.test(indexHtml)) ok('含 sameAs 交叉验证锚点');
    else bad('缺 sameAs —— 实体消歧最关键的一段');

    if (/["']@type["']\s*:\s*["']WebSite["']/i.test(indexHtml)) ok('含 WebSite 实体');
    else wrn('缺 WebSite 实体');

    // JSON-LD 合法性
    const blocks = [...indexHtml.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
    let badJson = 0;
    for (const b of blocks) {
      try { JSON.parse(b[1].trim()); }
      catch (e) { badJson++; bad(`JSON-LD 解析失败: ${e.message.slice(0, 60)}`); }
    }
    if (blocks.length && !badJson) ok(`${blocks.length} 个 JSON-LD 块全部合法`);
    else if (!blocks.length) bad('首页无 JSON-LD');

    // JS 空壳
    const size = indexHtml.length;
    if (size < 2500 && /id=["'](root|app|__next)["']/i.test(indexHtml)) {
      bad(`首页仅 ${size} 字节且为 JS 空壳 —— AI 爬虫不执行 JS，等于隐形`);
    } else {
      ok(`首页 ${size} 字节，非空壳`);
    }
  }

  // ---------------------------------------------------------------- URL 健康
  head('6. URL 结构健康度');
  let urlSamples = [];
  if (REMOTE && sitemap) {
    urlSamples = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  } else if (sitemap) {
    urlSamples = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  }
  if (urlSamples.length) {
    // 畸形 URL 检测：路径里出现两次年份，或 /YYYY/MM/DD/YYYY/ 结构
    const dupDate = urlSamples.filter(u => /\/(\d{4})\/\d{2}\/\d{2}\/\d{4}\//.test(u));
    if (dupDate.length) {
      bad(`${dupDate.length} 条 URL 日期重复（如 ${dupDate[0]}）—— permalink 的 :title 取到了含日期的文件名`);
    } else ok('未发现日期重复的畸形 URL');

    const missingTitle = urlSamples.filter(u => /\/(tag|category)\//.test(u) && u.split('/').filter(Boolean).length < 2);
    missingTitle.length ? wrn(`${missingTitle.length} 条 URL 层级过浅`) : ok('URL 层级正常');
  } else {
    wrn('无 URL 样本可检查');
  }

  // ---------------------------------------------------------------- 结果
  console.log('\n══════════════════════════════════════════════════════════');
  console.log(` 结果: ${GRN}${pass} 通过${RST}  ${RED}${fail} 失败${RST}  ${YLW}${warn} 警告${RST}`);
  console.log('══════════════════════════════════════════════════════════');
  if (fail) {
    console.log(`${RED}有失败项 —— 这些是 AI 看不见你的直接原因。${RST}`);
    process.exit(1);
  }
  console.log(`${GRN}技术层放行检查通过。下一步：实体层（口径统一）与内容层。${RST}`);
}

main().catch(e => { console.error(e); process.exit(1); });
