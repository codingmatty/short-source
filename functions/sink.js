const config = require('./config');
const { getUrl } = require('./store');

module.exports = (req, res) => {
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
};
