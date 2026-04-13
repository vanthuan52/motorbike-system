const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

// 1. Move and rename Blog components
const blogSrcDir = path.join(srcDir, 'app', '[locale]', '(web)', 'blog', '_components');
const blogSlugSrcDir = path.join(srcDir, 'app', '[locale]', '(web)', 'blog', '[slug]', '_components');
const blogDestDir = path.join(srcDir, 'features', 'blog', 'components');

fs.mkdirSync(blogDestDir, { recursive: true });

function toKebabCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

const moveFiles = (src, dest) => {
  if (fs.existsSync(src)) {
    const files = fs.readdirSync(src);
    for (const file of files) {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        let baseName = file.replace('.tsx', '').replace('.ts', '');
        let newName = toKebabCase(baseName) + (file.endsWith('.tsx') ? '.tsx' : '.ts');
        fs.renameSync(path.join(src, file), path.join(dest, newName));
      }
    }
  }
};

moveFiles(blogSrcDir, blogDestDir);
moveFiles(blogSlugSrcDir, blogDestDir);

// 2. Move and rename FAQ components
const faqSrcDir = path.join(srcDir, 'app', '[locale]', '(web)', 'cau-hoi-thuong-gap', '_components');
const faqDestDir = path.join(srcDir, 'features', 'faq', 'components');

fs.mkdirSync(faqDestDir, { recursive: true });
moveFiles(faqSrcDir, faqDestDir);

console.log('Files moved and renamed');
