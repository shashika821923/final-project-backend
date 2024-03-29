const { insertUser, loginUser, getAllUsersList, getUserByUserId, updateUserInfo, deleteUser, getNewUsersList, acceptUserRequest } = require("../services/login.service");

exports.addNewUser = async (req, res) => {
    var result = await insertUser(req.body);
    res.send(result);
};

exports.loginUser = async (req, res) => {
    var result = await loginUser(req.body);
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
