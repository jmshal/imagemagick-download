#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const {download} = require('./');

download(argv)
  .then(({path}) => {
    console.log(path);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed to install: ' + err.message);
    process.exit(1);
  });
