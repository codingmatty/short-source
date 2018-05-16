const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const { encode } = require('../helpers/hasher');

const adapter = new FileSync('db.json');
const db = low(adapter);
const INDEX_BASE = 5000;

db.defaults({ links: [], visits: [], index: INDEX_BASE }).write();

function storeUrl(url) {
  const index = db.get('index').value();
  const link = {
    url,
    slug: encode(index)
  };
  db
    .get('links')
    .push(link)
    .write();
  db.set('index', index + 1).write();
  return Promise.resolve(link);
}

function getUrl(path) {
  const link = db
    .get('links')
    .find({ slug: path })
    .value();
  return Promise.resolve(link ? link.url : '');
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
    .filter({ path: slug })
    .value();
  console.log('visits: ', visits);
  return Promise.resolve(visits);
}

module.exports = {
  storeUrl,
  getUrl,
  recordVisit,
  getVisits
};
