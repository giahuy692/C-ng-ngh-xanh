const userRouter = require('./user');
const meRouter = require('./me');
const adminRouter = require('./admin');
const productRouter = require('./products');
const siteRouter = require('./site');


function route(app) {
  // -> routes/admin
  app.use('/admin', adminRouter);

  // -> routes/user
  app.use('/user', userRouter);

  // -> routes/me
  app.use('/me', meRouter);

  // -> routes/products
  app.use('/products', productRouter);

  // -> routes/site
  app.use('/', siteRouter);
}

module.exports = route;
