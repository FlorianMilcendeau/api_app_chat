const express = require('express');

const router = express.Router();
const authenticate = require('../controllers/authenticate');
const user = require('../controllers/user');
const channel = require('../controllers/channel');

/* Route authentication. */
router.use('/auth', authenticate);

/** Route user */
router.use('/user', user);

/** Route channel */
router.use('/channels', channel);

module.exports = router;
