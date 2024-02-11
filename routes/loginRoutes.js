const express = require('express');
const { addNewUser, loginUser, getUsersList, getUser, updateuser, deleteUser, getNewUsersList, acceptUser } = require('../controllers/login.controller');
const router = express.Router();


router.post('/addNewUser', addNewUser);
router.post('/login', loginUser);
router.post('/allUsers', getUsersList);
router.post('/getUser', getUser);
router.post('/updateUser', updateuser);
router.post('/deleteUser', deleteUser);
router.post('/newMembersList', getNewUsersList);
router.post('/acceptUser', acceptUser);


module.exports = router;