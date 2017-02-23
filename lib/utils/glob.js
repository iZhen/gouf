
const glob = require('glob');
const promisify = require('./promise').promisify;

module.exports = exports = promisify(glob);
