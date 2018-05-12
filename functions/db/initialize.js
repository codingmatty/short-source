const { isDev, isTest } = require('../helpers/env');

function initializeDb() {
  if (isTest) {
    return require('./memory');
  }
  if (isDev) {
    return require('./lowdb');
  }
  return require('./firstore');
}

module.exports = initializeDb;
