#!/bin/bash
# Compile SCSS to CSS for maupassant theme
THEME_DIR="/Users/hanamaki_mac_mini/Documents/github/hyqskevin-hexo/themes/maupassant"
PUBLIC_DIR="/Users/hanamaki_mac_mini/Documents/github/hyqskevin-hexo/public/css"

cd "$THEME_DIR/source/css"

# Compile main style
npx sass --style=compressed --no-source-map style.scss "$PUBLIC_DIR/style.css"

# Compile other scss files that are included
[ -f donate.scss ] && npx sass --style=compressed --no-source-map donate.scss "$PUBLIC_DIR/donate.css"
[ -f search.scss ] && npx sass --style=compressed --no-source-map search.scss "$PUBLIC_DIR/search.css"
[ -f copyright.scss ] && npx sass --style=compressed --no-source-map copyright.scss "$PUBLIC_DIR/copyright.css"
[ -f copycode.scss ] && npx sass --style=compressed --no-source-map copycode.scss "$PUBLIC_DIR/copycode.css"

echo "SCSS compiled successfully"