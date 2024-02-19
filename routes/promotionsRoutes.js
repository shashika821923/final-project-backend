const express = require('express');
const { sendAllEmails } = require('../controllers/promotions.controller');
const router = express.Router();

router.post('/promotionSend', sendAllEmails);

module.exports = router;