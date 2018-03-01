const geoip = require('geoip-lite');
const flatten = require('flat');
const countBy = require('lodash/countBy');
const uaParser = require('ua-parser-js');

const config = require('./config');
const { getVisits } = require('./store');

module.exports = (req, res) => {
  const slug = req.query.slug;

  getVisits(slug)
    .then((visits) => {
      const data = visits.map((visit) => flatten(visit));

      const counts = [
        'ip',
        'date',
        'location.country',
        'location.region',
        'location.city',
        'location.zip',
        'userAgent.browser.name',
        'userAgent.os.name'
      ].reduce((obj, key) => {
        obj[key] = countBy(data, key);
        return obj;
      }, {});

      res.send(counts);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: error.message || error });
    });
};
