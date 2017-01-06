
const _ = require('lodash');
const pathToRegExp = require('path-to-regexp');
const Controller = require('./controller');
const Mapper = require('./mapper');

function parse(path) {
  const keys = [];
  const regexp = pathToRegExp(path, keys);
  const compile = pathToRegExp.compile(path);

  return {
    path,
    keys,
    regexp,
    compile,
  };
}

function compilePath(data, route, options) {
  const result = {};
  data.forEach((params) => {
    const path = route.compile(params);
    result[path] = Object.assign({}, options, { path, keys: params });
  });
  return result;
}

class Router {
  constructor() {
    this.routes = {};
    this.controls = {};
    this.maps = {};
  }
  match(path) {
    if (!path) throw new TypeError('path is required!');

    return _.find(this.routes, (route) => {
      if (route.path.regexp.exec(path)) {
        return true;
      }
      return false;
    });
  }
  get(path) {
    if (!path) throw new TypeError('path is required!');

    const route = this.routes[path] || this.match(path);
    return route;
  }
  get all() {
    const pages = {};
    const iterable = [];

    _.each(this.routes, (route) => {
      const ctrl = this.controls[route.path];
      const map = this.maps[route.path];
      const options = {
        orgin: route.path,
        path: route.path,
        view: route.view,
      };

      if (ctrl) options.ctrl = ctrl;

      if (route.static) { // static routing
        pages[route.path] = options;
      } else if (map) { // dynamic routing
        const table = map.map();

        iterable.push(table.then((data) => {
          Object.assign(pages, compilePath(data, route, options));
          return Promise.resolve(data);
        }));
      }
    });

    return Promise.all(iterable).then(() => Promise.resolve(pages));
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

    if (!this.routes[path]) {
      // store route
      const route = Object.assign({}, parse(path), { view: `${view}.swig` });
      if (route.keys.length > 0 && !args[0]) throw new TypeError('dynamic routing should have maps param.');
      // static or dynamic
      route.static = !route.keys.length;
      // store router
      this.routes[path] = route;
      // control & maps
      const argsLength = args.length;
      if (argsLength) {
        if (route.static || argsLength === 2) this.controls[path] = new Controller(args[0]);
        if (!route.static) this.maps[path] = new Mapper(args[argsLength - 1]);
      }
    }
  }
}

module.exports = exports = Router;
