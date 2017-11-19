var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = new mongoose.Schema({
    phone: Number,
    business: String,
    item:[{
        name: String,
        count: Number,
        price: Number,
        addition: String
    }],
    tax: Number,
    total: Number,
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
        CVC: Number
    },
    createAt: { type: Date, default: Date.now }
},{collection: 'Order'});

module.exports = mongoose.model('Order', schema);