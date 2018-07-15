'use strict';

module.exports = (app) => {
  app.use('/main', require('./api/main'));
};
