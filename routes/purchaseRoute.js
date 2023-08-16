const express = require('express');

const router = express.Router();

const purchaseController = require('../controller/purchase');

const purchaseAuthentication = require('../middleware/auth');

router.get('/premium-membership',purchaseAuthentication.authenticate,purchaseController.purchasepremium);

router.post('/update-transactionstatus', purchaseAuthentication.authenticate,purchaseController.updateTransactionStatus);


module.exports = router;
