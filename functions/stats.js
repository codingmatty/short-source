const geoip = require('geoip-lite');
const flatten = require('flat');
const moment = require('moment');
const countBy = require('lodash/countBy');
const groupBy = require('lodash/groupBy');
const mapValues = require('lodash/mapValues');
const uaParser = require('ua-parser-js');

const config = require('./config');
const { getVisits } = require('./store');

module.exports = (req, res) => {
  const { slug, utcOffset = 0 } = req.query;

  getVisits(slug)
    .then((visits) => {
      const data = visits.map((visit) => flatten(visit));

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
      ].reduce((obj, key) => {
        switch (key) {
          case 'date.date':
            obj[key] = countBy(data, (value) =>
              moment(value['date'])
                .utcOffset(utcOffset)
                .startOf('day')
            );
            break;
          case 'date.timeOfWeekday':
            obj[key] = mapValues(
              groupBy(data, (value) =>
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
            obj[key] = countBy(data, key);
        }
        return obj;
      }, {});

      res.send(counts);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: error.message || error });
    });
};
