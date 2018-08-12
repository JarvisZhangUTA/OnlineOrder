var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = new mongoose.Schema({
    phone: String,
    business: String,
    item:[{
        name: String,
        count: Number,
        price: Number,
        addition: String,
        sub: [{
            name: String,
            price: Number,
            count: Number
        }]
    }],
    tax: Number,
    total: Number,
    deliver: Number,
    address: {
        line1: String,
        line2: String,
        zipcode: Number,
        city: String
    },
    payment: {
        card: String,
        name: String,
        expiry: String,
        CVC: String
    },
    createAt: { type: Date, default: Date.now }
},{collection: 'Order'});

module.exports = mongoose.model('Order', schema);