const _ = require('lodash');
const glob = require('glob');
// const minify = require('html-minifier').minify;
const path = require('path');
const fs = require('../utils/fs');

function generator(ctx) {
  const promiseCollection = [];
  const distDir = ctx.dir.dist;
  // remove dist folder
  fs.rmdirSync(distDir);
  // layout
  const renderPromise = ctx.router.all.then((pages) => {
    const pageCollection = [];
    _.each(pages, (page) => {
      const output = path.join(distDir, page.path, '/index.html');
      const promise = ctx.render.render(page)
                    .then(content => fs.writeFile(output, content));
      pageCollection.push(promise);
      // content = minify(content, {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   conservativeCollapse: false,
      // });
    });
    return Promise.all(pageCollection);
  });
  promiseCollection.push(renderPromise);
  // source
  let sources = [];
  if (Array.isArray(ctx.dir.source)) {
    ctx.dir.source.forEach((source) => {
      sources = sources.concat(glob.sync(`${source}/*`));
    });
  } else {
    sources = sources.concat(glob.sync(`${ctx.dir.source}/*`));
  }
  sources.forEach((folder) => {
    const name = path.basename(folder);
    fs.copySync(folder, path.join(distDir, name));
  });

  // end
  return Promise.all(promiseCollection);
}

module.exports = exports = generator;
