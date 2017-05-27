var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var db = require('../collections')
var bcrypt = require('bcrypt');
var salt = 10;
var numberList;

router.get('/', function(req, res, next) {
  res.render('resetPasswd', {
    user: ''
  });
});

router.post('/val', function(req, res, next) {
  if (req.body.email) {
    db.user.findOne({account:req.body.email},function(err,data){
      if(data){
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
          subject: '快答邮箱验证',
          html:`修改密码验证<h2>验证码:</h2>`+numberList
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
            res.json({status:2})
          } else {
            res.json({status:1,numberList:numberList,userName:req.body.email})
          }
        });

      }else{
        res.json({status:0})
      }
    })
  }
})
router.post('/mod', function(req, res, next) {
  bcrypt.hash(req.body.password, salt,function(err,hash){
    db.user.update({account:req.body.account},{$set:{password:hash}},function(err,data){
      if(!err){
        res.json(true)
      }
    })
  })
});

module.exports = router;
