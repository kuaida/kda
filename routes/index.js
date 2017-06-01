var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');
var bcrypt = require('bcrypt');
var db = require('../collections');
var salt = 10;

/* GET home page. */

router.get('/', function(req, res, next) {
  let alldata;
  var hotdata;
  var userdata;
  var golddata;
  var all = dbmodel.question.find({}).exec();
  var gold = dbmodel.question.find({}).sort({
    'money': -1
  }).exec();
  var user = dbmodel.user.find({}).sort({
    'totalReward': -1
  }).exec();
  var hot = dbmodel.question.find({}).sort({
    'pageview': -1
  }).exec();

  var readata = new Promise(function(resolve, reject) {
    all.then((data) => {
      alldata = data;
      return gold;
    }).then((data) => {
      golddata = data;
      return user;
    }).then((data) => {
      userdata = data;
      return hot;
    }).then((data) => {
      hotdata = data;
      resolve()
    });
  });
  readata.then(() => {
    res.render('index', {
      user:req.session.user,
      data1: alldata,
      data2: golddata,
      data3: userdata,
      data4: hotdata
    });
  });
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
