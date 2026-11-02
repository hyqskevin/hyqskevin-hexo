#!/usr/bin/env node
/**
 * ============================================================================
 * 修复 permalink 日期重复问题
 * ============================================================================
 * 问题:
 *   _config.yml 里 permalink 是 :year/:month/:day/:title/
 *   而 :title 取的是【去掉扩展名的文件名】，你的文件名形如
 *   2026-10-18-react-framework-summary.md
 *   → 生成的 URL 是 /2026/10/17/2026-10-18-react-framework-summary/
 *   → 日期出现两次，且目录日期与文件名日期可能不一致（批量导入时被重置过）
 *
 * 对 GEO 的影响:
 *   1. URL 语义混乱，AI 爬虫难以判断这篇内容的真实发布时间
 *   2. sitemap 的 lastmod 与 URL 日期对不上，新鲜度信号被污染
 *   3. 已积累 204 篇的历史 URL，改结构等于全站死链 —— 但 GitHub Pages
 *      不支持 301，所以这里采取【保守方案】
 *
 * 保守方案（重要）:
 *   ❌ 不改 permalink 结构 —— 那会让 204 篇现有文章的 URL 全部失效，
 *      而 GitHub Pages 无法做 301 重定向，是净损失
 *   ✅ 改为剥离文件名中的日期前缀，让 :title 变干净
 *   ✅ 这样新文章的 URL 变成 /2026/10/17/react-framework-summary/
 *      日期只出现一次，且与 front-matter 一致
 *   ✅ 已发布文章的旧 URL 通过 GitHub Pages 的 404 → 无法 301 的现实，
 *      靠 sitemap + 内部链接自然过渡
 *
 * 用法:
 *   node tools/fix-permalink-titles.js --dry-run    # 预览，不实际改动
 *   node tools/fix-permalink-titles.js              # 执行重命名
 *   node tools/fix-permalink-titles.js --restore    # 回滚（基于 .bak 记录）
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const POSTS = path.join(__dirname, '..', 'source', '_posts');
const DRY = process.argv.includes('--dry-run');
const RESTORE = process.argv.includes('--restore');
const AUTO_FIX = process.argv.includes('--auto');
const RECORD = path.join(__dirname, '.permalink-rename-record.json');

const RED = '\x1b[31m', GRN = '\x1b[32m', YLW = '\x1b[33m', CYA = '\x1b[36m', RST = '\x1b[0m';

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.md')) out.push(p);
  }
  return out;
}

// ---------------------------------------------------------------- 回滚
if (RESTORE) {
  if (!fs.existsSync(RECORD)) {
    console.error(`${RED}找不到重命名记录，无法回滚${RST}`);
    process.exit(1);
  }
  const rec = JSON.parse(fs.readFileSync(RECORD, 'utf8'));
  let n = 0;
  for (const r of rec) {
    if (fs.existsSync(r.to)) {
      fs.renameSync(r.to, r.from);
      n++;
    }
  }
  fs.unlinkSync(RECORD);
  console.log(`${GRN}✓ 已回滚 ${n} 个文件${RST}`);
  process.exit(0);
}

// ---------------------------------------------------------------- 主流程
const files = walk(POSTS);
const plan = [];

for (const f of files) {
  const base = path.basename(f);
  // 匹配前缀日期：2026-10-18-  或  2026-10-18_
  const m = base.match(/^(\d{4}-\d{2}-\d{2})[-_](.+)\.md$/);
  if (!m) continue;
  const [, date, slug] = m;
  const target = path.join(path.dirname(f), `${slug}.md`);
  if (target === f) continue;
  plan.push({ from: f, to: target, date, slug, oldBase: base });
}

console.log('══════════════════════════════════════════════════════════');
console.log(' 修复 permalink 日期重复');
console.log('══════════════════════════════════════════════════════════');
console.log(`\n扫描 ${files.length} 篇文章，发现 ${plan.length} 个文件名含日期前缀\n`);

if (!plan.length) {
  console.log(`${GRN}✓ 无需改动${RST}`);
  process.exit(0);
}

console.log(`${CYA}改动预览（前 15 条）${RST}`);
for (const p of plan.slice(0, 15)) {
  console.log(`  ${p.oldBase}`);
  console.log(`    → ${path.basename(p.to)}`);
}
if (plan.length > 15) console.log(`  ... 其余 ${plan.length - 15} 条省略`);

// 冲突检测 —— 必须在改名之前做，且必须严格。
//
// ⚠️ 这里有个真实的坑（已在实践中踩到）：
//   仓库里存在【重复文章】—— 同一个 title 有两个不同文件名的副本，
//   例如 `2026-10-18-ai-writing-style-distillation.md` 和
//   `2026-09-08-ai-writing-style-distillation.md`。
//   剥掉日期前缀后，两者会映射到同一个目标名。
//   如果直接 rename，后一个会【静默覆盖】前一个 —— 丢文章。
//
// 所以检测规则是：
//   1. 目标名已被【任何】现存文件占用 → 冲突（不管它是不是本次计划的一部分）
//   2. 多个源文件映射到同一目标名 → 冲突
//   3. 两篇文章的 front-matter title 相同 → 提示可能是重复文章
//
// 冲突时一律【中止】，不做任何改动，并给出可执行的修复建议。
const existing = new Set(files.map(f => f));

// 规则 2：多个源映射到同一目标
const targetCount = new Map();
for (const p of plan) {
  targetCount.set(p.to, (targetCount.get(p.to) || 0) + 1);
}
const multiTarget = [...targetCount.entries()].filter(([, c]) => c > 1);

// 规则 1：目标已被占用
const occupied = plan.filter(p => existing.has(p.to));

// 规则 3：title 重复
const titleMap = new Map();
for (const f of files) {
  try {
    const t = (fs.readFileSync(f, 'utf8').match(/^title:\s*(.+)$/m) || [, ''])[1].trim();
    if (!t) continue;
    if (!titleMap.has(t)) titleMap.set(t, []);
    titleMap.get(t).push(path.basename(f));
  } catch { /* ignore */ }
}
const dupTitles = [...titleMap.entries()].filter(([, v]) => v.length > 1);

