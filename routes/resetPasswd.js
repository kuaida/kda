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
          subject: '爱快打',
          html:`修改密码验证<h2>验证码:</h2>`+numberList
        };
        transporter.sendMail(mailOptions, function(error, info) {
          if (error) {
            console.log(error);
            res.json(false)
          } else {
            res.json({numberList:numberList,userName:req.body.email})
          }
        });

      }else{
        res.json(false)
      }
    })

  }
})
router.post('/mod', function(req, res, next) {
  db.user.update({account:req.body.account},{$set:{password:req.body.password}},function(err,data){
    if(!err){
      res.json(true)
    }
  })
});

module.exports = router;
