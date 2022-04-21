const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth/auth');
const { notLoggedIn } = require('../config/function/function');//kiểm tra xem đã login chưa

const upload = require('../middleware/upload');

const userController = require('../app/controllers/UserController');

const csrf = require('csurf');
const csrfProtection = csrf();


//edit profile
router.get('/edit-profile/:id',csrfProtection,ensureAuthenticated,userController.editProfile);
router.post('/updateProfile/:id',upload.single('avatar'), userController.updateProfile);

// ChangePassword
router.get('/change-pasword/:id',csrfProtection,ensureAuthenticated,userController.showPassword);
router.post('/change-pasword/:id',userController.changePassword);

module.exports = router;
