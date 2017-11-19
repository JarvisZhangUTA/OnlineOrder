var express = require('express');
var router = express.Router();
var Business = require('mongoose').model('Business');
var Order = require('mongoose').model('Order');
var auth = require('../utils/auth');

router.post('/placeorder', function(req, res, next) {
    const orderData = req.body;
   
    Business.findById(orderData.business, (err, business)=>{
        if(!business) {
            res.status(400).json({error: 'invalid business id'});
        } else {
            const order = new Order(orderData);
            order.save((err) => {
                if (err) {
                    res.status(400).json({error: err});
                    return;
                }

                res.mailer.send('order_mail', 
                {
                    from: 'no-reply@onlineorder.com',
                    to: business.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
                    cc: business.notification,
                    subject: 'New Order Notification', // REQUIRED.
                    order: order // All additional properties are also passed to the template as local variables.
                }, (err) => {
                    if(err){
                        res.status(400).json({error: err});
                    }

                    res.json(order);
                });
            });
        }
    });
});

router.post('/query',auth.verifyToken, function(req, res, next) {
    console.log(req.body.startDate + ' ' + req.body.endDate);
    Order.find({ business: req.body.id, createAt: { $gte: req.body.startDate, $lte: req.body.endDate} }, 
        (err, list) => {
        res.json(list);
    })
});

module.exports = router;