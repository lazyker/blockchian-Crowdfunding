'use strict';

const createService = require('./create.service');
const getService = require('./get.service');

module.exports = {
  list: getService.list,
  get: getService.get,
  create: createService.exec,
  me: getService.me,
};
