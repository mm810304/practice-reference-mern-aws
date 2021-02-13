const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');
const { requireSignin, userAuth, adminAuth } = require('../middleware/authMiddleware');
const { userUpdateValidator } = require('../validators/authValidator');
const { runValidation } = require('../validators/validator');

router.get('/user', requireSignin, userAuth, userController.getUserInfo)

router.get('/admin', requireSignin, adminAuth, userController.getUserInfo);

router.put('/user', userUpdateValidator, runValidation, requireSignin, userAuth, userController.updateUser);




module.exports = router;