
const path = require('path');
const Router = require('./router');
const Render = require('./render');
const Generator = require('./generator');

class Gouf {
  constructor(userRoot, userArgs) {
    const args = userArgs || {};
    const root = userRoot || process.cwd();

    this.dir = {
      root,
      layout: args.layout_dir || path.join(root, 'layout'),
      source: args.source_dir || path.join(root, 'source'),
      dist: args.dist_dir || path.join(root, 'dist'),
    };

    this.router = new Router();
    this.render = new Render(this);
    this.extend = {
    };
  }
  // server() {}
  generate() {
    return Generator(this);
  }
}

module.exports = exports = Gouf;
