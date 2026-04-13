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
        let newName = baseName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + (file.endsWith('.tsx') ? '.tsx' : '.ts');
        fs.renameSync(path.join(src, file), path.join(dest, newName));
      }
    }
  }
};

const dichVuSrc = path.join(srcDir, 'app', '[locale]', '(web)', 'dich-vu', '_components');
const dichVuDest = path.join(srcDir, 'features', 'vehicle-service', 'components');

const gioHangSrc = path.join(srcDir, 'app', '[locale]', '(web)', 'gio-hang', '_components');
const gioHangDest = path.join(srcDir, 'features', 'cart', 'components');

moveAndRename(dichVuSrc, dichVuDest);
moveAndRename(gioHangSrc, gioHangDest);

const rmdir = (dir) => { if(fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true }); };
rmdir(dichVuSrc);
rmdir(gioHangSrc);

console.log('Files moved successfully.');
