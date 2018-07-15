'use strict';

const response = require('../../components/response');
const service = require('./service');

module.exports = {
  async list(req, res) {
    return service.list(req.query)
    .then((result) =>  {
      res.render('lazyker', result)
    });
  },

  async get(req, res) {
    return service.get(req.query)
      .then(response.respondWithOK(res))
      .catch(response.handleError(res))
  },

  async create(req, res) {
    return service.create(req.body)
      .then(response.respondWithNoContent(res))
      .catch(response.handleError(res))
  },

  async me(req, res) {
    return service.me(req.query)
      .then(response.respondWithOK(res))
      .catch(response.handleError(res))
  },
};
