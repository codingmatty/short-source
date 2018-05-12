const { encode } = require('../helpers/hasher');

const links = [];
const visits = [];

const INDEX_BASE = 5000;
let index = INDEX_BASE;

function storeUrl(url) {
  const link = {
    url,
    slug: encode(index++)
  };
  links.push(link);
  return Promise.resolve(link);
}

function getUrl(path) {
  const link = links.find(({ slug }) => slug === path);
  return Promise.resolve(link ? link.url : '');
}

function recordVisit(data) {
  visits.push(data);
}

function getVisits(slug) {
  return Promise.resolve(visit.find(({ path }) => path === slug));
}

module.exports = {
  storeUrl,
  getUrl,
  recordVisit,
  getVisits
};
