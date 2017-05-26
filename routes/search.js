var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');
var bcrypt = require('bcrypt');
// var title;

/* GET home page. */

router.get('/', function(req, res, next) {
  var reg = new RegExp(req.query.search,'gi');
  dbmodel.question.find({title:reg}, function(err, data) {
    res.render('search', {
      user:'',
      ques:data
    });
  })
})

module.exports = router;
