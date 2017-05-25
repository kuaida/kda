var express    = require('express');
var router     = express.Router();
const ObjectId = require('mongoose').Types.ObjectId;
const dbs   = require('../collections');
const moment= require('moment');
const xssFilters = require('xss-filters');
const types = {
  type:[],
  last:Math.floor(Number(moment('2015-05-25').format('x'))/1000),
  limit:600
};

router.get('/', function(req, res, next) {
  res.render('publish',{user:''});
});

router.get('/getAllTypes',function(req,res,next){
  var nowTime = Math.floor(new Date().getTime()/1000);
  if(nowTime>types.last+types.limit){
    dbs.type.find({},['_id','type'],(err,typeData)=>{
      if(err){
        console.log(err);
      }else{
        types.type = typeData;
        types.last = Math.floor(Number(moment().format('x'))/1000);
        res.json({types:typeData});
      }
    });
  }else{
    res.json({types:types.type});
  }
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
    question.validTime = req.body.time+Math.floor(Number(moment().format('x'))/1000);
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
      dbs.user.findByIdAndUpdate(id,{$push:{'myQuestions':ques._id}},(err,user)=>{
        if(err){
          console.log(err);
          res.json({state:400});
        }else{
          dbs.type.update({'type':{$in:ques.type}},{$push:{'questionIdList':ques._id}},{multi:true},(err)=>{
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
module.exports = router;
