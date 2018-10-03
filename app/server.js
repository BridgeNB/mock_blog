'use strict'
const express  = require('express');
const morgan   = require('morgan');
const mongoose = require('mongoose');

const { logInfo, logError, logSuccess } = require('./logger.js');
const { PORT, MONGO_URL, HTTP_STATUS_CODES} = require('./config.js');
const { postsRouter } = require('./post.router');

var app = express();
let expressServer = null;
mongoose.Promise = global.Promise;

/***  Use middleware */
// http request logger
app.use(morgan('[:date[web]] :method :url :status'));
// parses raw json request payloads
app.use(express.json());
// redirects calls to ./public folder
app.use(express.static('./public'));
app.use('/api/post', postsRouter);

/*** Route handling */

app.get('/api/echo', (request, response) => {
  response.status(HTTP_STATUS_CODES.OK).json({ data: 'no data', queryParams: request.query});
});
app.post('/api/echo', (request, response) => {
  response.status(HTTP_STATUS_CODES.OK).json({ data: 'no data', queryParams: request.query, body: request.body });
});

/*** Response to unhandled routes */
app.use('*', (request, response) => {
  response.status(HTTP_STATUS_CODES.NOT_FOUND).json({ data: 'unhandled route'});
});

module.exports = {
  startServer,
  closeServer,
  app
};

function startServer(mongoConnectionString = MONGO_URL) {
  return new Promise((resolve, reject) => {
    logInfo('Starting mongodb connection ...');
    mongoose.connect(mongoConnectionString, { useNewUrlParser: true }, err => {
      if (err) {
        logError(err);
        return reject(err);
      } else {
        logSuccess('Mongobd connection successful!')
        logInfo('Staring express server ...');
        expressServer = app.listen(PORT, () => {
          logSuccess(`Express server listening on http://localhost:${PORT}`);
          resolve();
        }).on('error', err => {
          logError(err);
          mongoose.disconnect();
          reject(err);
        });
      }
    });
  });
}

function closeServer() {
  return mongoose
    .disconnect()
    .then(() => new Promise((resolve, reject) => {
      logInfo('Closing express server ...');
      expressServer.close(err => {
        if (err) {
          logError(err);
          return reject(err);
        } else {
          logInfo('Express server stopped.');
          resolve();
        }
      });
    }));
}
