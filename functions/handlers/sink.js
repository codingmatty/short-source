const flatten = require('flat');
const geoip = require('geoip-lite');
const moment = require('moment');
const uaParser = require('ua-parser-js');

const config = require('../config');
const errors = require('../helpers/errors');
const logger = require('../helpers/logger');
const initializeDb = require('../db/initialize');
const db = initializeDb();

function sink(req, res) {
  req.app.set('case sensitive routing', true);
  req.app.enable('trust proxy'); // For the IP

  const { headers, ip, path, query, originalUrl } = req;

  const slug = path.slice(1);

  return db
    .findLink(slug)
    .then((url) => {
      const urlToRedirectTo =
        url || `${config.defaultDestination}${originalUrl}`;
      res.redirect(urlToRedirectTo);
      return urlToRedirectTo;
    })
    .then(recordVisitForUrl({ headers, ip, query, slug }))
    .catch(errors.handle(res));
}

function recordVisitForUrl({ headers, ip, query, slug }) {
  return (url) => {
    const location = geoip.lookup(ip);

    const ua = headers['user-agent'];
    const userAgent = uaParser(ua);

    const visitData = {
      date: moment()
        .toDate()
        .toISOString(),
      ip,
      location,
      query,
      slug,
      url,
      userAgent
    };
    const flattenedData = flatten(visitData);

    logger.log('Data to Record: ', flattenedData);

    const filteredData = Object.keys(flattenedData).reduce((obj, key) => {
      if (flattenedData[key]) {
        obj[key] = flattenedData[key];
      }
      return obj;
    }, {});

    const recordData = flatten.unflatten(filteredData);

    return db.recordVisit(recordData);
  };
}

module.exports = sink;
