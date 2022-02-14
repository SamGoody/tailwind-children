const path = require('path')
const req = require('require-esm-in-cjs');

module.exports = req(path.resolve(__dirname, './index.mjs'));
