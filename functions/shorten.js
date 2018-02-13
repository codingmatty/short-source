const config = require('./config');
const { storeUrl } = require('./store');

const validUrlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www\.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w\-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[.!/\\\w]*))?)/;

module.exports = (req, res) => {
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
      res.send({ url: `${config.short}/${slug}` });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: error.message || error });
    });
};
