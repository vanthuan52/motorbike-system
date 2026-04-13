const fs = require('fs');
const path = require('path');

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Update relative imports to kebab-case
      content = content.replace(/from\s+["']\.\/([A-Za-z0-9]+)["']/g, (match, p1) => {
        const kebab = p1.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        return `from './${kebab}'`;
      });
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}

processDir('src/features/appointment/components');
processDir('src/features/order/components');
console.log('Imports fixed2');
