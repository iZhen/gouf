let stylus;

module.exports = (data) => {
  if (!stylus) {
    stylus = require('stylus');
  }

  return new Promise((resolve, reject) => {
    stylus(data.text)
      .set('filename', data.path)
      .set('include css', true)
      .render((err, css) => {
        if (err) reject(err);
        else resolve(css);
      });
  });
};
