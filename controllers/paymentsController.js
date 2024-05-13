const { addNewPayment, getPaymentsByUserId, payedUsersList, notPaidUserEmails } = require("../services/paymentsServices");
const { sendPaymentreminder } = require("../services/promotionsServices");

exports.addNewPayment = async (req, res) => {
    var result = await addNewPayment(req, res);
    res.send(result);
};

exports.getPaymentsByUserId = async (req, res) => {
    var result = await getPaymentsByUserId(req, res);
    res.send(result);
};

exports.notifyPayments = async (req, res) => {
    var payedUsers = await payedUsersList(req, res);
    var notPaidUserEmail = await notPaidUserEmails(payedUsers);
    await sendPaymentreminder(req.body.year, req.body.month, notPaidUserEmail);
    res.send(true);
};

