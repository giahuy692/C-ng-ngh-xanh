const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


const Order = new Schema({
  user: {type: Schema.Types.ObjectId, ref:'users'},
  cart: {type: Object,required: true},
  address: {type: String, required: true},
  phone: { type: String, required: true},
  fullname: {type:String, required: true}
}, 
{ 
  collection: 'Order ' ,
  timestamps: true,
})

module.exports = mongoose.model('Order', Order)