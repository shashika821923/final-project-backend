const express = require('express');
const { sendAllEmails, saveReview, getAllUserReviews } = require('../controllers/promotions.controller');
const router = express.Router();

router.post('/promotionSend', sendAllEmails);
router.post('/addreview', saveReview);
router.post('/getAllReviews', getAllUserReviews);

module.exports = router;