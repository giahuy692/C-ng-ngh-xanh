const express               = require('express');
const router                = express.Router();
const formidable            = require('formidable');
const cookie                = require('cookie-parse');
const multipart             = require('connect-multiparty'); 

const { ensureAuthenticated } = require('../config/auth/auth');

// const multipartMiddleware = multipart();

 const adminController = require('../app/controllers/AdminController');

const upload = require('../middleware/upload');

const multipleUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 3 }])
// -------- Login ----------------
// router.get('/login',adminController.showLogin);

router.get('/private',(req,res,next) => {
    try {
        var token = req.cookies.token;
        var result = jwt.verify(token, 'mk');
        if (result) {
            next();
        }
    } 
    catch (error) {
        return res.redirect("/admin/login");
    }
}, (req,res,next) =>{
    res.json('wellcome')
});

//bill
router.get('/store-bill', adminController.showBill);
router.get('/cart-detail/:id', adminController.BillDetail);



router.get('/create', adminController.create);
router.post('/store', adminController.store);
router.get('/store-account', adminController.storeAccount);
router.get('/store-product', adminController.storeProduct);
router.get('/edit-product/:id', adminController.editProduct);
router.put('/upProduct/:id', adminController.updateProduct);
router.get('/edit-account/:id', adminController.editAccount);
router.put('/upAccount/:id', adminController.updateAccount);
router.delete('/deleteAccount/:id', adminController.deleteAccount);
router.delete('/:id', adminController.deleteProduct);
router.post('/store-products', multipleUpload, adminController.saveProducts)
//-------------------------------

router.get('/', ensureAuthenticated,adminController.show);

module.exports = router;
