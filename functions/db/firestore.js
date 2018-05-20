const admin = require('../helpers/admin');
const logger = require('../helpers/logger');

const INDEX_BASE = 5000;

const db = admin.firestore();

const counter = db.collection('counter');
const links = db.collection('links');
const visits = db.collection('visits');

const getCounter = ({ increment = true } = {}) => {
  return db.runTransaction((transaction) =>
    transaction
      .get(counter.doc('value'))
      .then((doc) => {
        if (doc.exists) {
          const { value } = doc.data();
          transaction.update(doc.ref, { value: value + (increment ? 1 : 0) });
          return value;
        } else {
          transaction.set(doc.ref, { value: increment ? 1 : 0 });
          return 0;
        }
      })
      .catch((error) => {
        logger.error(error);
        return Promise.reject(error);
      })
  );
};

function getIndex({ increment }) {
  return getCounter({ increment }).then((value) => value + INDEX_BASE);
}

function storeLink(link) {
  return links
    .add(link)
    .get()
    .then((doc) => doc.data());
}

function findLink(path) {
  return links
    .where('path', '==', path)
    .get()
    .then((doc) => doc.exists && doc.data().url);
}

function getLinks() {
  return links.get().then((doc) => doc.data());
}

function recordVisit(data) {
  return visits.add(data);
}

function getVisits(slug) {
  return visits
    .where('path', '==', slug)
    .get()
    .then(({ docs }) => docs.map((doc) => doc.data()));
}

module.exports = {
  getIndex,
  storeLink,
  findLink,
  getLinks,
  recordVisit,
  getVisits
};
