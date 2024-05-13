const { getAllEmails } = require("../services/login.service");
const { sendAllEmails, addUserReview, getAllUserReviews } = require("../services/promotionsServices");

exports.sendAllEmails = async (req, res) => {
    const emailList = await getAllEmails(); // List of email addresses
    const subject = req.body.subject; // Email subject
    const text = req.body.content;

    var result = await sendAllEmails(emailList, subject, text);
    res.send(result);
};


exports.saveReview = async (req, res) => {
    const result = await addUserReview(req, res);
    return (result);
};


exports.getAllUserReviews = async (req, res) => {
    const result = await getAllUserReviews(req, res);
    return (result);
};