const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const { encode } = require('../helpers/hasher');

const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({ links: [], visits: [] }).write();

const INDEX_BASE = 5000;
let index = INDEX_BASE;

function storeUrl(url) {
  const link = {
    url,
    slug: encode(index++)
  };
  db
    .get('links')
    .push(link)
    .write();
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
