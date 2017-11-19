var config = require('../config.json');
var jwt = require('jsonwebtoken');
var secret = config.jwt_secret;
var bcrypt = require('bcrypt');
var Business = require('mongoose').model('Business');

var verifyToken = function (req, res, next) {
    var authorization = req.headers.authorization;

    // header 没有验证信息
    if(!authorization){
        res.status(400).json({error: 'Authorization Info not found'});
        return;
    }

    var token = authorization.split(' ')[1];
    var decoded = jwt.verify(token, secret);

    // token 解密失败
    if(!decoded) {
        res.status(400).json({error: 'Authorization Info not verified'});
        return;
    }
    next();
}

var generateToken = function(email, password, callback) {

    Business.findOne({'email': email}, (err, business)=>{
        // mongodb 连接失败
        if(err) {
            console.log('mongodb connection err');
            callback(null);
            return;
        }

        // 用户不存在
        if(!business) {
            console.log('business not found');
            callback(null);
            return;
        }

        bcrypt.compare(password, business.password, (err, isMatch) => {
            // 数据库连接失败
            if(err) {
                console.log('compare error');
                callback(null);
                return;
            }
            // 用户密码不符
            if(!isMatch) { 
                console.log('doesn\'t match');
                callback(null);
                return;
            }
            
            var payload = {
                sub: business._id,
                email: business.email
            };

            var token = jwt.sign(payload, secret);
            console.log('token: ' + token);

            callback(business._id, token);
            return;
        });
    });
}

module.exports = {
    verifyToken,
    generateToken
}