const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const historySrc = path.join(srcDir, 'app', '[locale]', '(web)', 'lich-su-mua-hang', '_components');
const orderDest = path.join(srcDir, 'features', 'order', 'components');

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

moveAndRename(historySrc, orderDest);

const rmdir = (dir) => { if(fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true }); };
rmdir(historySrc);

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      content = content.replace(/from\s+["']\.\/([A-Za-z0-9]+)["']/g, (match, p1) => {
        const kebab = p1.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        return `from './${kebab}'`;
      });
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}
processDir(orderDest);

console.log('Moved history components and fixed imports.');
