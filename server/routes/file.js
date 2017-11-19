var express = require('express');
var router = express.Router();
var auth = require('../utils/auth');
var path = require('path');
var fs = require('fs');

var fileUpload = require('express-fileupload');
router.post('/upload', auth.verifyToken, fileUpload(), function(req, res, next) {
    if (!req.files || !req.body._id)
        return res.status(400).send({error: 'No files were uploaded.'});

    let file = req.files.imageFile;
    let name = req.body._id + '.' + file.name.split('.').pop();

    let imagePath = path.join(__dirname, '../public/image/' + name);
    file.mv(imagePath, (err) => {
        if (err)
            return res.status(500).send({error: err});
        
        res.json(name);
    });
});

router.get('/:name', function(req, res, next) {
    let name = req.params.name;
    let imagePath = path.join(__dirname, '../public/image/' + name);
    var file = fs.readFileSync(imagePath);
    res.end(file, 'binary');
});

module.exports = router;