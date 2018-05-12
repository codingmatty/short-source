const { isDev, isTest } = require('../helpers/env');

let db = null;

function initializeDb() {
  if (db) {
    return db;
  }
  if (isTest) {
    db = require('./memory');
  } else if (isDev) {
    db = require('./lowdb');
  } else {
    db = require('./firstore');
  }
  return db;
}

module.exports = initializeDb;
