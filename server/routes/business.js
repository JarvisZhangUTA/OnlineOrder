var express = require('express');
var router = express.Router();
var Business = require('mongoose').model('Business');
var auth = require('../utils/auth');
var validator = require('validator');
var bcrypt = require('bcrypt');

router.post('/signin', function(req, res, next) {
    auth.generateToken(req.body.email, req.body.password, (id, token) => {
        if(!token) {
            res.status(400).json({error: 'Email or password wrong'});
        } else {
            res.json({
                id: id,
                email: req.body.email,
                token: token
            });
        }
    });
});

router.post('/signup', function(req, res, next) {
    var check = isValidateReq(req.body);

    if(!check.isValidate) {
        res.status(400).json({error: check.error});
        return;
    }

    Business.findOne({'email': req.body.email}, (err, business)=>{
        if(business) {
            res.status(400).json({error: 'email exists'});
        } else {
            const data = {
                email: req.body.email.trim(),
                password: req.body.password
            };
            const business = new Business(data);
            business.index = business._id;

            business.save((err) => {
                if (err) {
                    res.status(400).json({error: err});
                    return;
                }
                res.json(business);
            });
        }
    });
});

router.get('/info/:id', function(req, res, next) {
    const id = req.params.id;

    Business.findOne({'_id': id}, (err, business)=>{
        if(!business) {
            res.status(400).json({error: 'account not found'});
        } else {
            res.json(business);
        }
    });
});

router.get('/index/:index', function(req, res, next) {
    const index = req.params.index;

    Business.findOne({'index': index}, (err, business)=>{
        if(!business) {
            res.status(400).json({error: 'account not found'});
        } else {
            res.json(business);
        }
    });
});

router.post('/update', auth.verifyToken ,function(req, res, next) {
    const new_business = req.body;
    delete new_business.__v;

    Business.findById(new_business._id, function (err, business) {
        if (err){
            res.status(400).json({error: err});
            return handleError(err);
        }

        Business.find({'index': new_business.index}, (err, data)=>{
            if(data.length > 1) {
                res.status(400).json({error: 'Link index is taken'});
                return;
            }
            
            if(data.length === 1 && !data[0]._id.equals(business._id)) {
                res.status(400).json({error: 'Link index is taken'});
                return;
            }

            business.set(new_business);
            business.save(function (err, updatedBusiness) {
                if (err){
                    res.status(400).json({error: err});
                    return handleError(err);
                }
              res.json(updatedBusiness);
            });
        });
    
    });
});

function isValidateReq(req) {
    var res = {
        isValidate: true,
        error: ''
    };

    if(!req.email){
        res.isValidate = false;
        error = 'email is needed'; 
    }

    if(!req.password){
        res.isValidate = false;
        error = 'password is needed'; 
    }

    if(!validator.isEmail(req.email)) {
        res.isValidate = false;
        error = 'wrong email format'; 
    }

    return res;
}

module.exports = router;