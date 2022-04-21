// Using Node.js `require()`
const mongoose = require('mongoose');

async function connect() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Cong_Nghe_Xanh_dev');
    console.log('Connect successfully!!');
  } catch (error) {
    console.log('Connect failure!!');
  }
}

module.exports = { connect };
