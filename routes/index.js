var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');
var bcrypt = require('bcrypt');

/* GET home page. */

router.get('/', function(req, res, next) {
  dbmodel.question.find({}, function(err, data) {
    console.log("++++" + data + "******");
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



// router.get('/', function(req, res, next) {
//   dbmodel.question.find().sort({
//     time: -1
//   }).exec(function(err, data) {
//     res.render('index', {
//       ques: data
//     });
//   })
// })

module.exports = router;
