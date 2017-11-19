var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/order/:id', function(req, res, next) {
  res.sendFile("index.html", {root: path.join(__dirname, '../../client/order/build')} );
});


/* GET home page. */
router.get('/dashboard', function(req, res, next) {
  res.sendFile("index.html", {root: path.join(__dirname, '../../client/dashboard/build')} );
});

/* GET home page. */
router.get('*', function(req, res, next) {
  res.sendFile("index.html", {root: path.join(__dirname, '../../client/main/build')} );
});

module.exports = router;