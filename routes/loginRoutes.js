const express = require('express');
const { addNewUser, loginUser, getUsersList, getUser, updateuser, deleteUser, getNewUsersList, acceptUser, regenerateMealPlan, resetPassword } = require('../controllers/login.controller');
const router = express.Router();


router.post('/addNewUser', addNewUser);
router.post('/login', loginUser);
router.post('/allUsers', getUsersList);
router.post('/getUser', getUser);
router.post('/updateUser', updateuser);
router.post('/deleteUser', deleteUser);
router.post('/newMembersList', getNewUsersList);
router.post('/acceptUser', acceptUser);
router.post('/reGenerate', regenerateMealPlan);
router.post('/resetPassword', resetPassword);

module.exports = router;