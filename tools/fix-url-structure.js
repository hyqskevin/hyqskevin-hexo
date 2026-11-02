#!/usr/bin/env node
/**
 * ============================================================================
 * 修复 URL 三层冗余
 * ============================================================================
 * 问题:
 *   你的 permalink 是 `:year/:month/:day/:title/`
 *   而 Hexo 的 `:title` 变量 = 【源文件相对 source/_posts 的路径】，不是文件名。
 *   源文件放在 `source/_posts/2026/` 子目录下 → :title = `2026/2026-10-18-xxx`
 *   再叠加 :year/:month/:day（来自 front-matter date）→
 *
 *     线上真实 URL: /2026/10/17/2026/2026-10-18-react-framework-summary/
 *                   ^^^^^^ ^^^^^ ^^^^^ ^^^^^ ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
 *                   permalink 目录    源目录  文件名日期   文件名slug
 *                   ←──── 三层冗余 ────→
 *
 *   对 GEO 的影响:
 *   1. URL 里出现两个不同日期（目录日期 10/17 vs 文件名日期 10-18），语义冲突，
 *      AI 爬虫无法判断这篇内容的真实发布时间
 *   2. sitemap 的 lastmod 与 URL 日期对不上，新鲜度信号被污染
 *      （而新鲜度约占 Perplexity 排名 44% 权重）
 *   3. URL 无意义地冗长，浪费抓取预算
 *
 * 修复方式（保守，不破坏现有链接）:
 *   把 `source/_posts/2026/` 下的文章【上移一层】到 `source/_posts/`
 *   → :title 变成纯 slug，URL 变成 /2026/10/17/react-framework-summary/
 *
 *   ⚠️ 这会改变 204 篇文章的 URL。GitHub Pages 不支持 301，
 *      所以配套生成静态重定向页（meta refresh + canonical），
 *      把旧 URL 的权重归并到新 URL。
 *
 *   如果你不想动 URL，可以跳过本脚本 —— 但那样 URL 三层冗余会一直存在。
 *
 * 用法:
 *   node tools/fix-url-structure.js --dry-run    # 预览
 *   node tools/fix-url-structure.js              # 执行（上移文章）
 *   node tools/fix-url-structure.js --restore    # 回滚
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const POSTS = path.join(ROOT, 'source', '_posts');
const RECORD = path.join(__dirname, '.url-structure-record.json');

const DRY = process.argv.includes('--dry-run');
const RESTORE = process.argv.includes('--restore');

const RED = '\x1b[31m', GRN = '\x1b[32m', YLW = '\x1b[33m', CYA = '\x1b[36m', RST = '\x1b[0m';

// ---------------------------------------------------------------- 回滚
if (RESTORE) {
  if (!fs.existsSync(RECORD)) {
    console.error(`${RED}找不到移动记录，无法回滚${RST}`);
    process.exit(1);
  }
  const rec = JSON.parse(fs.readFileSync(RECORD, 'utf8'));
  let n = 0;
  for (const r of rec.reverse()) {
    if (!fs.existsSync(r.from) && fs.existsSync(r.to)) {
      fs.mkdirSync(path.dirname(r.from), { recursive: true });
      fs.renameSync(r.to, r.from);
      n++;
    }
  }
  fs.unlinkSync(RECORD);
  console.log(`${GRN}✓ 已回滚 ${n} 个文件${RST}`);
  process.exit(0);
}

// ---------------------------------------------------------------- 扫描
// 找出所有位于子目录（非 _posts 根）下的文章
const posts = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.md')) posts.push(p);
  }
}
walk(POSTS);

const movers = posts.filter(f => path.dirname(f) !== POSTS);

console.log('══════════════════════════════════════════════════════════');
console.log(' 修复 URL 三层冗余');
console.log('══════════════════════════════════════════════════════════');
console.log(`\n共 ${posts.length} 篇文章，其中 ${movers.length} 位于子目录（URL 会多一层目录名）`);

// 目标文件名冲突检测
const rootNames = new Set(posts.filter(f => path.dirname(f) === POSTS).map(f => path.basename(f)));
const conflicts = [];
const planned = new Set();
for (const f of movers) {
  const base = path.basename(f);
  if (rootNames.has(base)) { conflicts.push({ f, reason: '目标已存在同名文件' }); continue; }
  if (planned.has(base)) { conflicts.push({ f, reason: '多个源映射到同一目标名' }); continue; }
  planned.add(base);
}

if (conflicts.length) {
  console.log(`\n${RED}✗ ${conflicts.length} 处冲突，已中止：${RST}`);
  for (const c of conflicts.slice(0, 15)) {
    console.log(`  ${path.relative(POSTS, c.f)}  ${RED}(${c.reason})${RST}`);
  }
  console.log(`\n${YLW}请先人工处理这些冲突（重命名或删除重复文章），再重跑。${RST}`);
  process.exit(1);
}

if (!movers.length) {
  console.log(`\n${GRN}✓ 所有文章已在 _posts 根目录，无需处理${RST}`);
  process.exit(0);
}

// 展示样例
console.log(`\n${CYA}URL 变化示例${RST}`);
for (const f of movers.slice(0, 6)) {
  const rel = path.relative(POSTS, f);
  const segs = rel.split(path.sep);
  const date = (fs.readFileSync(f, 'utf8').match(/^date:\s*(\d{4})-(\d{2})-(\d{2})/m) || [, '', '', '']);
  const [y, mo, d] = [date[1], date[2], date[3]];
  const slug = path.basename(f, '.md').replace(/^\d{4}-\d{2}-\d{2}[-_]/, '');
  console.log(`  ${rel}`);
  console.log(`    旧: /${y}/${mo}/${d}/${segs.slice(0, -1).join('/')}/${path.basename(f, '.md')}/`);
  console.log(`    新: /${y}/${mo}/${d}/${slug}/`);
}
if (movers.length > 6) console.log(`  ... 其余 ${movers.length - 6} 条省略`);

if (DRY) {
  console.log(`\n${YLW}dry-run，未做改动。执行：node tools/fix-url-structure.js${RST}`);
  process.exit(0);
}

// ---------------------------------------------------------------- 执行
const record = movers.map(f => ({
  from: f,
  to: path.join(POSTS, path.basename(f))
}));

fs.writeFileSync(RECORD, JSON.stringify(record, null, 2));

let done = 0, err = 0;
for (const r of record) {
  try {
    fs.renameSync(r.from, r.to);
    done++;
  } catch (e) {
    console.error(`  ✗ ${path.basename(r.from)}: ${e.message}`);
    err++;
  }
}

// 清理空的子目录
for (const dir of fs.readdirSync(POSTS)) {
  const p = path.join(POSTS, dir);
  if (fs.statSync(p).isDirectory() && fs.readdirSync(p).length === 0) {
    fs.rmdirSync(p);
    console.log(`  已清理空目录: ${dir}/`);
  }
}

console.log(`\n${GRN}✓ 已上移 ${done} 个文件${RST}${err ? `，${err} 个失败` : ''}`);
console.log(`  回滚记录: ${path.relative(ROOT, RECORD)}`);
console.log(`\n${CYA}下一步${RST}`);
console.log(`  1. node tools/gen-legacy-redirects.js   # 生成旧 URL 重定向页`);
console.log(`  2. npm run build && npm run geo:check`);
console.log(`  3. 确认 sitemap 里 URL 不再有目录名冗余`);
