var express = require('express');
var path = require('path');

var config = require('./config.json');
var mongodb_client = require('./utils/mongodb_client').connect(config.mongodb_uri);

var bodyParser = require('body-parser');
var app = express();

var mailer = require('express-mailer');
mailer.extend(app, {
    from: 'no-reply@onlineorder.com',
    host: 'smtp.gmail.com', // hostname 
    secureConnection: true, // use SSL 
    port: 465, // port for secure SMTP 
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts 
    auth: {
      user: 'zhangjw.uta@gmail.com',
      pass: 'keneciajiraaplcq'
    }
  });

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use('/static', express.static(path.join(__dirname, '../client/main/build/static')));
app.use('/static', express.static(path.join(__dirname, '../client/order/build/static')));
app.use('/static', express.static(path.join(__dirname, '../client/dashboard/build/static')));

app.use(bodyParser.json());

// data response
var business = require('./routes/business');
app.use('/business', business);

var history = require('./routes/history');
app.use('/history', history);

var file = require('./routes/file');
app.use('/file', file);

/* GET order page. */
app.get('/order/:id', function(req, res, next) {
    res.sendFile("index.html", {root: path.join(__dirname, '../client/order/build')} );
});

/* GET dashboard page. */
app.get('/dashboard*', function(req, res, next) {
    res.sendFile("index.html", {root: path.join(__dirname, '../client/dashboard/build')} );
});

/* GET home page. */
app.get('*', function(req, res, next) {
    res.sendFile("index.html", {root: path.join(__dirname, '../client/main/build')} );
});

module.exports = app;
