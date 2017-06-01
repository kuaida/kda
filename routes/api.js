var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');

router.route('/')
      .get(function(req, res) {
        dbmodel.question.find({},function(err, data) {
          res.end(JSON.stringify(data));
        })
      })
      .post(function(req, res) {
        dbmodel.question.find({},function(err, data) {
          res.end(JSON.stringify(data));
        })
      });

router.route('/money/top20')
      .get(function(req, res) {
        dbmodel.question.find({}).limit(20).exec(function(err,data) {
          res.end(JSON.stringify(data));
        })
      })

router.route('/user/top20')
      .get(function(req, res) {
        dbmodel.user.find({}).limit(20).exec(function(err,data) {
          res.end(JSON.stringify(data));
        })
      })

router.route('/question/:id')
      .get(function(req, res) {
        dbmodel.question.findOne({_id: req.params.id},function(err,data) {
          dbmodel.question.update({_id: req.params.id},{$set:{'pageviews': data.pageviews + 1}},function() {
          dbmodel.answer.find({question: req.params.id},function(err,data1) {
            var obj = {};
            obj.question = data;
            obj.answer = data1;
            res.end(JSON.stringify(obj))
          })
        })
        })
      })

router.route('/question/comment')
      .post(function(req, res) {
        console.log(req.body);
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
      })

router.route('/question/like/:id/:ip')
      .post(function(req, res) {

        dbmodel.answer.findOne({question: req.params.id}, function(err,data) {
          dbmodel.answer.where('likers').in([req.params.ip]).exec(function(err,data1){
            console.log(data1);
            if(data1.length) {
              dbmodel.answer.update({question: req.params.id}, {$pop: {'likers': req.params.ip}}, function() {})
            } else {
              dbmodel.answer.update({question: req.params.id}, {$push: {'likers': req.params.ip}}, function() {})
            }
          })
        })
      })

router.route('/question/collection/:id/:ip')
      .post(function(req, res) {
        console.log(req.params.id);
        console.log(req.params.ip);
        console.log(req.body);
        dbmodel.user.where('myCollections').in([req.params.id]).exec(function(err, data1) {
          if(data1.length) {
            dbmodel.question.findOne({_id: req.params.id}, function(err,data) {
              var id = data._id
              dbmodel.user.update({_id: req.params.ip},{$pop:{'myCollections': id}},function() {})
            })
          } else {
            dbmodel.question.findOne({_id: req.params.id}, function(err,data) {
              var id = data._id
              dbmodel.user.update({_id: req.params.ip},{$push:{'myCollections': id}},function() {})
            })
          }
        })
      })

router.route('question/adopt/:id/:ip')
      .post(function(req, res) {
        console.log(req.body);
        console.log(req.params.id);
        dbmodel.answer.update({question: req.body.questionid}, {$set: {'adopt': req.body.state}}, function() {})
      })
module.exports = router;
