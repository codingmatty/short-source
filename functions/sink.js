const geoip = require('geoip-lite');
const flatten = require('flat');
const uaParser = require('ua-parser-js');

const config = require('./config');
const { getUrl, recordVisit } = require('./store');

module.exports = (req, res) => {
  const path = req.path.slice(1);

  if (!path) {
    res.redirect(config.default);
    return;
  }

  getUrl(path)
    .then((url) => {
      const urlToRedirectTo = url || config.default;

      const ip = req.headers['x-forwarded-for']
        ? req.headers['x-forwarded-for'].split(',').shift()
        : req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          (req.connection.socket ? req.connection.socket.remoteAddress : null);
      const location = geoip.lookup(ip);

      const ua = req.headers['user-agent'];
      const userAgent = uaParser(ua);

      const visitData = {
        date: new Date(),
        ip,
        location,
        path,
        userAgent,
        url: urlToRedirectTo
      };
      const flattenedData = flatten(visitData);

      console.log('Data to Record: ', flattenedData);

      const recordData = {};
      Object.keys(flattenedData)
        .filter((key) => flattenedData[key])
        .forEach((key) => {
          recordData[key] = flattenedData[key];
        });

      recordVisit(flatten.unflatten(recordData));

      return urlToRedirectTo;
    })
    .then((url) => {
      res.redirect(url);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send({ error: error.message || error });
    });
};
