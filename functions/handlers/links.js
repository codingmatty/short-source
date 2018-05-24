const sortBy = require('lodash/sortBy');
const config = require('../config');
const errors = require('../helpers/errors');
const initializeDb = require('../db/initialize');
const db = initializeDb();

function links(req, res) {
  return db
    .getLinks(req.query)
    .then((links) => {
      res.send({
        links: sortBy(links, ({ createdAt }) => -createdAt).map((link) => ({
          shortUrl: `${config.shortDomain}/${link.slug}`,
          ...link
        }))
      });
    })
    .catch(errors.handle(res));
}

module.exports = links;
