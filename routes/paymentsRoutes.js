const express = require('express');
const { addNewPayment, getPaymentsByUserId, notifyPayments } = require('../controllers/paymentsController');
const router = express.Router();

router.post('/addPayment', addNewPayment);
router.post('/getPayments', getPaymentsByUserId);
router.post('/notifyPayments', notifyPayments);

module.exports = router;