const functions = require('firebase-functions');
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({ origin: true });

const validateAuthentication = require('./helpers/authentication');
const sink = require('./handlers/sink');
const shorten = require('./handlers/shorten');
const stats = require('./handlers/stats');
const links = require('./handlers/links');

exports.ping = functions.https.onRequest((req, res) => {
  res.send('pong');
});

exports.sink = functions.https.onRequest(sink);
exports.shorten = functions.https.onRequest(generateExpressApp(shorten));
exports.stats = functions.https.onRequest(generateExpressApp(stats));
exports.links = functions.https.onRequest(generateExpressApp(links));

function generateExpressApp(handler) {
  const app = express();
  app.use(cors);
  app.use(cookieParser);
  app.use(validateAuthentication);
  app.use('/', handler);
  return app;
}
