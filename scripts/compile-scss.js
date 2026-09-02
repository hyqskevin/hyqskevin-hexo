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
  scssFiles.forEach(file => {
    const result = sass.compile(path.join(scssDir, file), {
      style: 'compressed',
      loadPaths: [scssDir]
    });
    const outFile = file.replace(/\.scss$/, '.css');
    fs.writeFileSync(path.join(cssDir, outFile), result.css);
    console.log(`Compiled ${file} -> ${outFile}`);
  });
});