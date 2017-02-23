const _ = require('lodash');
const isPromise = require('is-promise');

const TYPE = {
  object: 'object',
  array: 'array',
  promise: 'promise',
  function: 'function',
};

function what(obj) {
  if (isPromise(obj)) return TYPE.promise;
  else if (Array.isArray(obj)) return TYPE.array;
  else if (_.isFunction(obj)) return TYPE.function;
  else if (_.isObject(obj)) return TYPE.object;
  return null;
}

function exec(args, type) {
  switch (type) {
    case TYPE.object: { return Promise.resolve([args]); }
    case TYPE.array: { return Promise.resolve(args); }
    case TYPE.promise: {
      return args.then(obj => Promise.resolve(exec(obj, what(obj))));
    }
    case TYPE.function: {
      const obj = args();
      return exec(obj, what(obj));
    }
    default: {
      throw new Error('mapper/exec: type is not support!');
    }
  }
}

class Mapper {
  constructor(args) {
    this.args = args;
    this.type = what(args);
  }
  map() {
    return exec(this.args, this.type);
  }
}

module.exports = exports = Mapper;
