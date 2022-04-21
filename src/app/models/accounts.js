const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const users = new Schema({
  username: { type: String, default: '', unique: true, required: true},
  email: { type: String, default: ''},
  password: { type: String, default: '', required: true},
  phone: { type: String, default: ''},
  fullname: { type: String, default: ''},
  address: { type: String, default: ''},
  roles: {type: Boolean, default: false},
  avatar: {type: String, default:'uploads/th.jpg'},
  deleteAt: { type: Date, default: Date.now},
  action: { type: String, default: 'System'},
    
}, 
{ 
  collection: 'users' ,
  timestamps: true,
})

users.static.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
};

users.methods.isUser = () => {
  return (this.roles == "user");
}

users.methods.isAdmin = () => {
  return (this.roles == "admin");
}

module.exports = mongoose.model('users', users)