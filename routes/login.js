var express = require('express');
var router = express.Router();
var db = require('../collections');
var bcrypt = require('bcrypt');
var salt = 10;


router.get('/',function(req,res,next){
  res.render('login',{user:'no',password:'no'});
})

router.post('/',function(req,res,next){
  db.user.findOne({account:req.body.account},function(err,data){
    if(data){
      bcrypt.compare(req.body.password,data.password,function(err,hash){
        if(hash){
          var addr = req.body.account;
          res.cookie('addr',addr,{maxAge:1000*60*60*24*30,httpOnly:true});
          res.render('index',{user:'ren'});
        }else{
          res.render('login',{user:'no',password:'yes'})
        }
      })
    }else{
      res.render('login',{user:'yes',password:'no'})
    }
  })
})

router.get('/reg',function(req,res,next){
  res.render('reg',{cunzai: 'no'});
})

router.post('/reg',function(req,res,next){
  db.user.findOne({account:req.body.account},function(err,data){
    if(data){
      res.render('reg',{cunzai: 'yes'})
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
