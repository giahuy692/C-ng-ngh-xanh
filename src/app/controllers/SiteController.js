const Product = require('../models/products');
const { mutipleMongooseToObject } = require('../../util/mongoose');

class SiteController {
  home(req, res, next) {
    
      //select * from cho models product bằng mongodb
      Product.find({category: "Máy nước nóng"})
      .limit(4)//giới hạn sản phẩm được hiển thị  
      .then((productD1) => { //Bắt dữ liệu từ dòng 8
        Product.find({category: "Máy lọc nước"})
        .limit(4)//giới hạn sản phẩm được hiển thị  
        .then((product) => {//Bắt dữ liệu từ dòng 11
          res.render('index', {
            //truyền 2 dữ liệu bắt được ở trên qua html index
            product: mutipleMongooseToObject(product),
            productD1: mutipleMongooseToObject(productD1),
          });
        })
        .catch(next)
      })
      .catch(next)
  }

  


  gioithieu(req, res) {
    res.render('gioithieu');
  }

  product(req, res, next) {
    var sort = req.body.sort = req.query.sort; //sắp xếp
    var page = req.query.page;//trang
    const perPage  = 6 //số sản phẩm được hiển thị trên 1 trang
    if(page){
      page = parseInt(page)//chuyển string sang int
      if(page < 1){
        page = 1
      }
      Product.find({})//select * from product  
      .limit(perPage  * 1)//giới hạn sản phẩm được hiển thị 
      .skip((page - 1) * perPage )//bỏ qua bn sản phẩm
      .sort({price:sort})//sắp xếp tăng dần hoặc giảm dần
      .then((product) => {
        //Đếm tổng số sản phẩm hiện có trong database
        Product.countDocuments({}).then((total) => {
          //ceil: làm tron lên, ví dụ: 2.87 -> 3
          var totalPage = Math.ceil(total / perPage );
          //render và chuyền tham dữ liệu qua trang produc để hiển thị
          res.render('product', {
            product: mutipleMongooseToObject(product),
            totalPage: totalPage,
            current: page,
            sort:sort
          });
        })
        
      })
      .catch(next);
    }
    else if(sort){
      sort = parseInt(sort)//chuyển string sang int
      if(sort == 0){
        sort = 1;
      }
      else if(sort > 1)
      {
        sort = 1;
      }
      else if(sort < -1){
        sort = -1;
      }
      Product.find({})
      .limit(perPage  * 1)
      .skip((page - 1) * perPage )
      .sort({price: sort})
      .then((product) => {
        Product.countDocuments({}).then((total) => {
          var totalPage = Math.ceil(total / perPage );
          res.render('product', {
            product: mutipleMongooseToObject(product),
            totalPage: totalPage,
            current: page,
            sort:sort
          });
        })
        
      })
      .catch(next);
    }
    else
    {
      Product.find({})
      .limit(perPage * 1)
      .skip((1 - 1) * perPage)
      .sort({price: 1})
      .then((product) => {
        res.render('product', {
          product: mutipleMongooseToObject(product),
        });
      })
      .catch(next);
    }
  }

  


  search(req,res,next) {
    var str = req.query.key;
    //Tìm kiếm dữ liệu trong database theo key
    Product.find({name: { $regex: str, $options: 'i' }})
      .then((product) => {
        res.render('search', {
          product: mutipleMongooseToObject(product),
        });
      })
      .catch(next);
  }


}

module.exports = new SiteController();
