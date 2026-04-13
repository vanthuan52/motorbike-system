const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      const filePath = path.join(dir, file);
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Update specific known old alias imports
      content = content.replace(/@\/app\/\[locale\]\/\(web\)\/blog\/_components\/BlogHeader/g, './blog-header');
      content = content.replace(/@\/app\/\[locale\]\/\(web\)\/blog\/_components\/BlogFilter/g, './blog-filter');
      content = content.replace(/@\/app\/\[locale\]\/\(web\)\/blog\/_components\/BlogCard/g, './blog-card');
      
      // Update relative imports to kebab-case
      content = content.replace(/from\s+["']\.\/([A-Za-z0-9]+)["']/g, (match, p1) => {
        const kebab = p1.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        return `from './${kebab}'`;
      });
      
      content = content.replace(/from\s+["']\.\.\/([A-Za-z0-9]+)["']/g, (match, p1) => {
        // Since blog/[slug]/_components files moved up, parent imports should become same-dir imports
        const kebab = p1.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
        return `from './${kebab}'`;
      });

      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}

processDir('src/features/blog/components');
processDir('src/features/faq/components');
console.log('Imports fixed');
