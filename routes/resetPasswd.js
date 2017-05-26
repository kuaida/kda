var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var db = require('../collections')
var numberList;

router.get('/', function(req, res, next) {
  res.render('resetPasswd', {
    user: ''
  });
});

router.post('/val', function(req, res, next) {
  if (req.body.email) {
        var numberList = Math.floor(Math.random()*(9999-1000))+1000;
        var transporter = nodemailer.createTransport({
          host: 'smtp.sina.com',
          secureConnection: true,
          port: 465,
          auth: {
            user: 'ikuaida@sina.com',
            pass: 'ikda.cc'
          }
        });
        var mailOptions = {
          from: 'ikuaida@sina.com',
          to: req.body.email,
          subject: '测试',
          html:`<h2>验证码</h2>`+numberList
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
            res.json(false)
          } else {
            console.log('Message send: ' + info.response);
            res.json(result)
          }
        });
  }

  if(req.body.val){
    console.log(numberList);
    if( numberList == req.body.val){
      res.json(true)
    }else{
      res.json(false)
    }
  }
})



module.exports = router;
