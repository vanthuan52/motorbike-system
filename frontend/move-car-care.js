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

const dangKySrc = path.join(srcDir, 'app', '[locale]', '(web)', 'dang-ky-cham-soc-xe', '_components');
const dangKyDest = path.join(srcDir, 'features', 'appointment', 'components');

const datHangSrc = path.join(srcDir, 'app', '[locale]', '(web)', 'dat-hang-thanh-cong', '_components');
const datHangDest = path.join(srcDir, 'features', 'order', 'components');

moveAndRename(dangKySrc, dangKyDest);
moveAndRename(datHangSrc, datHangDest);

const rmdir = (dir) => { if(fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true }); };
rmdir(dangKySrc);
rmdir(datHangSrc);

console.log('Files moved successfully.');
