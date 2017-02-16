var URL = require('url');
var express = require('express');
var router = express.Router();
var redis = require('redis');
var client = require('redis').createClient();
var cache = require('express-redis-cache')();

client.on("error", function (err) {
    console.log("Error " + err);
});

router.get('/', function(req, res, next) {
  res.send('user api');
});

router.get('/getUserInfo', function(req, res, next) {

  var log = client.set("string key", "string val", redis.print);
  console.log("\nlog:" + log);
  client.hset("hash key", "hashtest 1", "some value", redis.print);
  client.hset(["hash key", "hashtest 2", "some other value"], redis.print);
  client.keys("string key", function (err, replies) {
    console.log(replies.length + " replies:");
    replies.forEach(function (reply, i) {
        console.log("    " + i + ": " + reply);
    });
    client.quit();
  });

  var response = {status:1};
  res.send(JSON.stringify(response));

});

router.get('/addDevice', function(req, res, next) {//http://localhost:3000/users/addDevice?num=3
  var params = URL.parse(req.url, true).query;
  var num = params.num;
  if(num > 0){
    for(var i=0; i<num; i++){
      client.hset("device table","AAAAAA" + i, keydata, function (err) {
          if(err){
            console.log('add Devices '+ i +' error!');
            return false;
          }
          //console.log('add Devices '+ i +' success!');
      });
      //console.log('add Devices '+ i );
    }   
    res.send({follow: {result : 'add Devices success! num = ' + num}});
  }
  else
    res.send({follow: {result : 'add Devices error! num < 0'}});
});

router.get('/getDevice', function(req, res, next) {//
  client.hget("device table", "No.serial1", function (err, obj) {
    //pubkey = obj;

      var response = {status:obj};
      res.send(JSON.stringify(response));
  });
});

router.get('/getDevicebySerial', function(req, res, next) {//http://localhost:3000/users/getDevicebySerial
  client.hget("device table", "9a1dbecd", function (err, obj) {
      res.send({follow: {result : obj}});
  });
});

router.get('/getDeviceExist', function(req, res, next) {//http://localhost:3000/users/getDeviceExist
  client.hexists("device table", "AAAAAA1", function (err, obj) {
      res.send({follow: {result : obj}});
  });
});

router.get('/getDeviceNum', function(req, res, next) {//http://localhost:3000/users/getDeviceNum
  //
    client.hkeys("device table", function (err, replies) {  
        res.send({follow: {Dnumber : replies.length}});  
    });  
});

router.get('/listDevices', function(req, res, next) {//http://localhost:3000/users/listDevices
  // 
    client.hkeys("device table", function (err, replies) {   
      replies.forEach(function (reply, i) {  
        console.log("device" + i + ": " + reply);  
      });
      res.send({follow: {Dnumber : replies.length}});
    });
});

router.get('/delDevices', function(req, res, next) {//http://localhost:3000/users/delDevices
  //
    client.flushall(function (err) {  
        if(err){
          res.send({follow: {result : 'delDevices error!'}});
          return false;
        }
        res.send({follow: {result : 'delDevices success!'}});  
    }); 
});

router.get('/deldevice', function(req, res, next) {//http://localhost:3000/users/deldevices?id=9a1dbecd
  //
  var params = URL.parse(req.url, true).query;
  var id = params.id;
    client.del(id, function (err) {  
        if(err){
          res.send({follow: {result : 'delDevices error!'}});
          return false;
        }
        res.send({follow: {result : id +'delDevices success\n'}});  
    }); 
});


var keydata =           '-----BEGIN RSA PUBLIC KEY-----\n'+
                      'MIGJAoGBAIJ1j4SkML+89rffmXvnVIEzx3kt/jPhBlfhtz4OpNj3NVj+uY8ZtOQK\n'+
                      '54qcgoCm44Yxck5oLA0f3BR+023tPR+gTCOXXq4gLybiHBKOM0vlMqoxV7JLK/Ti\n'+
                      'gG6J2/vq7nI2IsLgnzmVuZbdYDJiRMJub9UlkBc0m6oKbsBVaZAxAgMBAAE=\n'+
                      '-----END RSA PUBLIC KEY-----';

module.exports = router;