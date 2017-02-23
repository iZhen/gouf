
const _ = require('lodash');

class Generator {
  constructor() {
    this.store = {};
  }

  list() {
    return this.store;
  }

  get(name) {
    return this.store[name];
  }

  register(...args) {
    let name;
    let handler;
    if (typeof args[0] === 'function') {
      handler = args[0];
      name = `generator-${_.size(this.store) + 1}`;
    } else {
      handler = args[1];
      name = args[0];
    }

    this.store[name] = handler;
  }
}

module.exports = exports = Generator;
