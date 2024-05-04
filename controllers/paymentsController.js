const { addNewPayment, getPaymentsByUserId } = require("../services/paymentsServices");

exports.addNewPayment = async (req, res) => {
    var result = await addNewPayment(req, res);
    res.send(result);
};

exports.getPaymentsByUserId = async (req, res) => {
    var result = await getPaymentsByUserId(req, res);
    res.send(result);
};

