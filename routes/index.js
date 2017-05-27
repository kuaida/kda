var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');
var bcrypt = require('bcrypt');

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

router.get('/userinfo', function(req, res, next) {
  res.render('userinfo', {
    user: 'ren'
  })
})

module.exports = router;
