const express = require('express');
const { addNewPayment, getPaymentsByUserId } = require('../controllers/paymentsController');
const router = express.Router();

router.post('/addPayment', addNewPayment);
router.post('/getPayments', getPaymentsByUserId);

module.exports = router;