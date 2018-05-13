const env = require('./env');

const logger = Object.assign({}, console);

if (env.isTest) {
  Object.keys(logger).forEach((key) => {
    logger[key] = () => {};
  });
}

module.exports = logger;
