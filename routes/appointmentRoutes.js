const express = require('express');
const { addNewAppointment, getAllAppointments, getSelectedAppointment, updateAppointment, completeAppointment, approveAppointments, deleteAppointments } 
= require('../controllers/appointmentsController');
const router = express.Router();


router.post('/addAppointment', addNewAppointment);
router.post('/getAllAppointments', getAllAppointments);
router.post('/getAppointment', getSelectedAppointment);
router.post('/updateAppointment', updateAppointment);

router.post('/completeAppointment', completeAppointment);
router.post('/approveAppointment', approveAppointments);
router.post('/deleteAppointment', deleteAppointments);

module.exports = router;