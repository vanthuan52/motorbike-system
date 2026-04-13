const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const moveAndRename = (src, dest) => {
  if (fs.existsSync(src)) {
    fs.mkdirSync(dest, { recursive: true });
    const files = fs.readdirSync(src);
    for (const file of files) {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        let baseName = file.replace('.tsx', '').replace('.ts', '');
        let newName = baseName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '.tsx';
        fs.renameSync(path.join(src, file), path.join(dest, newName));
      }
    }
  }
};

moveAndRename(
  path.join(srcDir, 'app', '[locale]', '(web)', 'chinh-sach-bao-mat', '_components'),
  path.join(srcDir, 'features', 'privacy-policy', 'components')
);

moveAndRename(
  path.join(srcDir, 'app', '[locale]', '(web)', 'contact', '_components'),
  path.join(srcDir, 'features', 'contact', 'components')
);

const rmdir = (dir) => { if(fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true }); };
rmdir('src/app/[locale]/(web)/chinh-sach-bao-mat/_components');
rmdir('src/app/[locale]/(web)/contact/_components');

console.log('Files moved successfully.');
