const path = require('path');
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const multipart = require('connect-multiparty'); //upload
const flash = require('connect-flash');//login
const session = require('express-session');//login,register,cart
const errorHandler = require('./app/helpers/eror-handler');
const passport = require('passport');//login,register
const MongoDBStore = require('connect-mongodb-session')(session);//cart
const validator = require('express-validator');
const bodyParser = require('body-parser');

// const multipartMiddleware = multipart();
const app = express();
const port = 3000;

//Passport config
require('./config/passport/passport')(passport);

const route = require('./routes');

const db = require('./config/db');
const { store } = require('./app/controllers/AdminController');
const mongoose = require('./util/mongoose');

db.connect();

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded ({ extended: false }));
app.use(cookieParser());
app.use(require('cookie-parser')());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('./middleware/uploads',express.static('uploads'));
app.use('./middleware/expressFileupload',express.static('expressFileupload'));
// app.use(authJWT());
app.use(errorHandler);
app.use(methodOverride('_method'))

app.use(morgan('combined'));

app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));


//Session
app.use(session({
  secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
  resave: false,
  saveUninitialized: false,
  store: new MongoDBStore({
    mongooseConnection: mongoose.connection//  cart
  }),
  cookie: { maxAge: 60 * 60 * 1000 } // 1 hour, cart
}))


//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//flash
app.use(flash());

//Global Vars/// cart,login,register msg
app.use((req,res,next) => {
  res.locals.session = req.session;
  res.locals.login = req.isAuthenticated();
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user;
  next();
});

app.use('/upload', express.static('uploads'))

app.engine(
  '.hbs',
  exphbs.engine({ 
    extname: '.hbs',
    helpers: {
      sum: (a, b) => a + b,
      isdefined: (value) => value !== undefined,
      isnull: (value) => value !== null,
    }
  })
);

// Route init
route(app);

// app.post('/upload',multipartMiddleware, (req,res,next) => {
//   try {
//     fs.readFile(req.files.upload.path, function (err, data) {
//         var newPath = __dirname + '/public/images/description' + req.files.upload.name;
//         fs.writeFile(newPath, data, function (err) {
//             if (err) console.log({err: err});
//             else {
//                 console.log(req.files.upload.originalFilename);
//             //     imgl = '/images/req.files.upload.originalFilename';
//             //     let img = "<script>window.parent.CKEDITOR.tools.callFunction('','"+imgl+"','ok');</script>";
//             //    res.status(201).send(img);
             
//                 let fileName = req.files.upload.name;
//                 let url = '/images/description'+fileName;                    
//                 let msg = 'Upload successfully';
//                 let funcNum = req.query.CKEditorFuncNum;
//                 console.log({url,msg,funcNum});
               
//                 res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('"+funcNum+"','"+url+"','"+msg+"');</script>");
//             }
//         });
//     });
//    } catch (error) {
//        console.log(error.message);
//    }
// });



app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
