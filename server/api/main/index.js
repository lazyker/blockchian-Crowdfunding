'use strict';

const express = require('express');
const controller = require('./main.controller');

const router = express.Router();

router.get('/', controller.list);
router.get('/get', controller.get);
router.post('/create', controller.create);
router.get('/me', controller.me);

module.exports = router;
