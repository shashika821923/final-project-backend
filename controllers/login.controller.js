const { insertUser, loginUser, getAllUsersList, getUserByUserId, updateUserInfo, deleteUser, getNewUsersList, acceptUserRequest, updateMealPlan, resetPassword } = require("../services/login.service");
const { sendAllEmails, sendAllLogEmails } = require("../services/promotionsServices");

exports.addNewUser = async (req, res) => {
    var result = await insertUser(req.body);
    result.statusCode == 200 && sendAllLogEmails([req.body.email], 'Registration Successfull', "You registration is succesfull and now your account is in approval pending status")
    res.send(result);
};

exports.loginUser = async (req, res) => {
    var result = await loginUser(req, res);
    res.send(result);
};

exports.getUsersList = async (req, res) => {
    var result = await getAllUsersList(req.body);
    res.send(result);
};

exports.getUser = async (req, res) => {
    var result = await getUserByUserId(req.body.userID);
    res.send(result);
};

exports.updateuser = async (req, res) => {
    var result = await updateUserInfo(req.body);
    res.send(result);
};

exports.deleteUser = async (req, res) => {
    var result = await deleteUser(req.body.userID);
    res.send(result);
};

exports.getNewUsersList = async (req, res) => {
    var result = await getNewUsersList(req.body);
    res.send(result);
};

exports.acceptUser = async (req, res) => {
    var result = await acceptUserRequest(req.body.userID);
    res.send(result);
};

exports.regenerateMealPlan = async (req, res) => {
    var result = await updateMealPlan(req.body.userID);
    res.send(result);
};

exports.resetPassword = async (req, res) => {
    var result = await resetPassword(req.body);
    await sendAllLogEmails([req.body.email], 'Password resetted', `Your Account password resetted successfully. your new password is ${result.message}`)
    res.send(result);
};