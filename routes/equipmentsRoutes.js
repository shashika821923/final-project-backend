const express = require('express');
const { deleteEquipments, updateEquipments, addEquipments, getAll, getEquipments } = require('../controllers/equipmentsController');
const router = express.Router();

router.post('/addEquipment', addEquipments);
router.post('/updateEquipment', updateEquipments);
router.post('/deleteEquipment', deleteEquipments);
router.post('/getAll', getAll);
router.post('/getEquipment', getEquipments);

module.exports = router;