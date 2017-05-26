var express = require('express');
var router = express.Router();
var db = require('../collections');
var bcrypt = require('bcrypt');
var salt = 10;


router.get('/',function(req,res,next){
  res.render('reg',{user: 'no',cunzai: 'no'});
})

router.post('/',function(req,res,next){
  db.user.findOne({account:req.body.account},function(err,data){
    if(data){
      res.render('reg',{user: 'no',cunzai: 'yes'})
    }else{
      var user = new db.user({
        account:req.body.account,
        password:req.body.password
      });

      bcrypt.hash(req.body.password, salt,function(err,hash){
        user.password = hash;
        user.save(function(err,data){
          res.render('login',{user:'no',password:'no'})
        })
      })
    }
  })
})

module.exports = router;
