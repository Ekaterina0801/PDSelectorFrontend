const path = require('path');
const fs = require('fs');

module.exports = {
  plugins: {
    'postcss-modules-values': {
      fileResolve(importPath, basedir, extensions) {
        if (path.isAbsolute(importPath)) {
          return importPath;
        }
        for (let ext of extensions) {
          const file = path.resolve(basedir, importPath + ext);
          try { fs.accessSync(file); return file; }
          catch {}
        }
        return path.resolve(basedir, importPath);
      }
    },
    tailwindcss: {}
  }
};
