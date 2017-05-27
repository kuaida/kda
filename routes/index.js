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
  });

  dbmodel.user.find({}, function(err, data) {
    console.log(data + "ddddddddd");
    res.render('index', {
      user: 'ren',
      users: data
    });
  });


})

router.get('/login',function(req,res,next){
  res.render('login',{user:req.session.nickName,sucess:true});
})

router.post('/login',function(req,res,next){
  db.user.findOne({account:req.body.account},function(err,data){
    if(data){
      bcrypt.compare(req.body.password,data.password,function(err,hash){
        if(hash){
          req.session.nickName = data.nickName;
          req.session.userid = data._id;
          req.session.account = data.account;
          res.redirect('/');
        }else{
          res.render('login',{user:req.session.nickName,sucess:false})
        }
      })
    }else{
      res.render('login',{user:req.session.nickName,sucess:false})
    }
  })
})

router.get('/reg',function(req,res,next){
  res.render('reg',{user:req.session.nickName,islive:false});
})

router.post('/reg',function(req,res,next){
  db.user.findOne({account:req.body.account},function(err,data){
    if(data){
      res.render('reg',{user:req.session.nickName,islive: true})
    }else{
      bcrypt.hash(req.body.password, salt,function(err,hash){
      var user = new db.user({
        account:req.body.account,
        password:hash
      });
        user.save(function(err,data){
          res.redirect('/login')
        })
      })
    }
  })
})

router.get('/logout', function(req, res, next) {
  req.session.user = data.nickName;
  req.session.userid = data._id;
  req.session.account = data.account;
  res.redirect('/login');
})

module.exports = router;
