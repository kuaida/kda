var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');
var bcrypt = require('bcrypt');
var db = require('../collections');
const redis = require('../redis');
var salt = 10;

/* GET home page. */


router.get('/', function(req, res, next) {
  redis.getLastQuestion(function(alldata){
    redis.getTopRewardQuestion(function(golddata){
      redis.getTopUser(function(userdata) {
        redis.getTopQuestion(function(hotdata){
            redis.getAllTypes(function(typedata){
              res.render('index', {
                user:req.session.user,
                data1: alldata,
                data2: golddata,
                data3: userdata,
                data4: hotdata,
                data5: typedata
              });
            })
        })
      })
    })
  })
})

router.get('/login', function(req, res, next) {
  res.render('login', {
    user:req.session.user,
    sucess: true
  });
})

router.post('/login', function(req, res, next) {
  db.user.findOne({
    account: req.body.account
  }, function(err, data) {
    if (data) {
      bcrypt.compare(req.body.password, data.password, function(err, hash) {
        if (hash) {
          req.session.user = {
            _id:data._id,
            nickName:data.nickName,
            account:data.account,
            balance:data.balance
          };
          res.redirect('/');
        } else {
          res.render('login', {
            user:req.session.user,
            sucess: false
          })
        }
      })
    } else {
      res.render('login', {
        user:req.session.user,
        sucess: false
      })
    }
  })
})

router.get('/reg', function(req, res, next) {
  res.render('reg', {
    user:req.session.user,
    islive: false
  });
})

router.post('/reg', function(req, res, next) {
  db.user.findOne({
    account: req.body.account
  }, function(err, data) {
    if (data) {
      res.render('reg', {
        user:req.session.user,
        islive: true
      })
    } else {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        var user = new db.user({
          account: req.body.account,
          password: hash
        });
        user.save(function(err, data) {
          res.redirect('/login')
        })
      })
    }
  })
})

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  res.redirect('/login');
})

module.exports = router;
