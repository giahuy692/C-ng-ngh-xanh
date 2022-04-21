const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth/auth');
const { notLoggedIn } = require('../config/function/function');
const csrf = require('csurf');
const csrfProtection = csrf();//bảo mật thông tin 

const upload = require('../middleware/upload');

const meController = require('../app/controllers/MeController');

router.use(csrfProtection);


//Auth Routes
router.get("/login",csrfProtection,notLoggedIn,meController.login);
router.post("/login",meController.xlogin);

//Profile
router.get("/profile",ensureAuthenticated,meController.profile);

//logout
router.get("/logout",ensureAuthenticated,meController.logout);

//Register
router.get("/register",csrfProtection,notLoggedIn,meController.register);
router.post("/register",notLoggedIn,meController.xRegister);

//Add to cart
router.get("/add-to-cart/:id",meController.AddToCart);

//Plus cart
router.get("/plus-to-cart/:id",meController.productPlusCart);

//remote cart
router.get('/reduce/:id', meController.reduceCart);

router.get('/remove/:id', meController.removeCart);


//Shopping cart
router.get('/shopping-cart',meController.ShowCart);

//checkout
router.get('/checkout',csrfProtection,ensureAuthenticated,meController.checkout);
router.post('/checkout',ensureAuthenticated,meController.xCheckout);


module.exports = router;
