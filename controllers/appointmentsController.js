const { addNewAppointment, getAllAppointments, getSelectedAppointment, updateAppointment, completeAppointment, approveAppointments, deleteAppointments } = require("../services/appointmentsService");

exports.addNewAppointment = async (req, res) => {
    var result = await addNewAppointment(req,res);
    res.send(result);
};

exports.getAllAppointments = async (req, res) => {
    var result = await getAllAppointments(req,res);
    res.send(result);
};

exports.getSelectedAppointment = async (req, res) => {
    var result = await getSelectedAppointment(req,res);
    res.send(result);
};

exports.updateAppointment = async (req, res) => {
    var result = await updateAppointment(req,res);
    res.send(result);
};

exports.completeAppointment = async (req, res) => {
    var result = await completeAppointment(req,res);
    res.send(result);
};

exports.approveAppointments = async (req, res) => {
    var result = await approveAppointments(req,res);
    res.send(result);
};

exports.deleteAppointments = async (req, res) => {
    var result = await deleteAppointments(req,res);
    res.send(result);
};