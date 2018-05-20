const config = require('../config');
const errors = require('../helpers/errors');
const initializeDb = require('../db/initialize');
const db = initializeDb();

function links(req, res) {
  return db
    .getLinks(req.query)
    .then((links) => {
      res.send({ links });
    })
    .catch(errors.handle(res));
}

module.exports = links;