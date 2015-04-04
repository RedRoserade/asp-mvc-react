#!/usr/bin/env node
var path = require('path');
require('./register-babel');
var mod = require(path.join(__dirname, process.argv[2]));

if (typeof mod === 'function') {
  mod();
}
