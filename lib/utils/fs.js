
const fs = require('graceful-fs');
const fse = require('fs-extra');
const promisify = require('./promise').promisify;


exports.writeFile = promisify(fse.outputFile);
exports.writeFileSync = fse.outputFileSync;
exports.readFile = promisify(fs.readFile);
exports.readFileSync = fs.readFileSync;
exports.rmdir = promisify(fse.remove);
exports.rmdirSync = fse.removeSync;
exports.copy = promisify(fse.copy);
exports.copySync = fse.copySync;
