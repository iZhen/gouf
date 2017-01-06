
// const glob = require('glob');
const path = require('path');
// const fs = require('./utils/fs');
const renderer = require('./renderer');

function parse(options) {
}

class Render {
  constructor(ctx) {
    this.context = ctx;
    this.compilers = {};
  }
  getCompiler(data) {
    let compiler = this.compilers[data.view];
    if (!compiler) {
      compiler = this.compilers[data.view] = renderer.compileFile(data);
    }
    return compiler;
  }
  render(options) {
    const data = {
      view: options.view,
      path: path.join(this.context.dir.layout, options.view),
      text: '',
    };
    // compiler
    const compiler = this.getCompiler(data);

    if (!options.ctrl) {
      return Promise.resolve(compiler({}));
    }
    return options.ctrl
            .get(options.keys || {})
            .then(locals => Promise.resolve(compiler(locals)));
  }
}

module.exports = exports = Render;
