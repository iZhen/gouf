
const swig = require('swig');
const dateFns = require('date-fns');
const helper = require('./helper');

function localsHelper(locals) {
  return Object.assign({ dateFns, helper }, locals);
}

function render(data, locals) {
  return swig.render(data.text, {
    locals,
    filename: data.path,
  });
}

function compileFile(data) {
  const compiler = swig.compileFile(data.path, {
    filename: data.path,
  });
  return locals => compiler(localsHelper(locals));
}

module.exports = exports = render;
exports.compileFile = compileFile;
