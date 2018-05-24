const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const { encode } = require('../helpers/hasher');

const adapter = new FileSync('db.json');
const db = low(adapter);
const INDEX_BASE = 5000;

db.defaults({ links: [], visits: [], index: INDEX_BASE }).write();

function getIndex({ increment = true } = {}) {
  const index = db.get('index').value();
  if (increment) {
    db.set('index', index + 1).write();
  }
  return Promise.resolve(index);
}

function storeLink(link) {
  db
    .get('links')
    .push(link)
    .write();
  return Promise.resolve(link);
}

function findLink(path) {
  const link = db
    .get('links')
    .find({ slug: path })
    .value();
  return Promise.resolve(link ? link.url : '');
}

function getLinks(query) {
  const links = db.get('links').value();
  return Promise.resolve(links);
}

function recordVisit(data) {
  db
    .get('visits')
    .push(data)
    .write();
}

function getVisits(slug) {
  const visits = db
    .get('visits')
    .filter({ slug })
    .value();
  return Promise.resolve(visits);
}

module.exports = {
  getIndex,
  storeLink,
  findLink,
  getLinks,
  recordVisit,
  getVisits
};
