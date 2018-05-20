const links = [];
const visits = [];

const INDEX_BASE = 5000;
let dbIndex = INDEX_BASE;

function getIndex({ increment = true } = {}) {
  const index = dbIndex;
  if (increment) {
    dbIndex++;
  }
  return Promise.resolve(index);
}

function storeLink(link) {
  links.push(link);
  return Promise.resolve(link);
}

function findLink(path) {
  const link = links.find(({ slug }) => slug === path);
  return Promise.resolve(link ? link.url : '');
}

function getLinks(query) {
  return Promise.resolve(links);
}

function recordVisit(data) {
  visits.push(data);
}

function getVisits(slug) {
  return Promise.resolve(visit.find(({ path }) => path === slug));
}

module.exports = {
  getIndex,
  storeLink,
  findLink,
  getLinks,
  recordVisit,
  getVisits
};
