const geoip = require('geoip-lite');
const flatten = require('flat');
const uaParser = require('ua-parser-js');

const config = require('./config');
const { getUrl, recordVisit } = require('./store');

module.exports = (req, res) => {
  req.app.enable('trust proxy'); // For the IP
  const path = req.path.slice(1);

  if (!path) {
    res.redirect(config.default);
    return;
  }

  getUrl(path)
    .then(url => {
      const urlToRedirectTo = url || config.default;
      res.redirect(urlToRedirectTo);
      return urlToRedirectTo;
    })
    .then(urlToRedirectTo => {
      const { query, ip } = req;
      const location = geoip.lookup(ip);

      const ua = req.headers['user-agent'];
      const userAgent = uaParser(ua);

      const visitData = {
        date: new Date(),
        ip,
        location,
        path,
        query,
        url: urlToRedirectTo,
        userAgent
      };
      const flattenedData = flatten(visitData);

      console.log('Data to Record: ', flattenedData);

      const recordData = flatten.unflatten(
        Object.keys(flattenedData).reduce((obj, key) => {
          if (flattenedData[key]) {
            obj[key] = flattenedData[key];
          }
          return obj;
        }, {})
      );

      recordVisit(recordData);
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ error: error.message || error });
    });
};
