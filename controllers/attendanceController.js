const { getAllattendances } = require("../services/attendanceService");

exports.getAllattendances = async (req, res) => {
    var result = await getAllattendances(req,res);
    res.send(result);
};