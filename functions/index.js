const functions = require('firebase-functions');

const shorten = require('./shorten');
const sink = require('./sink');

exports.ping = functions.https.onRequest((req, res) => {
  res.send('pong');
});

exports.shorten = functions.https.onRequest(shorten);
exports.sink = functions.https.onRequest(sink);
