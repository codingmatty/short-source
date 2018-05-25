const orderBy = require('lodash/orderBy');

const config = require('../config');
const { mapCountsToDataPoint } = require('../helpers/data');
const errors = require('../helpers/errors');
const initializeDb = require('../db/initialize');
const db = initializeDb();

function links(req, res) {
  const { utcOffset = 0, ...query } = req.query;

  return db
    .getLinks(query)
    .then((links) =>
      Promise.all(
        links.map((link) =>
          // Get Visits data for each link and add date count map
          db.getVisits(link.slug).then((visits) => ({
            ...link,
            data: mapCountsToDataPoint(['date'], visits, { utcOffset })
          }))
        )
      )
    )
    .then((links) =>
      // Order links and add url
      orderBy(links, ['createdAt'], ['desc']).map((link) => ({
        ...link,
        shortUrl: `${config.shortDomain}/${link.slug}`
      }))
    )
    .then((links) => {
      res.send({ links });
    })
    .catch(errors.handle(res));
}

module.exports = links;
