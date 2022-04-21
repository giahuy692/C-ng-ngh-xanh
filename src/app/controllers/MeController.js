const Product = require('../models/products');//Model product
const AccountModel = require('../models/accounts');//Model account
const Cart = require('../models/cart');//Model Cart 
const Order = require('../models/order');//Model Order
const bcrypt = require('bcryptjs');//Thư viện mã hóa
const passport = require('passport');//thư viện passport
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require("../../util/mongoose");


class MeController {
  profile(req, res, next) {
    //Gọi Model Order với phương thức find để lấy dữ liệu từ user
      Order.find ({user: req.user}, function(err, orders) {
        if (err) {
            return res.write('Error!');
        }
        var cart;
        //ForEach các items cart được lưu trong bảng order
        orders.forEach(function (order) { 
            //Khởi tạo biến cart với params: order.cart
            cart = new Cart(order.cart);
            
            //Lưu các 
            order.items = cart.generateArray(); 
        });
        res.render('user/profile',{
          _id:req.user._id,
          username: req.user.username,
          email: req.user.email ,
          phone: req.user.phone,
          fullname: req.user.fullname,
          address: req.user.address,
          roles: req.user.roles,
          avatar: req.user.avatar,
          orders: orders,
        });
      });
  }


    //login
    login(req,res,next) {
        res.render("login",{csrfToken: req.csrfToken()});
    }
    xlogin(req,res,next) {
        passport.authenticate('local',{
            successRedirect:'/me/profile',
            failureRedirect:'/me/login',
            failureFlash: true,
        })(req,res,next);
    }


    //register
    register(req,res,next){
      res.render("register",{csrfToken: req.csrfToken()});
    }
    
    //xregister
    async xRegister(req,res,next){
        //Lưu các giá trị từ req.body
        const { username, password, fullname, email, address, pswRepeat, phone } = req.body;
        
        //tạo biến errors với kiểu giá trị là array
        var errors = [];
    
        //Check required fields
        if(!username || !fullname || !email || !address || !password || !pswRepeat || !phone){
          errors.push({
            //thêm vào mảng errors với giá trị msg
            msg: ' Please fill in all fields'
          })
        }
    
        //kiểm tra nhập lại pass các giống không?
        if(password !== pswRepeat){
          //thêm vào mảng errors với giá trị msg
          errors.push({
            msg: 'Passwords do not match'
          })
        }
    
        //kiểm tra độ dài của pass đã nhập không được ít hơn 6 kí tự
        if(password.length < 6){
          //thêm vào mảng errors với giá trị msg
          errors.push({
            //thêm vào mảng errors với giá trị msg
            msg:'Password should be at least 6 characters'
          })
        }
    
        if(errors.length > 0){
          res.render('register',{
            errors,
            username, 
            password,
            fullname,
            email,
            address,
            pswRepeat,
            phone,
            csrfToken: req.csrfToken() // Bảo mật thông tin người dùng
          })
        }
        else{
          // validation passed
          AccountModel.findOne({username: username})
          .then(user => {
            //User exists(kiểm tra sự tồn tại của user)
            if(user){
              //thêm vào mảng errors với giá trị msg
              errors.push({msg: 'Username is already register'});
              res.render('register',{
                errors,
                username, 
                password,
                fullname,
                email,
                address,
                pswRepeat,
                phone,
                csrfToken: req.csrfToken()
              });
            }
            else{
              //khởi tạo biến newUser với AccountModel
                const newUser = new AccountModel({
                username, //(1)
                password,//(2)
                fullname,
                email,
                address,
                phone,
                });
              //Hash Password(mã hóa mật khẩu)
              bcrypt.genSalt(10,(err,salt) => 
              bcrypt.hash(newUser.password,salt,(err,hash) =>{
                if(err) throw err;
                //Set password to hashed 
                //dòng 130 -> (2) = mật khẩu đã mã hóa
                newUser.password = hash;
                //Save user
                newUser.save()
                .then(user => {
                  //lưu trữ mess vào flash để hiển thị lên client
                  req.flash('success_msg', 'You are now registerd a can login');
                  res.redirect('/me/login');
                })
                .catch(err => console.log(err))
              }))
            }
          });
        }
      }

