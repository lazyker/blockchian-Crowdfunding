'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const config = require('./environment');
const morgan = require('./morgan');
const bodyParser = require('body-parser');

module.exports = () => {
  const app = express();

  // EJS 뷰 설정
  app.set('views', path.join(config.root, 'views'));
  // app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'ejs');

  morgan(app);
  app.use(bodyParser.urlencoded({ extended: false, limit: '100mb' }));
  app.use(bodyParser.json());
  app.use(helmet());

  return app;
};
