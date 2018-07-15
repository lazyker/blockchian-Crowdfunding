'use strict';

const response = require('../../components/response');
const service = require('./service');

module.exports = {
  async create(req, res) {
    return service.create(body)
      .then(response.respondWithOK(res))
      .catch(response.handleError(res))
  }


};
