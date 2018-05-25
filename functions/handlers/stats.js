const logger = require('../helpers/logger');
const { mapCountsToDataPoint } = require('../helpers/data');
const initializeDb = require('../db/initialize');
const { getVisits } = initializeDb();

function stats(req, res) {
  const { slug, utcOffset = 0 } = req.query;

  getVisits(slug)
    .then((visits) => {
      const countMap = mapCountsToDataPoint(
        [
          'ip',
          'date',
          'timeOfWeekday',
          'location.country',
          'location.region',
          'location.city',
          'location.zip',
          'userAgent.browser.name',
          'userAgent.os.name'
        ],
        visits,
        { utcOffset }
      );

      res.send(countMap);
    })
    .catch((error) => {
      logger.error(error);
      res.status(500).send({ error: error.message || error });
    });
}

module.exports = stats;
