const functions = require('firebase-functions');

const config = require('./config');

exports.ping = functions.https.onRequest((req, res) => {
  res.send('pong');
});

exports.sink = functions.https.onRequest((req, res) => {
  res.redirect(config.default);
});

exports.shorten = functions.https.onRequest((req, res) => {
  res.send({ ok: true });
});
