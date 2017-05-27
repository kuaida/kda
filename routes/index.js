var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');
var bcrypt = require('bcrypt');
var db = require('../collections');
var salt = 10;

/* GET home page. */

router.get('/', function(req, res, next) {
  dbmodel.question.find({}, function(err, data) {
    res.render('index', {
      user: 'ren',
      ques: data
    });
  })
})

router.get('/userinfo', function(req, res, next) {
  res.render('userinfo', {
    user: 'ren'
  })
})

router.get('/login',function(req,res,next){
  res.render('login',{user:'no',password:'no'});
})

router.post('/login',function(req,res,next){
  db.user.findOne({account:req.body.account},function(err,data){
    if(data){
      bcrypt.compare(req.body.password,data.password,function(err,hash){
        if(hash){
          var addr = req.body.account;
          res.cookie('addr',addr,{maxAge:1000*60*60*24*30,httpOnly:true});
          req.session.user = data.nickName;
          req.session.userid = data._id;
          req.session.account = data.account;
          res.redirect('/');
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
  res.render('reg',{user:null,cunzai: 'no'});
})

router.post('/reg',function(req,res,next){
  db.user.findOne({account:req.body.account},function(err,data){
    if(data){
      res.render('reg',{user:'no',cunzai: 'yes'})
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
