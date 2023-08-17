const express = require('express');

const premiumFeatureController = require('../controller/premiumFeature');

const premiumAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/showLeaderBoard',premiumAuthentication.authenticate,premiumFeatureController.getUserLeaderBoard);

module.exports = router;