if (occupied.length || multiTarget.length) {
  console.log(`\n${RED}✗ 检测到 ${occupied.length + multiTarget.length} 处命名冲突，已中止，未做任何改动。${RST}`);
  console.log(`\n${RED}原因：仓库里存在重复文章 —— 同一个标题有多个文件名的副本。${RST}`);
  console.log(`${RED}剥掉日期前缀后它们会映射到同一目标名，直接改名会静默覆盖、丢文章。${RST}`);
  console.log(`\n${CYA}冲突清单${RST}`);
  for (const c of occupied.slice(0, 20)) {
    console.log(`  ${path.basename(c.from)}`);
    console.log(`    → ${path.basename(c.to)}  ${RED}(目标已存在)${RST}`);
  }
  for (const [t, c] of multiTarget.slice(0, 10)) {
    console.log(`  多个源映射到同一目标: ${path.basename(t)} (${c} 个来源)`);
  }
  if (dupTitles.length) {
    console.log(`\n${CYA}检测到 ${dupTitles.length} 组标题重复（可能是重复导入的文章）${RST}`);
    for (const [t, v] of dupTitles.slice(0, 15)) {
      console.log(`  "${t}"`);
      v.forEach(f => console.log(`    - ${f}`));
    }
  }

  // ── 安全模式：自动用序号消歧，绝不覆盖 ──────────────────
  if (AUTO_FIX) {
    console.log(`\n${CYA}▌自动消歧模式${RST}`);
    // 先统计每个目标名被多少个源占用
    const claimCount = new Map();
    for (const p of plan) {
      if (!claimCount.has(p.to)) claimCount.set(p.to, []);
      claimCount.get(p.to).push(p);
    }
    const used = new Set(existing);
    let renamed = 0, skipped = 0;
    for (const p of plan) {
      if (used.has(p.to) && p.to !== p.from) {
        // 目标已被占用 → 用 -2, -3 后缀消歧
        const ext = path.extname(p.to);
        const base = path.basename(p.to, ext);
        const dir = path.dirname(p.to);
        let n = 2, candidate = path.join(dir, `${base}-${n}${ext}`);
        while (used.has(candidate)) { n++; candidate = path.join(dir, `${base}-${n}${ext}`); }
        console.log(`  ${path.basename(p.from)} → ${path.basename(candidate)}  ${YLW}(消歧，原目标已被占用)${RST}`);
        p.to = candidate;
        used.add(candidate);
        renamed++;
      } else {
        used.add(p.to);
      }
    }
    console.log(`\n  ${renamed} 个需消歧，${skipped} 个直接改名`);
    console.log(`  ${GRN}✓ 无任何文件会被覆盖${RST}`);
  } else {
    console.log(`\n${CYA}确认无误后可执行${RST}`);
    console.log(`  1. 清理重复文章：git rm <多余的文件>`);
    console.log(`  2. 重跑本脚本`);
    console.log(`\n${CYA}或使用自动消歧模式（不会覆盖任何文件）${RST}`);
    console.log(`  node tools/fix-permalink-titles.js --auto`);
    console.log(`  ${YLW}消歧会给冲突文章生成 xxx-2.md 这样的文件名，URL 上会带 -2 后缀。${RST}`);
    console.log(`  ${YLW}如果你更希望人工确认重复文章并删除多余副本，用上面的方案更干净。${RST}`);
  }
  if (!AUTO_FIX) process.exit(1);
}

