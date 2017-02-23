

module.exports = exports = (ctx) => {
  const renderer = ctx.extend.renderer;

  renderer.register('swig', 'html', require('./swig'));
  renderer.register('styl', 'css', require('./stylus'));
};
