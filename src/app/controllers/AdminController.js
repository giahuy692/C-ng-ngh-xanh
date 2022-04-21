const path = require('path');
const ProductModel = require("../models/products");
const AccountModel = require("../models/accounts");
const Cart = require('../models/cart');
const OrderModel = require("../models/order");
const { mutipleMongooseToObject } = require("../../util/mongoose");
const { mongooseToObject } = require("../../util/mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

class AdminController {
	show(req, res, next) {
		console.log(req.user.avatar);
		res.locals.avatar = req.user.avatar;
		if(req.user.roles === true){
			res.render("dashboard",{
				avatar: req.user.avatar,
				roles: req.user.roles,
			});
		}
		else{
			res.redirect('/');
		}
	}

	//[GET] /products/store_products
	create(req, res, next) {
		res.render("admin/create");
	}

	store(req, res, next) {
		res.send(req.body);
	}

	editProduct(req, res, next) {
		ProductModel.findById(req.params.id)
			.then((product) =>
				res.render("admin/edit-product", {
					product: mongooseToObject(product),
				})
			)
			.catch(next);
	}

	


	//[POST] /admin/store_products
	saveProducts(req, res, next) {
		const product = new ProductModel({
			name: req.body.name,
			category: req.body.category,
			price: req.body.price,
			description: req.body.description,
			digital: req.body.digital,
			tutorial: req.body.tutorial,
			avatar: req.body.avatar = req.files.avatar[0].path.split('\\').slice(4).join('/'),
			galleryItem1: req.body.galleryItem1 = req.files.gallery[0].path.split('\\').slice(4).join('/'),
			galleryItem2: req.body.galleryItem2 = req.files.gallery[1].path.split('\\').slice(4).join('/'),
			galleryItem3: req.body.galleryItem3 = req.files.gallery[2].path.split('\\').slice(4).join('/'),
		})

		if(req.files){
			req.body.avatar = req.files.avatar[0].path.split('\\').slice(4).join('/'),
			req.body.galleryItem1 = req.files.gallery[0].path.split('\\').slice(4).join('/'),
			req.body.galleryItem2 = req.files.gallery[1].path.split('\\').slice(4).join('/'),
			req.body.galleryItem3 = req.files.gallery[2].path.split('\\').slice(4).join('/')
		}
		
		product
			.save()
			.then((product) => res.redirect("/admin/store-product"))
			.catch((error) => {});
	}

	storeProduct(req, res, next) {
		ProductModel.find({})
		.then((product) =>
		res.render("admin/store-product", {
			product: mutipleMongooseToObject(product),
		})
		)
		.catch(next);
	}

	

	//[PUT] /admin/:id
	updateProduct(req, res, next) {
		ProductModel.updateOne({ _id: req.params.id }, req.body)
			.then(() => res.redirect("/admin/store-product"))
			.catch(next);
	}


	//[delete] /admin/:id
	deleteProduct(req, res, next) {
		ProductModel.deleteOne({ _id: req.params.id })
			.then(() => res.redirect("back"))
			.catch(next);
	}

	// showLogin(req,res,next){
	// 	res.render("./login");
	// }

	storeAccount(req, res, next) {
		AccountModel.find({}) 
		.then((account) =>
		res.render("admin/store-account", {
			account: mutipleMongooseToObject(account),
		})
		)
		.catch(next);
	}


	editAccount(req, res, next) {
		AccountModel.findById(req.params.id)
			.then((account) =>
				res.render("admin/edit-account",{
					account: mongooseToObject(account),
				})
			)
			.catch(next);
	}

	//[Delete] 
	deleteAccount(req,res,next){
		AccountModel.deleteOne({ _id: req.params.id })
			.then(() => res.redirect("back"))
			.catch(next);
	}




	async updateAccount(req, res, next) {
		try {
			var id = req.params.id;
			var roles = req.body.roles;
			if(roles === 'admin')
			{
				roles = true;
			}
			else{
				roles = false;
			}
			//Mã hóa                               
			const newPassword = await bcrypt.hash(req.body.changePassword,10);
			await AccountModel.updateOne({_id: id},
				{password: newPassword,roles: roles},
			).then(() => res.redirect("/admin/store-account"))
			.catch(next);
		}
		catch (err){
			return res.status(400).json({status:false,err:"Error Occured"})
		}
	}

	//[GET] SHOW BILL
	showBill(req,res,next){
		OrderModel.find({})
		.then((order) =>
		res.render("admin/list-bill", {
			order: mutipleMongooseToObject(order), 
		})
		)
		.catch(next);
	}

	BillDetail(req,res,next){
		OrderModel.findById({ _id: req.params.id }, function(err, orders) {
			if (err) {
				return res.write('Error!');
			}
			// var cart;
			// orders.forEach(function (order) {
			// 	cart = new Cart(order.cart);
			// 	order.items = cart.generateArray();
			// });
			res.render('admin/DetailBill',{
				orders: mongooseToObject(orders),
			});
		  });
	}

}

module.exports = new AdminController();