    //logout
    logout(req,res,next){
        req.logout();
        req.flash('success_msg', ' You are logged out');
        res.redirect('/me/login'); 
    }

    //Add To Cart
    AddToCart(req,res,next){
      var productId = req.params.id;
      //Khởi tạo môi trường thực thi Cart
      var cart = new Cart(req.session.cart ? req.session.cart : {}); 

      Product.findById(productId,(err,product) => {
        if(err){
          return res.redirect('/'); //nếu lỗi chuyển hướng về trang chủ
        }
        //từ biến cart được khởi tạo ở dòng 159 gọi function add 
        cart.add(product,product.id); 

        //lưu sp vừa thêm và sesion
        req.session.cart = cart;

        //chuyển hướng về trang sản phẩm
        res.redirect('/product');
      });
    }

    productPlusCart(req, res, next) {
      var productId = req.params.id;

      //Khởi tạo môi trường thực thi Cart
      var cart = new Cart(req.session.cart ? req.session.cart : {});
       
        //từ biến cart được khởi tạo ở dòng 179 gọi function plusByOne 
       cart.plusByOne(productId);

       //lưu sp vừa thêm và sesion
      req.session.cart = cart;
       res.redirect ('/me/shopping-cart');
   };

    reduceCart(req, res, next) {
      var productId = req.params.id;

      //Khởi tạo môi trường thực thi Cart
      var cart = new Cart(req.session.cart ? req.session.cart : {});
      
      //từ biến cart được khởi tạo ở dòng 194 gọi function reduceByOne 
       cart.reduceByOne(productId);
      req.session.cart = cart;
       res.redirect ('/me/shopping-cart');
   };

   removeCart(req, res, next) {
    var productId = req.params.id;

    //Khởi tạo môi trường thực thi Cart
    var cart = new Cart(req.session.cart ? req.session.cart : {});
                   
    //từ biến cart được khởi tạo ở dòng 204 gọi function removeItem 
     cart.removeItem(productId);

    req.session.cart = cart;
    res.redirect ('/me/shopping-cart');
 };

    ShowCart(req,res,next){
      if(!req.session.cart){
        return res.render('shop/shopping-cart',{products: null});
      }
      var cart = new Cart(req.session.cart);

      //Render lên trang shopping-cart và chuyển 2 dữ liệu product và totalPrice
      res.render('shop/shopping-cart',{products: cart.generateArray(), totalPrice: cart.totalPrice});
    }

    checkout(req,res,next){
      if(!req.session.cart){
        return res.redirect('/me/shopping-cart');
      }

      //Khởi tạo môi trường thực thi Cart
      var cart = new Cart(req.session.cart);
      
      //Render lên trang checkout và chuyển 2 dữ liệu products và total
      res.render('shop/checkout',{total: cart.totalPrice, products: cart.generateArray(),csrfToken: req.csrfToken()});
    }

    //[POST] CHECKOUT
    xCheckout(req,res,next){
      //Khởi tạo môi trường thực thi Cart models
      var cart = new Cart(req.session.cart);

      //Khởi tạo môi trường thực thi Order models
      var order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        fullname: req.body.fullname,
        phone: req.body.phone,
      });

      //lưu các thông tin được khởi tạo từ order và lưu vào mongodb
      order.save(function(err, result) {
          //lưu mess vào flash hiển thị cho phía client biết
          req.flash('success', 'Successfully bought product!');

          //Xóa session.cart
          req.session.cart = null;

          //chuyển hướng về trang chủ 
          res.redirect('/');
      });
    }
}

module.exports = new MeController();
