const { getAllEmails } = require("../services/login.service");
const { sendAllEmails } = require("../services/promotionsServices");

exports.sendAllEmails = async (req, res) => {
    const emailList = await getAllEmails(); // List of email addresses
    const subject = req.body.subject; // Email subject
    const text = req.body.content;

    var result = await sendAllEmails(emailList, subject, text);
    res.send(result);
};