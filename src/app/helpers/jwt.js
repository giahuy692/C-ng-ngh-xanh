const expressJwt = require('express-jwt');
const config = require('../../config');

function authJwt(){
    const secret = config.SECRET;
    const api = config.API;

    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/,methods:['GET', 'OPTIONS']},
            `${api}/accounts/login`

        ]
    })
}

async function isRevoked(req, payload,done){
    done();
}

module.exports = authJwt;
