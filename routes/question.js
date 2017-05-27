var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');

/* GET home page. */
router.get('/', function(req, res, next) {
  dbmodel.question.findOne({_id: '5928e40767cfd96c99735fd1'},function(err,data) {
    console.log(data.pageviews);
    dbmodel.question.update({_id: '5928e40767cfd96c99735fd1'},{$set:{'pageviews': data.pageviews + 1}},function() {})
  })
  res.render('question',{'user':'', 'title': '测试问题标题'});
});

router.post('/comment',function(req, res, next) {;
  let quest = new dbmodel.answer(req.body);
  quest.save(function(err) {
    if (err) {
      console.log(err);
    }
  })
  dbmodel.question.findOne({_id: req.body.question}, function(err,data) {
    var title = data._id;
    dbmodel.user.findOne({_id: req.body.author}, function(err,data1) {
      dbmodel.user.update({_id: req.body.author},{$push:{'myAnswers': title}},function() {})
    })
  })
});

router.post('/collection',function(req, res, next) {
  dbmodel.user.where('myCollections').in([req.body.questionid]).exec(function(err, data1) {
    if(data1.length) {
      dbmodel.question.findOne({_id: req.body.questionid}, function(err,data) {
        var id = data._id
        dbmodel.user.update({_id: req.body.userid},{$pop:{'myCollections': id}},function() {})
      })
    } else {
      dbmodel.question.findOne({_id: req.body.questionid}, function(err,data) {
        var id = data._id
        dbmodel.user.update({_id: req.body.userid},{$push:{'myCollections': id}},function() {})
      })
    }
  })
});




router.post('/like',function(req, res, next) {
  console.log(req.body);
  dbmodel.answer.findOne({question: req.body.questionid}, function(err,data) {
    dbmodel.answer.where('likers').in([req.body.userid]).exec(function(err,data1){
      console.log(data1);
      if(data1.length) {
        dbmodel.answer.update({question: req.body.questionid}, {$pop: {'likers': req.body.userid}}, function() {})
      } else {
        dbmodel.answer.update({question: req.body.questionid}, {$push: {'likers': req.body.userid}}, function() {})
      }
    })
  })
});

router.post('/adopt', function(req, res, next) {
  console.log(req.body);
  dbmodel.answer.update({question: req.body.questionid}, {$set: {'adopt': req.body.state}}, function() {})
})

module.exports = router;
