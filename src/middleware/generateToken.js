const jwt = require('jsonwebtoken'); 
const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'


const ganerateToken = (id) => {
    return jwt.sign({id}, JWT_SECRET,
        {expiresIn:"1h"});
  };

  module.exports = ganerateToken;