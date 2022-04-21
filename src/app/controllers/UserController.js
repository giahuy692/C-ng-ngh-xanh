const Product = require('../models/products');
const AccountModel = require('../models/accounts');
const Cart = require('../models/cart');
const Order = require('../models/order');
const { mutipleMongooseToObject } = require('../../util/mongoose');
const { config } = require('dotenv');
const bcrypt = require('bcryptjs');
const { mongooseToObject } = require("../../util/mongoose");


class UserController {

    //[GET] Edit Profile 
    editProfile(req,res,next) {
      //SELECT theo id
      AccountModel.findById(req.params.id)
      //Bắt dữ liệu tìm được 
			.then((user) =>
				res.render("user/edit-profile", 
        //truyền dữ liệu vừa tìm được qua HTML
        {user: mongooseToObject(user),roles: req.user.roles})
			)
			.catch(next);
    }

    //[POST] Edit Profile
    updateProfile(req,res,next){
        const update = { 
            fullname:req.body.fullname,
            email:req.body.email,
            address:req.body.address,
            phone:req.body.phone,
            avatar:req.body.avatar = req.file.path.split('\\').slice(4).join('/'),
        };

      AccountModel.updateOne({ _id: req.params.id }, update)
			.then(() => res.redirect("/me/profile"))
			.catch(next);
    }


    showPassword(req,res,next){
      //SELECT theo id
      AccountModel.findById(req.params.id)
      //Bắt dữ liệu tìm được 
			.then((user) =>
				res.render("user/change-password", 
        //truyền dữ liệu vừa tìm được qua HTML
        {user: mongooseToObject(user),roles: req.user.roles})
			)
			.catch(next);
    }

    async changePassword(req,res,next){
      console.log('Id :' + req.params.id)
      var userId = req.params.id;
      var session_user = req.session.passport.user;
      console.log('session_user :' + session_user)
      if(session_user){
        var old_password = req.body.oldPassword;
        var new_password = req.body.newPassword;
        var comfirm_password = req.body.pswRepeat;
        AccountModel.findOne({_id: userId})
        .then((user) => {
          if(user != null){
            var hash = user.password;
            //Kiểm dữ liệu nhập vào với dữ liệu nhận được từ client qua thư viên bcrypt
            bcrypt.compare(old_password,hash,function(err,result){
              if(result){
                if(new_password == comfirm_password){
                  //Mã hóa password
                  bcrypt.genSalt(10,(err,salt) => 
                  bcrypt.hash(new_password,salt,(err,hashNewPassword) =>{
                      if(err) throw err;
                        const update = {
                          password: hashNewPassword,
                        };
                        //Update dữ liệu vào models account
                        AccountModel.updateOne({ _id: userId }, update)
                        .then(() => res.redirect("/me/profile"))
                        .catch(next);
                      })
                    )
                }
              }
            })
          }
        })
        .catch(err => console.log(err));
      }
    }
}

module.exports = new UserController();