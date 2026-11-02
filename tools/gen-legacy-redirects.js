#!/usr/bin/env node
/**
 * ============================================================================
 * 生成旧 URL 的静态重定向页
 * ============================================================================
 * 背景:
 *   GitHub Pages 是纯静态托管，没有 .htaccess、没有 Nginx 配置，
 *   不支持服务端 301。但如果你把文件名里的日期前缀剥掉（见
 *   tools/fix-permalink-titles.js），permalink 产出的 URL 会变化，
 *   已发布文章的旧链接会变成 404。
 *
 *   204 篇文章死链的代价很大 —— 你在 GitHub profile、知乎、播客 show notes、
 *   微信文章里散布的链接都指向旧地址，而 AI 爬虫顺着这些链接爬到 404，
 *   会连带降低对整站的信任度。
 *
 * 方案:
 *   为每个旧路径生成一个 index.html，内含：
 *     · <meta http-equiv="refresh">  —— 浏览器立即跳转
 *     · <link rel="canonical">        —— 指向新 URL，权重归并
 *     · 内链 fallback                  —— 兼顾不执行 JS/meta 的爬虫
 *
 *   注意：这是 302 语义（客户端跳转），权重传递弱于真正的 301。
 *   但比 404 好得多 —— canonical 能把权重归并到新 URL。
 *
 * 更好的长期方案:
 *   绑定自定义域名后用 Cloudflare 免费版做真正的 301 Redirect Rules。
 *   本脚本生成的是过渡方案。
 *
 * 用法:
 *   node tools/gen-legacy-redirects.js            # 生成
 *   node tools/gen-legacy-redirects.js --clean    # 清理
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const POSTS = path.join(ROOT, 'source', '_posts');
// ⚠️ 目录名不能用下划线开头 —— Hexo 会忽略 _ 开头的目录（与 Jekyll 同规则），
//    导致这些重定向页根本不会被拷贝到 public/。
//    也不能放在 source/_posts 下，否则会被当成文章渲染并进入 sitemap。
//    所以用 source/legacy-redirects/ 这个普通名字。
const OUT = path.join(ROOT, 'source', 'redirect-pages');
const CONFIG = path.join(ROOT, '_config.yml');

const CLEAN = process.argv.includes('--clean');
const GRN = '\x1b[32m', YLW = '\x1b[33m', CYA = '\x1b[36m', RST = '\x1b[0m';

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

function readConfig() {
  try {
    const txt = fs.readFileSync(CONFIG, 'utf8');
    const m = txt.match(/^url:\s*(\S+)/m);
    const p = txt.match(/^permalink:\s*(\S+)/m);
    const tz = txt.match(/^timezone:\s*(\S+)/m);
    return {
      url: m ? m[1].replace(/\/$/, '') : 'https://hyqskevin.github.io',
      permalink: p ? p[1] : ':year/:month/:day/:title/',
      timezone: tz ? tz[1].replace(/^['"]|['"]$/g, '') : 'Asia/Shanghai'
    };
  } catch {
    return {
      url: 'https://hyqskevin.github.io',
      permalink: ':year/:month/:day/:title/',
      timezone: 'Asia/Shanghai'
    };
  }
}

// 清理
if (CLEAN) {
  if (fs.existsSync(OUT)) {
    fs.rmSync(OUT, { recursive: true, force: true });
    console.log(`${GRN}✓ 已清理 ${path.relative(ROOT, OUT)}${RST}`);
  } else {
    console.log(`${YLW}目录不存在，无需清理${RST}`);
  }
  process.exit(0);
}

// ---------------------------------------------------------------- 生成
const { url, permalink } = readConfig();

// 旧 URL 的真实形态（已从线上实际抓取确认）：
//   /YYYY/MM/DD/2026/2026-10-18-xxx/
//   ^^^^^^ ^^^^^ ^^^^^ ^^^^^ ^^^^^^^^^^^^^^^^^^^^^^
//   permalink 目录    源目录  文件名(仍含日期前缀)
//
// 即：文章放在 source/_posts/2026/ 子目录 + 文件名带日期前缀，
//     两层冗余叠加的结果。修复后新 URL 是 /YYYY/MM/DD/xxx/
//
// 这里用两个记录文件还原：
//   .permalink-rename-record.json —— 文件名去日期前缀的映射
//   .url-structure-record.json    —— 子目录上移的映射
// 两者共同决定旧路径。

// ─────────────────────────────────────────────────────────────
// ⚠️ 时区陷阱（实测踩过，必须复现 CI 环境的 Hexo 计算）
// ─────────────────────────────────────────────────────────────
// permalink 里的 :year/:month/:day 不是 front-matter 的 date 原值，
// 而是 Hexo 经过 adjustDateForTimezone 之后的本地日期。
//
// Hexo 的算法（hexo/dist/plugins/processor/common.js）：
//   const offset = date.getTimezoneOffset();   // ← 取决于构建环境时区
//   const target = moment.tz.zone(timezone).utcOffset(ms);
//   const diff = (offset - target) * 60000;
//   return new Date(ms - diff);
//
// 而 getTimezoneOffset() 是环境相关的，同一份代码两种结果：
//   本地 (Asia/Shanghai, UTC+8) → date: 2026-10-18 → permalink /2026/10/18/
//   CI   (ubuntu-latest, UTC)   → date: 2026-10-18 → permalink /2026/10/17/
//
// 线上是 CI 构建的（GitHub Actions ubuntu-latest = UTC），
// 所以旧 URL 用的是 UTC 下的结果。
// 本地生成重定向页时若直接用 front-matter 日期会差一天 ——
// 重定向落到 /2026/10/18/2026/xxx/，而旧链接在 /2026/10/17/2026/xxx/，
// 结果重定向完全失效（实测踩过）。
//
// → 这里强制按 UTC 语义计算（offset = 0），与 CI 保持一致。
//    注意：这不是「修正时区 bug」，而是「让本地重定向页对齐线上产物」。
//    如果你把 CI 改成显式设置 TZ=Asia/Shanghai，那本地就应该用本地时区算。
const moment = require('moment-timezone');

function hexoPermalinkDate(dateStr, timezone, useUtc) {
  // 与 Hexo 的 toDate 一致：无时区信息按本地时间解析
  const d = new Date(dateStr);
  // 模拟目标环境的 getTimezoneOffset()
  const offset = useUtc ? 0 : d.getTimezoneOffset();
  const ms = d.getTime();
  const target = moment.tz.zone(timezone).utcOffset(ms);
  const diff = (offset - target) * 60000;
  const adj = new Date(ms - diff);
  return {
    y: adj.getUTCFullYear(),
    mo: String(adj.getUTCMonth() + 1).padStart(2, '0'),
    d: String(adj.getUTCDate()).padStart(2, '0')
  };
}

// 默认按 UTC 算（对齐 GitHub Actions ubuntu-latest）
// 若 CI 里显式设了 TZ，可加环境变量 GEO_TZ_MODE=local 切回本地语义
const USE_UTC = process.env.GEO_TZ_MODE !== 'local';

const SITE_TZ = (readConfig().timezone || 'Asia/Shanghai');

const MAP1 = path.join(__dirname, '.permalink-rename-record.json');
const MAP2 = path.join(__dirname, '.url-structure-record.json');
let pages = [];

if (fs.existsSync(MAP1) && fs.existsSync(MAP2)) {
  const rec1 = JSON.parse(fs.readFileSync(MAP1, 'utf8'));
  const rec2 = JSON.parse(fs.readFileSync(MAP2, 'utf8'));

  // rec2: 从 source/_posts/2026/xxx.md → source/_posts/xxx.md
  // 建立 "移动后的文件名" → "移动前的完整相对路径"
  const movedTo = new Map();
  for (const r of rec2) {
    movedTo.set(path.basename(r.to), path.relative(POSTS, r.from));
  }

  // rec1: 从 2026-10-18-xxx.md → xxx.md
  for (const r of rec1) {
    const newBase = path.basename(r.to);
    const oldRel = movedTo.get(newBase);
    if (!oldRel) continue;                 // 不在本次移动范围内，跳过

    // ⚠️ 用 Hexo 的算法（含时区）算 permalink 日期，而不是直接用 date 字段
    const pd = hexoPermalinkDate(`${r.y || r.date.slice(0, 4)}-${r.mo || r.date.slice(5, 7)}-${r.d || r.date.slice(8, 10)}T00:00:00`, SITE_TZ, USE_UTC);
    const y = pd.y, mo = pd.mo, d = pd.d;

    // 旧路径：源目录相对路径 + 旧文件名
    const dirOfOld = path.dirname(oldRel).replace(/\\/g, '/');
    const oldPath = `/${y}/${mo}/${d}/${dirOfOld}/${r.oldSlug}/`;
    // 新路径：根目录 + 去日期前缀的文件名
    const newPath = `/${y}/${mo}/${d}/${r.newSlug}/`;

    if (oldPath === newPath) continue;
    pages.push({ oldPath, newPath, title: r.oldSlug });
  }
} else {
  // 回退：直接从文件名反推（尚未做过任何修复时的形态）
  const files = walk(POSTS);
  for (const f of files) {
    const base = path.basename(f);
    const m = base.match(/^(\d{4})-(\d{2})-(\d{2})[-_](.+)\.md$/);
    if (!m) continue;
    const [, y, mo, d, slug] = m;
    const txt = fs.readFileSync(f, 'utf8');
    const dm = txt.match(/^date:\s*(\d{4})-(\d{2})-(\d{2})/m);
    const dateY = dm ? dm[1] : y, dateM = dm ? dm[2] : mo, dateD = dm ? dm[3] : d;
    const dirOfOld = path.relative(POSTS, path.dirname(f)).replace(/\\/g, '/');
    const oldPath = `/${dateY}/${dateM}/${dateD}/${dirOfOld ? dirOfOld + '/' : ''}${m[1]}-${m[4]}/`;
    const newPath = `/${dateY}/${dateM}/${dateD}/${slug}/`;
    if (oldPath === newPath) continue;
    pages.push({ oldPath, newPath, title: (txt.match(/^title:\s*(.+)$/m) || [, slug])[1].trim() });
  }
}

if (!pages.length) {
  console.log(`${GRN}✓ 无需生成重定向页（文件名已不含日期前缀，且无重命名记录）${RST}`);
  process.exit(0);
}

// 写入 source/redirect-pages/<旧路径>/index.md
//
// ⚠️ 三个关键约束（都是实测踩出来的）：
//
//   1. 目录名不能以 _ 开头 —— Hexo 忽略 _ 开头的目录（同 Jekyll 规则），
//      整批页面不会被处理。也不能放进 source/_posts，否则会被当文章渲染。
//      → 用 source/redirect-pages/
//
//   2. 必须用 .md + front-matter，不能用裸 .html。
//      Hexo 的 asset 处理器只把「无 renderer 的扩展名」当静态资源拷贝；
//      目录里全是 .html 时会被判定为「可渲染但无 renderer」而整体跳过。
//      而 .md 走页面渲染流程，permalink 与 sitemap: false 都能精确控制。
//
//   3. front-matter 必须写：
//        permalink:    精确指定旧 URL 的落点（否则会用默认 permalink 规则）
//        sitemap: false 排除出站点地图（生成器判断 post.sitemap !== false）
//
//   已实测验证：产物落在 public/2026/10/18/2026/<旧slug>/index.html，
//   且 sitemap.xml 中不含该 URL。
let written = 0;
for (const p of pages) {
  const dir = path.join(OUT, p.oldPath.replace(/^\//, '').replace(/\/$/, ''));
  fs.mkdirSync(dir, { recursive: true });
  const md = `---
title: 页面已迁移
date: ${new Date().toISOString().split('T')[0]} 00:00:00
permalink: ${p.oldPath}
sitemap: false
layout: false
---

<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${url}${p.newPath}">
<link rel="canonical" href="${url}${p.newPath}">
<meta name="robots" content="noindex, follow">
<title>页面已迁移 — ${p.title}</title>
</head>
<body>
<p>本页已迁移至 <a href="${url}${p.newPath}">${p.title}</a>。</p>
</body>
</html>
`;
  fs.writeFileSync(path.join(dir, 'index.md'), md, 'utf8');
  written++;
}

console.log('══════════════════════════════════════════════════════════');
console.log(' 旧 URL 重定向页生成完成');
console.log('══════════════════════════════════════════════════════════');
console.log(`\n生成 ${written} 个重定向页`);
console.log(`  位置: ${path.relative(ROOT, OUT)}/`);
console.log(`  格式: meta refresh + canonical 指向新 URL`);
console.log(`\n${CYA}注意事项${RST}`);
console.log(`  · 这是 302 语义（客户端跳转），权重传递弱于真正的 301`);
console.log(`  · canonical 能把权重归并到新 URL，比 404 好得多`);
console.log(`  · 长期方案：绑定自定义域名后用 Cloudflare 免费版做真 301`);
console.log(`\n${CYA}下一步${RST}`);
console.log(`  1. npm run build && npm run geo:check`);
console.log(`  2. 抽查一个旧 URL 是否能正确跳转`);
console.log(`  3. 确认 sitemap 里 URL 不再有目录名冗余`);
