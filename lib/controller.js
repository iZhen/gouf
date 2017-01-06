const _ = require('lodash');
const isPromise = require('is-promise');

const TYPE = {
  object: 'object',
  promise: 'promise',
  function: 'function',
};

function what(obj) {
  if (isPromise(obj)) return TYPE.promise;
  else if (_.isFunction(obj)) return TYPE.function;
  else if (_.isObject(obj)) return TYPE.object;
  return null;
}

function exec(args, type, params) {
  switch (type) {
    case TYPE.object: { return Promise.resolve(args); }
    case TYPE.promise: {
      return args.then(obj => Promise.resolve(exec(obj, what(obj), params)));
    }
    case TYPE.function: {
      const obj = args(params);
      return exec(obj, what(obj), params);
    }
    default: {
      throw new Error('controller/exec: type is not support!');
    }
  }
}

class Controller {
  constructor(args) {
    this.args = args;
    this.type = what(args);
  }
  get(params) {
    return exec(this.args, this.type, params);
  }
}

module.exports = exports = Controller;
