const express = require('express');
const passport              =  require("passport");
const passportLocal         = require("passport-local");
const bodyParser            =  require("body-parser");
const LocalStrategy   = require('passport-local').Strategy;
const passportLocalMongoose =  require("passport-local-mongoose");
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth/auth');
const { notLoggedIn } = require('../config/function/function');


const siteController = require('../app/controllers/SiteController');
// ------------------ Login
const UserController = require('../app/controllers/UserController');

router.get('/product', siteController.product);
router.get('/gioithieu', siteController.gioithieu);
router.get('/search', siteController.search);
router.get('/', siteController.home);


module.exports = router;


  