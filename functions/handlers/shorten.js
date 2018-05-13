const config = require('../config');
const errors = require('../helpers/errors');
const initializeDb = require('../db/initialize');
const db = initializeDb();

const validUrlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/;

function shorten(req, res) {
  const { body = {}, query = {} } = req;
  const url = body.url || query.url;

  if (!url || !validUrlRegex.test(url)) {
    res
      .status(400)
      .send({ error: 'You must send a valid url to be shortened.' });
    return Promise.resolve();
  }

  return db
    .storeUrl(url)
    .then(({ slug }) => {
      res.send({ url: `${config.shortDomain}/${slug}` });
    })
    .catch(errors.handle(res));
}

module.exports = shorten;
