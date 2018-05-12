const env = require('./env');
const logger = require('./logger');

exports.handle = (res) => (error) => {
  logger.error(error);
  if (env.isDev) {
    res.status(500).send({ error: error.message || error });
  }
};
