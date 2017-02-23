const _ = require('lodash');
const path = require('path');
const fs = require('../utils/fs');
const glob = require('../utils/glob');

function gPage(ctx) {
  const layout = ctx.dir.layout;
  const dist = ctx.dir.dist;
  return ctx.router.list().then((pages) => {
    const iterator = _.map(pages, page => glob(`${page.view}.*`, { cwd: layout }).then((files) => {
      if (files.length === 0) throw new Error(`generate/page: view '${page.view}' not exist.`);

      let file = null;
      let renderer = null;
      for (let i = 0, l = files.length; i < l; i += 1) {
        file = files[i];
        renderer = ctx.extend.renderer.get(file);
        if (renderer) break;
      }
      if (!renderer) throw new Error(`generate/page: no any renderer for view '${page.view}'.`);

      const origin = path.join(layout, file);
      const output = path.join(dist, page.path, `/index.${renderer.output}`);

      return fs.readFile(origin, 'utf8')
        .then(text => fs.writeFile(output, renderer({ text, path: origin, pathname: page.path }, page.locals)));
    }));

    return Promise.all(iterator);
  });
}

function gSource(ctx) {
  const source = ctx.dir.source;
  const dist = ctx.dir.dist;
  return glob('**/!(_)*.*', { cwd: source }).then((files) => {
    const iterator = [];
    for (let i = 0, l = files.length; i < l; i += 1) {
      const file = files[i];
      const renderer = ctx.extend.renderer.get(file);
      const srcPath = path.join(source, file);
      if (renderer) {
        const distPath = path.join(dist, file.replace(/[^\.]+?$/ig, renderer.output));
        const p = fs.readFile(srcPath, 'utf8')
          .then(text => renderer({ text, path: srcPath }))
          .then(css => fs.writeFile(distPath, css));
        iterator.push(p);
      } else {
        const distPath = path.join(dist, file);
        const p = fs.copy(srcPath, distPath);
        iterator.push(p);
      }
    }
    return Promise.all(iterator);
  });
}

function generate(ctx) {
  return fs.rmdir(ctx.dir.dist)
    .then(() => Promise.all([gPage(ctx), gSource(ctx)]));
}

module.exports = exports = generate;
