#!/usr/bin/env node
/**
 * ============================================================================
 * 清理 source/_posts 里的非文章文件
 * ============================================================================
 * 问题:
 *   仓库里残留了 8 个 `*.md.bak.2026xxxx` 形式的备份文件，它们带着完整
 *   front-matter，Hexo 会把它们当成正常文章渲染。
 *   后果：sitemap 里出现重复日期的畸形 URL（如 /2026/10/16/2026/o1-r1-reasoning/），
 *   同一篇内容出现两个地址，稀释权重且让 AI 抓取时困惑。
 *
 * 判据:
 *   只有 `*.md` 结尾的文件才是文章。`.md.bak.*`、`.md~`、`.orig` 等一律是残留。
 *
 * 用法:
 *   node tools/clean-stray-posts.js --dry-run   # 预览
 *   node tools/clean-stray-posts.js             # 删除并 git rm
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const POSTS = path.join(__dirname, '..', 'source', '_posts');
const DRY = process.argv.includes('--dry-run');
const RED = '\x1b[31m', GRN = '\x1b[32m', YLW = '\x1b[33m', CYA = '\x1b[36m', RST = '\x1b[0m';

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const all = walk(POSTS);
const strays = all.filter(f => {
  const b = path.basename(f);
  if (b.endsWith('.md')) return false;          // 正常文章
  if (b.startsWith('.')) return false;          // 隐藏文件
  return true;                                   // 其他都是残留
});

console.log('══════════════════════════════════════════════════════════');
console.log(' 清理 source/_posts 中的残留文件');
console.log('══════════════════════════════════════════════════════════');
console.log(`\n扫描 ${all.length} 个文件，发现 ${strays.length} 个残留\n`);

if (!strays.length) {
  console.log(`${GRN}✓ 无残留文件${RST}`);
  process.exit(0);
}

for (const f of strays) {
  const rel = path.relative(path.join(__dirname, '..'), f);
  let title = '';
  try {
    title = (fs.readFileSync(f, 'utf8').match(/^title:\s*(.+)$/m) || [, ''])[1];
  } catch { /* ignore */ }
  console.log(`  ${YLW}${path.basename(f)}${RST}`);
  if (title) console.log(`    title: ${title}`);
  console.log(`    ${rel}`);
}

if (DRY) {
  console.log(`\n${YLW}dry-run，未做改动。执行：node tools/clean-stray-posts.js${RST}`);
  process.exit(0);
}

let removed = 0, failed = 0;
for (const f of strays) {
  const rel = path.relative(path.join(__dirname, '..'), f);
  try {
    // 用 git rm 保留 git 层面的可追溯性；若未被 git 跟踪则直接删
    try {
      execSync(`git rm --quiet -- "${rel}"`, { stdio: 'ignore' });
    } catch {
      fs.unlinkSync(f);
    }
    removed++;
  } catch (e) {
    console.error(`  ✗ ${path.basename(f)}: ${e.message}`);
    failed++;
  }
}

console.log(`\n${GRN}✓ 已清理 ${removed} 个残留文件${RST}${failed ? `，${failed} 个失败` : ''}`);
console.log(`\n${CYA}下一步${RST}`);
console.log(`  npm run build && npm run geo:check`);
console.log(`  确认 sitemap 里不再有日期重复的 URL`);
