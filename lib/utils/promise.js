
function promisify(transformer) {
  if (!transformer) throw new TypeError('transformer is required!');
  if (typeof transformer !== 'function') throw new TypeError('transformer should be a function!');

  return (...args) => new Promise((fulfill, reject) => {
    transformer(...args, (err, ...results) => {
      if (!err) fulfill(...results);
      else reject(err);
    });
  });
}

exports.promisify = promisify;
