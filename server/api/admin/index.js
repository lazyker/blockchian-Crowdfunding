'use strict';

const express = require('express');
const controller = require('./admin.controller');

const router = express.Router();

router.post('/create', controller.create);

module.exports = router;
