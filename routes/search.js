var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');
var bcrypt = require('bcrypt');
var salt = 10;
// var title;

/* GET home page. */

router.get('/', function(req, res, next) {
  var reg = new RegExp(req.query.search,'gi');
  let searchdata;
  var hotdata;
  var userdata;
  var golddata;
  var gold = dbmodel.question.find({}).sort({
    'money': -1
  }).exec();
  var user = dbmodel.user.find({}).sort({
    'totalReward': -1
  }).exec();
  var hot = dbmodel.question.find({}).sort({
    'pageview': -1
  }).exec();

  var search = dbmodel.question.find({title:reg}).sort({
  }).exec();
  console.log(reg);
  var readata = new Promise(function(resolve, reject) {
    search.then((data) => {
      searchdata = data;
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
    res.render('search', {
      user:req.session.user,
      data1: searchdata,
      data2: golddata,
      data3: userdata,
      data4: hotdata
    });
  });
})

module.exports = router;
