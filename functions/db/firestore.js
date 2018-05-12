const admin = require('../helpers/admin');
const { encode } = require('../helpers/hasher');
const logger = require('../helpers/logger');

const INDEX_BASE = 5000;

const db = admin.firestore();

const urls = db.collection('urls');
const visits = db.collection('visits');

const getCounter = ({ increment = true } = {}) => {
  return db.runTransaction((transaction) =>
    transaction
      .get(urls.doc('_counter'))
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

const getIndex = (options) => {
  return getCounter(options).then((value) => value + INDEX_BASE);
};

function storeUrl(url) {
  return getIndex().then((index) => {
    const data = {
      url,
      slug: encode(index)
    };
    return urls
      .doc(data.slug)
      .set(data)
      .then(() => data);
  });
}

function getUrl(path) {
  return urls
    .doc(path)
    .get()
    .then((doc) => doc.exists && doc.data().url);
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
  storeUrl,
  getUrl,
  recordVisit,
  getVisits
};
