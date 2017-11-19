var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var schema = new mongoose.Schema({
    email: String,
    card_number: Number,
    month: Number,
    year: Number
});

module.exports = mongoose.model('Record', schema);