if (dupTitles.length) {
  console.log(`\n${YLW}! 检测到 ${dupTitles.length} 组标题重复（不阻塞，但建议核对）${RST}`);
  for (const [t, v] of dupTitles.slice(0, 8)) {
    console.log(`  "${t}" ← ${v.map(x => path.basename(x)).join(' , ')}`);
  }
}

if (DRY) {
  console.log(`\n${YLW}这是 dry-run，未做任何改动。${RST}`);
  console.log(`确认无误后执行：node tools/fix-permalink-titles.js`);
  process.exit(0);
}

// ---------------------------------------------------------------- 执行
// 关键：必须在重命名前把【旧路径 → 新路径】的映射落盘，
// 否则重命名后文件名已无日期前缀，gen-legacy-redirects.js 就无法反推旧 URL。
const record = plan.map(p => ({
  from: p.from,
  to: p.to,
  oldSlug: p.oldBase.replace(/\.md$/, ''),
  newSlug: path.basename(p.to, '.md'),
  date: p.date
}));

// 同时记录 front-matter 日期（用于还原 permalink 目录部分）
for (const r of record) {
  try {
    const txt = fs.readFileSync(r.from, 'utf8');
    const dm = txt.match(/^date:\s*(\d{4})-(\d{2})-(\d{2})/m);
    r.y = dm ? dm[1] : r.date.slice(0, 4);
    r.mo = dm ? dm[2] : r.date.slice(5, 7);
    r.d = dm ? dm[3] : r.date.slice(8, 10);
  } catch { /* 读不到就退回文件名日期 */ }
}

fs.writeFileSync(RECORD, JSON.stringify(record, null, 2));

let done = 0, err = 0;
for (const p of plan) {
  try {
    fs.renameSync(p.from, p.to);
    done++;
  } catch (e) {
    console.error(`  ✗ ${p.oldBase}: ${e.message}`);
    err++;
  }
}

console.log(`\n${GRN}✓ 已重命名 ${done} 个文件${RST}${err ? `，${err} 个失败` : ''}`);
console.log(`  回滚记录: ${path.relative(process.cwd(), RECORD)}`);
console.log(`\n${CYA}下一步${RST}`);
console.log(`  1. npm run build && npm run geo:check   # 验证构建与 GEO 检查`);
console.log(`  2. 检查产物中 URL 是否已不含重复日期`);
console.log(`  3. 由于旧 URL 无法 301，考虑给旧路径做兼容跳转`);
