var express    = require('express');
var router     = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const dbs   = require('../collections');
const moment= require('moment');
const xssFilters = require('xss-filters');
const redis = require('../redis');

const initTypes = ['HTML5','CSS3','Node.js','Express','React','Javascript','jQuery','React Native','MongoDB','MySQL','Python','PHP','UI框架','JS框架'];
/*
* 初始化标签
*/
dbs.type.find({},(err,res)=>{
  if(!res.length){
    initTypes.forEach((tag)=>{
      let newTag = new dbs.type({
        type:tag,
        questionIdList:[]
      });
      newTag.save(()=>{});
    });
  }
});

router.get('/', function(req, res, next) {
  res.render('publish',{user:req.session.user});
});

router.get('/getAllTypesAndIsLogin',function(req,res,next){
  redis.getAllTypes((types)=>{
    res.json({types:types,user:req.session.user});
  });
});

router.post('/postQuestion',function(req,res,next){
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
  var dbQuestion = new dbs.question(question);
  dbQuestion.save((err,ques)=>{
    if(err){
      console.log(err);
      res.json({state:400});
    }else{
      redis.flushdb();
      dbs.user.findByIdAndUpdate(id,{$push:{'myQuestions':ques._id},$inc:{'balance':-question.money}},(err,user)=>{
        if(err){
          console.log(err);
          res.json({state:400});
        }else{
          req.session.user.balance = user.balance - question.money;
          dbs.type.update({'type':{$in:ques.type}},{$addToSet:{'questionIdList':ques._id}},{multi:true},(err)=>{
            if(err){
              console.log(err);
            }else{
              res.json({state:200});
            }
          });
        }
      });
    }
  });
});
router.get('/test',function(req,res,next){
  redis.getTopQuestion((v)=>{
    console.log(v);
  });
});
module.exports = router;
