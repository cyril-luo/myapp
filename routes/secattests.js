var URL = require('url');
var express = require('express');   
var morgan = require('morgan');    
var app = express();
var router = express.Router();

router.post('/', function(req, res, next) {//for browser test
    var body = req.body;
    if(body.serial != null)
        pre_device.serial = body.serial;
    pre_device.nonce = Math.ceil( Math.random() * 1000000000000 );

    console.log("device serial:" + pre_device.serial + "\ndevice nonce:" + pre_device.nonce);
    res.send({follow: {result : pre_device.nonce}});
});


module.exports = router;  