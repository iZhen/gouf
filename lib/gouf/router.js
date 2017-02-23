
const _ = require('lodash');
const uuid = require('uuid/v4');
const pathToRegExp = require('path-to-regexp');
const Controller = require('./controller');
const Mapper = require('./mapper');

function parse(path) {
  const keys = [];
  const regexp = pathToRegExp(path, keys);
  const compile = pathToRegExp.compile(path);
  const tokens = pathToRegExp.parse(path);
  const tier = tokens.length;
  const dynamic = Boolean(keys.length);

  return {
    origin: path,
    keys,
    regexp,
    compile,
    tokens,
    tier,
    dynamic,
  };
}

class Router {
  constructor() {
    this.controls = {};
    this.maps = {};
    this.routes = {};
    this.static = {};
    this.dynamic = {};
    // this.cache = {};
  }
  __getMaps() {
    /**
     * list = key : options
     * key: site path
     * options: [ id, path, view, [params] ]
     */
    const self = this;
    const result = {};

    const store = (id, path, options) => {
      const route = { id, path, view: self.routes[id].view };
      if (options) Object.assign(route, options);
      result[path] = route;
    };
    // static
    _.each(self.static, (id, name) => store(id, name));
    // dynamic
    const wait = Promise
      .all(_.map(self.maps, (mapper, id) => mapper.map().then(list => ({ id, list }))))
      .then((maps) => {
        maps.forEach((data) => {
          const id = data.id;
          const compile = self.routes[id].compile;
          data.list.forEach(params => store(id, compile(params), { params }));
        });
        return Promise.resolve(result);
      });

    return wait;
  }
  __getLocals(maps) {
    const self = this;
    return Promise
      .all(_.map(maps, (data) => {
        const id = data.id;
        const ctrl = self.controls[id];
        if (ctrl) {
          return ctrl
            .get(data.params || {})
            .then(locals => Promise.resolve(Object.assign(data, { locals })));
        }
        return Promise.resolve(data);
      }))
      .then(() => Promise.resolve(maps));
  }
  list() {
    return this.__getMaps().then(maps => this.__getLocals(maps));
  }
  match(path) {
    if (!path) throw new TypeError('path is required!');

    // const isMatch = route => route.path.regexp.exec(path);

    return _.find(this.routes, route => route.path.regexp.exec(path));
  }
  get(path) {
    if (!path) throw new TypeError('path is required!');

    const route = this.routes[path] || this.match(path);
    return route;
  }
  set(path, view, ...args) {
    /**
     * fn (path, view, [control], [maps])
     * path: require, string
     * view: require, string
     * control: optional, object / promise / function
     * maps: optional, object / array / promise / function
     */
    if (!path || typeof path !== 'string') throw new TypeError('path is required!');
    if (!view || typeof view !== 'string') throw new TypeError('view is required!');

    const id = uuid();

    // route
    const route = this.routes[id] = Object.assign(parse(path), { id, view });
    if (!route.dynamic) this.static[path] = id;
    else {
      const tier = route.tier;
      if (!this.dynamic[tier]) this.dynamic[tier] = [];
      this.dynamic[tier].push(id);
    }

    // control & maps
    const argsLength = args.length;
    if (argsLength) {
      if (!route.dynamic || argsLength === 2) this.controls[id] = new Controller(args[0]);
      if (route.dynamic) this.maps[id] = new Mapper(args[argsLength - 1]);
    }

    return this;
  }
}

module.exports = exports = Router;
