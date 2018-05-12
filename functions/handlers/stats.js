const geoip = require('geoip-lite');
const flatten = require('flat');
const moment = require('moment');
const countBy = require('lodash/countBy');
const groupBy = require('lodash/groupBy');
const mapValues = require('lodash/mapValues');
const uaParser = require('ua-parser-js');

const config = require('../config');
const logger = require('../helpers/logger');
const initializeDb = require('../db/initialize');
const { getVisits } = initializeDb();

function formatVisitsData(visits, utcOffset) {
  return (obj, key, index) => {
    switch (key) {
      case 'date.date':
        obj[key] = countBy(visits, (value) =>
          moment(value['date'])
            .utcOffset(utcOffset)
            .startOf('day')
        );
        break;
      case 'date.timeOfWeekday':
        obj[key] = mapValues(
          groupBy(visits, (value) =>
            moment(value['date'])
              .utcOffset(utcOffset)
              .startOf('day')
              .weekday()
          ),
          (value) =>
            countBy(value, (subValue) =>
              moment(subValue['date'])
                .utcOffset(utcOffset)
                .startOf('hour')
            )
        );
        break;
      default:
        // Only set the key _iff_ there is data on at least one of the visits
        if (visits.some((visit) => visit[key]).length > 0) {
          obj[key] = countBy(visits, key);
        }
    }
    return obj;
  };
}

function stats(req, res) {
  const { slug, utcOffset = 0 } = req.query;

  getVisits(slug)
    .then((visits) => {
      const flattenedVisitData = visits.map((visit) => flatten(visit));

      const counts = [
        'ip',
        'date.date',
        'date.timeOfWeekday',
        'location.country',
        'location.region',
        'location.city',
        'location.zip',
        'userAgent.browser.name',
        'userAgent.os.name'
      ].reduce(formatData(flattenedVisitData, utcOffset), {});

      res.send(counts);
    })
    .catch((error) => {
      logger.error(error);
      res.status(500).send({ error: error.message || error });
    });
}

module.exports = stats;
