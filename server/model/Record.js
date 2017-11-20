var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = new mongoose.Schema({
    phone: {
        type: String,
        index: {unique: true}
    },
    address: {
        line1: String,
        line2: String,
        zipcode: Number,
        city: String
    },
    payment: {
        card: String,
        name: String,
        expiry: String
    },
});

module.exports = mongoose.model('Record', schema);