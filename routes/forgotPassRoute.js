const express = require('express')

const router = express.Router();

const forgotPassController = require('../controller/forgotPassword');

router.post('/forgot-password',forgotPassController.forgotPass)

module.exports = router;