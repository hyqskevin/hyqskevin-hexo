#!/usr/bin/env node
/**
 * patch-mermaid-renderer.js
 *
 * hexo-filter-mermaid@1.0.0 有个严重 bug：lib/renderer.js 的 `data.content = content`
 * 会用局部变量（只含 mermaid div）覆盖整篇文章正文，导致 mermaid 块前后的所有
 * 内容丢失。这个补丁把 `data.content = content` 改为
 * `data.content = data.content.replace(group[0], content)`，让文章其他部分保留。
 *
 * 自动从 package.json 的 postinstall 调用，无需手动跑。
 *
 * 卸载时补丁文件会被 npm 重写（npm install 重装会覆盖 node_modules），
 * 所以这个 postinstall 钩子是必需的。
 */

const fs = require('fs');
const path = require('path');

const TARGET = path.join(
  __dirname,
  '..',
  'node_modules',
  'hexo-filter-mermaid',
  'lib',
  'renderer.js'
);

const MARKER = '// FIX: 用局部 content 覆盖整篇 → 用 group[0] 替换 mermaid 块';
const FIXED_LINE = 'data.content = data.content.replace(group[0], content);';
const BUGGY_LINE = 'data.content = content;';

try {
  const src = fs.readFileSync(TARGET, 'utf8');

  if (src.includes(MARKER)) {
    console.log('✅ mermaid renderer already patched');
    process.exit(0);
  }

  if (!src.includes(BUGGY_LINE)) {
    console.log('⚠️  mermaid renderer.js structure changed; patch skipped');
    process.exit(0);
  }

  const patched = src.replace(
    BUGGY_LINE,
    `${MARKER}\n\t\t${FIXED_LINE}`
  );

  fs.writeFileSync(TARGET, patched);
  console.log('✅ patched hexo-filter-mermaid/lib/renderer.js');
} catch (e) {
  if (e.code === 'ENOENT') {
    console.log('⏭️  hexo-filter-mermaid not installed; skip patch');
  } else {
    console.error('❌ patch failed:', e.message);
    process.exit(1);
  }
}