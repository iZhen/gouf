
// const glob = require('glob');
const path = require('path');
const fs = require('../utils/fs');

class Render {
  constructor(ctx) {
    this.context = ctx;
    this.renderer = ctx.extend.renderer;
  }
  getRenderer(ext) {
    return this.renderer.get(ext);
  }
  render(data, options) {
    const self = this;
    const ctx = self.context;

    return new Promise((resolve, reject) => {
      if (!data) return reject(new TypeError('render/render: data is none or empty.'));
      if (data.text !== null) return resolve(data.text);
      if (!data.path) return reject(new TypeError('render/render: path is none.'));
      return fs.readFile(data.path);
    }).then((text) => {
      const ext = data.engine || getExtname(data.path);
      if (!ext || !self.isRenderable(ext)) return text;
    });
  }
}

module.exports = exports = Render;
