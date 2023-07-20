const express = require("express");

const router = express.Router();

const expenseController = require('../controller/expenses');
const userAuthentication = require('../middleware/auth');

router.post('/add-expense',userAuthentication.authenticate,expenseController.addExpense);

router.get('/get-expense',userAuthentication.authenticate, expenseController.getExpense);

router.delete('/delete-expense/:expenseId',expenseController.deleteExpense);


module.exports = router;