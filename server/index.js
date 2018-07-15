'use strict';

const { ENV } = require('./config/environment.constants');

const { DEVELOPMENT } = ENV;

process.env.NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

module.exports = require('./app');
