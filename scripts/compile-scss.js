const sass = require('sass');
const fs = require('fs');
const path = require('path');

hexo.extend.filter.register('before_generate', function() {
  const scssDir = path.join(__dirname, '..', 'themes', 'maupassant', 'source', 'css');
  const cssDir = path.join(__dirname, '..', 'public', 'css');

  if (!fs.existsSync(cssDir)) {
    fs.mkdirSync(cssDir, { recursive: true });
  }

  const scssFiles = ['style.scss', 'donate.scss', 'search.scss', 'copyright.scss', 'copycode.scss'];
  const result = sass.compile(path.join(scssDir, 'style.scss'), {
    style: 'compressed',
    loadPaths: [scssDir]
  });
  fs.writeFileSync(path.join(cssDir, 'style.css'), result.css);
  console.log('Compiled style.scss -> style.css');
});