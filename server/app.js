'use strict';

const express = require('./config/express');
const config = require('./config/environment');
const web3 = require('./web3');

const app = express();

require('./routes')(app);

setImmediate(() => {
  app.listen(config.port, config.ip, () => {
    console.log(`Express Server Listen on ${config.port}, in ${app.get('env')} mode`);
  });
});

module.exports = app;
