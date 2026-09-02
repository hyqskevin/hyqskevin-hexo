#!/usr/bin/env bash
# verify-crosslinks.sh — 系列文交叉链接校验脚本
# 用法：在 hexo 仓库根目录执行 ./scripts/verify-crosslinks.sh
# 行为：扫所有带 series 字段的 post，提取正文里所有 permalink，curl 验证 HTTP 200

SITE="${SITE:-http://localhost:4000}"
DIR="${DIR:-source/_posts}"

echo "=== 系列文交叉链接校验 ==="
posts=$(ls $DIR/*.md 2>/dev/null | xargs grep -lE "^series:" 2>/dev/null)
if [ -z "$posts" ]; then
  echo "未找到带 series 字段的 post"
  exit 0
fi
fail=0
for post in $posts; do
  slug=$(basename "$post" .md)
  series_name=$(grep -A 3 "^series:" "$post" | grep "name:" | awk '{print $2}')
  refs=$(grep -oE "/20[0-9]{2}/[0-9]{2}/[0-9]{2}/[a-z0-9-]+/" "$post" | sort -u)
  echo ""
  echo "→ $slug (series: $series_name)"
  for ref in $refs; do
    code=$(curl -sI "$SITE$ref" | head -1 | tr -d '\r' | awk '{print $2}')
    if [ "$code" = "200" ]; then
      echo "  ✅ $ref"
    else
      echo "  ❌ $ref -> HTTP $code"
      fail=$((fail+1))
    fi
  done
done
echo ""
if [ "$fail" -gt 0 ]; then
  echo "❌ 共 $fail 处死链，请修复"
  exit 1
fi
echo "✅ 所有跨期链接验证通过"
