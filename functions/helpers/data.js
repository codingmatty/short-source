const get = require('lodash/get');
const countBy = require('lodash/countBy');
const groupBy = require('lodash/groupBy');
const mapValues = require('lodash/mapValues');
const moment = require('moment');

function formatVisitsData(visits, utcOffset) {
  return (obj, key, index) => {
    switch (key) {
      case 'date':
        obj[key] = countBy(visits, (value) =>
          moment(value['date'])
            .utcOffset(utcOffset)
            .startOf('day')
            .toLocaleString()
        );
        break;
      case 'timeOfWeekday':
        obj[key] = mapValues(
          groupBy(visits, (value) =>
            moment(value['date'])
              .utcOffset(utcOffset)
              .startOf('day')
              .weekday()
          ),
          (value) => ({
            total: value.length,
            ...countBy(value, (subValue) =>
              moment(subValue['date'])
                .utcOffset(utcOffset)
                .startOf('hour')
                .toLocaleString()
            )
          })
        );
        break;
      default:
        // Only set the key _iff_ there is data on at least one of the visits
        if (visits.some((visit) => get(visit, key))) {
          obj[key] = countBy(visits, key);
        }
    }
    return obj;
  };
}

function mapCountsToDataPoint(dataPoints, visits, { utcOffset }) {
  return dataPoints.reduce(formatVisitsData(visits, utcOffset), {});
}

exports.mapCountsToDataPoint = mapCountsToDataPoint;
