const { addEquipment, updateEquipment, deleteEquipment, getAllEquipments, getEquipmentById } = require("../services/equipmentsService");

exports.addEquipments = async (req, res) => {
    var result = await addEquipment(req, res);
    res.send(result);
};

exports.updateEquipments = async (req, res) => {
    var result = await updateEquipment(req, res);
    res.send(result);
};

exports.deleteEquipments = async (req, res) => {
    var result = await deleteEquipment(req, res);
    res.send(result);
};

exports.getAll = async (req, res) => {
    var result = await getAllEquipments(req, res);
    res.send(result);
};

exports.getEquipments = async (req, res) => {
    var result = await getEquipmentById(req.body.equipmentId);
    res.send(result);
};