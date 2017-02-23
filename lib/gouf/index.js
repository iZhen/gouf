
const path = require('path');
const Router = require('./router');
const Render = require('./render');
const generate = require('./generate');
const extend = require('../extend');

class Gouf {
  constructor(userRoot, userArgs) {
    const args = userArgs || {};
    const root = userRoot || process.cwd();

    // dir path
    this.dir = {
      root,
      layout: args.layout_dir || path.join(root, 'layout'),
      source: args.source_dir || path.join(root, 'source'),
      dist: args.dist_dir || path.join(root, 'dist'),
    };

    // set extend
    this.extend = {
      renderer: new extend.Renderer(),
      generator: new extend.Generator(),
    };

    // set instance
    this.router = new Router();
    this.render = new Render(this);

    // load plugins
    // require('../plugins/generator')(this);
    require('../plugins/renderer')(this);
  }
  // server() {}
  generate() {
    return generate(this);
  }
}
module.exports = exports = Gouf;
