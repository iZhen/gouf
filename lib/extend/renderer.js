
const path = require('path');

function getExtname(input) {
  if (typeof input !== 'string') return '';
  return path.extname(input).replace(/^\./ig, '');
}

class Renderer {
  constructor() {
    this.store = {};
  }

  list() {
    return this.store;
  }

  get(input) {
    return this.store[getExtname(input)] || this.store[input];
  }

  isRenderable(input) {
    return Boolean(this.get(input));
  }

  register(input, output, parser) {
    this.store[input] = parser;
    this.store[input].input = input;
    this.store[input].output = output;
    this.store[input].compile = parser.compile;
  }
}

module.exports = exports = Renderer;
