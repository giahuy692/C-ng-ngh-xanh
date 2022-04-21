// Using Node.js `require()`
const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');

mongoose.plugin(slug);

const Schema = mongoose.Schema;

const Product = new Schema({
  name: { 
    type: String, 
    required: true
  },
  category: { 
    type: String , 
    required: true
  },
  price: { 
    type: Number, 
    default: 0 
  },
  description: { 
    type: String
  },
  digital: { 
    type: String
  },
  tutorial: { 
    type: String
  },
  slug: { 
    type: String,
    slug: "name", 
    unique: true 
  },
  avatar: {
    type: String
  },
  galleryItem1:{
    type: String
  },
  galleryItem2:{
    type: String
  },
  galleryItem3:{
    type: String
  },
},{
  timestamps: true,
});

module.exports = mongoose.model('Product', Product);
