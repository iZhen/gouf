
const swig = require('swig');
const dateFns = require('date-fns');

swig.setDefaults({ cache: false });

function localsHelper(locals, data) {
  return Object.assign({ dateFns, pathname: data.pathname }, locals);
}

function render(data, locals) {
  return swig.render(data.text, {
    locals: localsHelper(locals, data),
    filename: data.path,
  });
}

function compile(data) {
  const compiler = swig.compile(data.path, {
    filename: data.path,
  });
  return locals => compiler(localsHelper(locals, data));
}

module.exports = exports = render;
exports.compile = compile;
