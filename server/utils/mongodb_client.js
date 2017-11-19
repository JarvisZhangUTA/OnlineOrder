var mongoose = require('mongoose');

module.exports.connect = (uri) => {
    mongoose.connect(uri);

    require('../model/Business');
    require('../model/Order');
    require('../model/Record');
}