const Product = require('../models/products');
const { mongooseToObject } = require('../../util/mongoose');

class ProductController {
  show(req, res, next) {
    Product.findOne({ slug: req.params.slug })
      .then((product) => {
        res.render('products/detail', { product: mongooseToObject(product) });
      })
      .catch(next);
  }
 
}

module.exports = new ProductController();
