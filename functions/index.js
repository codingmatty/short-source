const functions = require('firebase-functions');

const shorten = require('./handlers/shorten');
const sink = require('./handlers/sink');
const stats = require('./handlers/stats');

exports.ping = functions.https.onRequest((req, res) => {
  res.send('pong');
});

exports.shorten = functions.https.onRequest(shorten);
exports.sink = functions.https.onRequest(sink);
exports.stats = functions.https.onRequest(stats);
