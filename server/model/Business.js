var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = new mongoose.Schema({
    name: String,
    email:{
        type: String,
        index: {unique: true}
    },
    image: String,
    phone: String,
    password: String,
    introduction: String,
    addition: String,
    hours: String,
    location:{
        address: String,
        lat: Number,
        lng: Number
    },
    item:[{
        name: String,
        price: Number,
        tags: [String] 
    }],
    notification: [String]
},{collection: 'Business'});

// business 存储前检查
schema.pre('save',  function saveHook(next){
    const business = this;

    // 用户密码没做修改则不需要加密
    if(!business.isModified('password')) return next();

    // 用户密码加密: 加盐 -> 加密 -> next
    return bcrypt.hash(business.password, 10, (err, hash) => {
        business.password = hash;
        return next();
    });
});

module.exports = mongoose.model('Business', schema);