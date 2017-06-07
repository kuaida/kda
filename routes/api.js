var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');
var redis = require('../redis');

// 所有问题详情
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

// 首页问题列表
router.route('/redis/question')
      .get(function(req, res) {
        redis.getLastQuestion(function(data) {
          res.end(JSON.stringify(data));
        })
      });

// 首页达人榜
router.route('/redis/talent')
      .get(function(req, res) {
        redis.getTopUser(function(data) {
          res.end(JSON.stringify(data));
        })
      });

// 首页赏金榜
router.route('/redis/money')
      .get(function(req, res) {
        redis.getTopRewardQuestion(function(data) {
          res.end(JSON.stringify(data));
        })
      });

// 首页热搜榜
router.route('/redis/hot')
      .get(function(req, res) {
        redis.getTopQuestion(function(data) {
          res.end(JSON.stringify(data));
        })
      });

// 首页标签类型
router.route('/redis/alltype')
      .get(function(req, res) {
        redis.getAllTypes(function(data) {
          res.end(JSON.stringify(data));
        })
      });

// 问题展示页面问题详情
router.route('/question/:id')
      .get(function(req, res) {
        dbmodel.question.findOne({_id: req.params.id})
                                .populate('author',{nickName:1,headPortrait:1})
                                .exec(function(err,data) {
          dbmodel.question.update({_id: req.params.id},{$set:{'pageviews': data.pageviews + 1}},function() {
          dbmodel.answer.find({question: req.params.id})
                             .populate('author',{_id:1,nickName:1,headPortrait:1})
                             .exec(function(err,data1) {
                             var obj = {};
                             obj.question = data;
                             obj.answer = data1;
                             res.end(JSON.stringify(obj))
                           })
                         })
                         })

      })

// 问题展示页面评论
router.route('/question/comment')
      .post(function(req, res) {
        let quest = new dbmodel.answer(req.body);
        quest.save(function(err) {
          if (err) {
            console.log(err);
          }
        })
        dbmodel.question.findOne({_id: req.body.question}, function(err,data) {
          var title = data._id;
          dbmodel.user.findOne({_id: req.body.author}, function(err,data1) {
            dbmodel.user.update({_id: req.body.author},{$push:{'myAnswers': title}},function() {
              dbmodel.answer.find({question:req.body.question})
                                 .populate('author',{_id:1,nickName:1,headPortrait:1})
                                 .exec(function(err, data2) {
                                  var obj1 = {};
                                  obj1.question = data;
                                  obj1.answer = data2;
                                  res.end(JSON.stringify(obj1))
                                })
                              })
                            })
                          })
      })

// 问题展示页面点赞
router.route('/question/like/:id/:ip')
      .post(function(req, res) {

        dbmodel.answer.findOne({question: req.params.id}, function(err,data) {
          dbmodel.answer.where('likers').in([req.params.ip]).exec(function(err,data1){
            if(data1.length) {
              dbmodel.answer.update({question: req.params.id}, {$pop: {'likers': req.params.ip}}, function() {})
            } else {
              dbmodel.answer.update({question: req.params.id}, {$push: {'likers': req.params.ip}}, function() {})
            }
          })
        })
      })

// 问题展示页面收藏
router.route('/question/collection/:id/:ip')
      .post(function(req, res) {
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

// 问题展示页面采纳
router.route('/question/adopt/:id/:ip')
      .post(function(req, res) {
        dbmodel.answer.update({question: req.body.questionid}, {$set: {'adopt': !req.body.state}}, function() {
          dbmodel.question.findOne({_id: req.body.questionid}, function(err,data) {
            dbmodel.user.findOne({_id: req.body.user}, function(err,data1) {
              var data2 = data1.balance + data.money
              dbmodel.user.update({_id: req.body.user}, {$set: {'balance': data2}}, function() {})
            })
          })
        })
      })

// 问题id获得问题详情
router.route('/questionid/:id')
      .get(function(req, res) {
        redis.getQuestionById(function(data) {
          res.end(JSON.stringify(data));
        })
      })

// 保存新问题
router.route('/savequestion')
      .put(function(req, res) {
        if(!req.session.user){
          res.json({state:300});
          return;
        }
        var id = req.session.user._id;
        var question = {
          title:req.body.title,
          type:req.body.type,
          content:req.body.editorHtml,
          author:id,
          answerList:[],
          charge:false,
          validTime:0,
          money:0,
          createTime:moment().format('YYYY-MM-DD HH:mm:ss'),
          pageviews:0
        };
        if(req.body.pay=='true'){
          question.charge = true;
          question.validTime = Number(req.body.time)*3600+Math.floor(Number(moment().format('x'))/1000);
          question.money = req.body.count;
        }
        if(typeof req.body.type=='string'){
          question.type = [req.body.type];
        }
        redis.saveNewQuestion(question, (err, user)=>{
          if(err){
            console.error(err);
            res.json({state:400});
          }else{
            req.session.user.balance = user.balance - question.money;
            res.json({state:200});
          }
        });

      })

// 保存新的评论
router.route('/saveNewAnswer')
      .put(function(req, res) {
        if(!req.session.user){
          res.json({state:300});
          return;
        }
        var answer = {
          uid: req.session.user._id,
          qid: req.body.questionid,
          answer: {
            question: req.body.questionid,
            author: req.body.user._id,
            Content: req.body.content,
            answerTime: moment().format('YYYY-MM-DD HH:mm:ss')
          }
        };
        redis.saveNewAnswer(answer, (err, data)=>{
          if(err){
            console.error(err);
            res.json({state:400});
          } else {
            res.json({state:200});
          }
        })
      })
module.exports = router;
