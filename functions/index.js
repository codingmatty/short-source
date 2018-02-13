const functions = require('firebase-functions');

const config = require('./config');
const { storeUrl, getUrl } = require('./store');

exports.ping = functions.https.onRequest((req, res) => {
  res.send('pong');
});

exports.sink = functions.https.onRequest((req, res) => {
  const path = req.path.slice(1);

  if (!path) {
    res.redirect(config.default);
    return;
  }

  getUrl(path)
    .then((url) => {
      res.redirect(url || config.default);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: error.message || error });
    });
});

const validUrlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/;

exports.shorten = functions.https.onRequest((req, res) => {
  const { body, query } = req;
  let url = body.url || query.url;

  if (!url || !validUrlRegex.test(url)) {
    res
      .status(400)
      .send({ error: 'You must send a valid url to be shortened.' });
    return;
  }

  storeUrl(url)
    .then(({ slug }) => {
      console.log();
      res.send({ url: `${config.short}/${slug}` });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: error.message || error });
    });
});
