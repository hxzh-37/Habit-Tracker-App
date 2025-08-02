const fs = require('fs');
const path = require('path');

function tree(dir, prefix = '') {
  const files = fs.readdirSync(dir);
  const filtered = files.filter(f => f !== 'node_modules' && f !== '.git');
  filtered.forEach((file, index) => {
    const fullPath = path.join(dir, file);
    const isDir = fs.statSync(fullPath).isDirectory();
    const isLast = index === filtered.length - 1;
    console.log(`${prefix}${isLast ? '└── ' : '├── '}${file}`);
    if (isDir) tree(fullPath, prefix + (isLast ? '    ' : '│   '));
  });
}

tree('.');
