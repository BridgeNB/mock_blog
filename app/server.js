'use strict'
const express = require('express');
const morgan  = require('morgan');

const { logInfo, logError, logSuccess } = require('./logger.js');
const { PORT, HTTP_STATUS_CODES} = require('./config.js');

var app = express();
let expressServer = null;

/***  Use middleware */
// http request logger
app.use(morgan('[:date[web]] :method :url :status'));
// parses raw json request payloads
app.use(express.json());
// redirects calls to ./public folder
app.use(express.static('./public'))

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

function startServer() {
  return new Promise((resolve, reject) => {
    logInfo('Starting express server ...');
    expressServer = app.listen(PORT, () => {
      logSuccess(`Express server listening on http://localhost:${PORT}`);
      resolve();
    }).on('error', err => {
      logError(err);
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
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
  });
}
