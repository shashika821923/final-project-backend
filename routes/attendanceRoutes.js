const express = require('express');
const { getAllattendances } = require('../controllers/attendanceController');
const router = express.Router();

router.post('/getAllAttendance', getAllattendances);

module.exports = router;