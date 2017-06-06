const dbs   = require('../collections');
const redis = require('./connect');
const times = {
  getAllTypes:60*60*24,
  getLastQuestion:60*3,
  getTopRewardQuestion:60*3,
  getTopUser:60*3,
  getTopQuestion:60*3,
  getQuestionById:60*60*48
}
/*
* @function 获得所有的标签信息,包括_id,type
* @param cb 回调函数,接受一个查询结果作为参数
*/
function getAllTypes(cb){
  if(typeof cb == 'function'){
    redis.get('allTypes', (err, reply)=>{
      if(err){
        console.error('getAllTypes: get获取缓存错误:'+ __filename);
      }else{
        if(reply){
          cb(JSON.parse(reply).data);
        }else{
          dbs.type.find({},['_id','type'],(err, types)=>{
            if(err){
              console.error('getAllTypes: 查询type集合出现错误:' + __filename);
            }else{
              redis.set('allTypes', JSON.stringify({data:types}));
              redis.expire('allTypes', times.getAllTypes);
              cb(types);
            }
          });
        }
      }
    });
  }else{
    console.error('getAllTypes函数的参数需要是一个函数');
  }
}
/*
* @function 获得最近的500条提问
* @param cb 回调函数,接受一个查询结果作为参数
*/
function getLastQuestion(cb){
  if(typeof cb == 'function'){
    redis.get('lastQuestion', (err, reply)=>{
      if(err){
        console.error('getLastQuestion: get获取缓存错误:'+ __filename);
      }else{
        if(reply){
          cb(JSON.parse(reply));
        }else{
          dbs.question.find({}).limit(500).sort({createTime:-1}).populate('author',{_id:1,nickName:1,headPortrait:1}).exec((err, docs)=>{
            if(err){
              console.error('getLastQuestion: get获取数据库数据失败:'+ __filename);
            }else{
              redis.set('lastQuestion', JSON.stringify(docs));
              redis.expire('lastQuestion', times.getLastQuestion);
              cb(docs);
            }
          });
        }
      }
    });
  }else{
    console.error('getLastQuestion函数的参数需要是一个函数');
  }
}
/*
* @function 赏金榜前10
* @param cb 回调函数,接受一个查询结果作为参数
*/
function getTopRewardQuestion(cb){
  if(typeof cb == 'function'){
    redis.get('10_question', (err, reply)=>{
      if(err){
        console.error('getTopRewardQuestion: get获取缓存错误:'+ __filename);
      }else{
        if(reply){
          cb(JSON.parse(reply));
        }else{
          dbs.question.where({'charge':true}).select('_id title money').sort({money:-1}).limit(10).exec((err, docs)=>{
            if(err){
              console.error(err);
            }else{
              redis.set('10_question', JSON.stringify(docs));
              redis.expire('10_question', times.getTopRewardQuestion);
              cb(docs);
            }
          });
        }
      }
    });
  }else{
    console.error('getTopRewardQuestion函数的参数错误' + __filename);
  }
}
/*
* @function 达人榜前10
* @param cb 回调函数,接受一个查询结果作为参数
*/
function getTopUser(cb){
  if(typeof cb == 'function'){
    redis.get('10_user', (err, reply)=>{
      if(err){
        console.error('getTopUser: get获取缓存错误:'+ __filename);
      }else{
        if(reply){
          cb(JSON.parse(reply));
        }else{
          dbs.user.where("totalReward").gt(0).select('_id nickName totalReward').sort({totalReward:-1}).limit(10).exec((err, docs)=>{
            if(err){
              console.error(err);
            }else{
              redis.set('10_user', JSON.stringify(docs));
              redis.expire('10_user', times.getTopUser);
              cb(docs);
            }
          });
        }
      }
    });
  }else{
    console.error('getTopUser函数的参数错误' + __filename);
  }
}
/*
* @function 热搜榜前10
* @param cb 回调函数,接受一个查询结果作为参数
*/
function getTopQuestion(cb){
  if(typeof cb == 'function'){
    redis.get('10_s_question',(err, reply)=>{
      if(err){
        console.error('getTopQuestion: get获取缓存错误:'+ __filename);
      }else{
        if(reply){
          cb(JSON.parse(reply));
        }else{
          dbs.question.find({}).select('_id title pageviews').sort({pageviews:-1}).limit(10).exec((err, docs)=>{
            if(err){
              console.error(err);
            }else{
              redis.set('10_s_question', JSON.stringify(docs));
              redis.expire('10_s_question', times.getTopQuestion);
              cb(docs);
            }
          });
        }
      }
    });
  }else{
    console.error('getTopQuestion函数的参数错误' + __filename);
  }
}
/*
* @function 获得对应_id下的问题
* @param id 问题_id
* @param cb 第一个参数为查询结果的回调函数
*/
function getQuestionById( id, cb ){
  if(arguments.length==2){
    if(typeof cb == 'function'){
      redis.get('q_'+id, (err, reply)=>{
        if(err){
          console.error("getQuestionById: get出错");
          console.error(err);
        }else{
          if(reply){
            dbs.question.findByIdAndUpdate(id,{$inc:{pageviews:1}},(err,question)=>{
              reply = JSON.parse(reply);
              reply.question.pageviews += 1;
              redis.set('q_'+id, JSON.stringify(reply));
              cb(reply);
            });
          }else{
            dbs.question.findByIdAndUpdate(id,{$inc:{pageviews:1}})
            .populate('author',{_id:1,nickName:1,headPortrait:1})
            .exec(function(err,question) {
                if(err){
                  console.error('getQuestionById: 查询question出错 ' + __filename);
                  console.error(err);
                }else{
                  dbs.answer.find({question: id})
                  .populate('author',{_id:1,nickName:1,headPortrait:1})
                  .exec(function(err,answers) {
                    var res = {};
                    res.question = question;
                    res.answer = answers;
                    redis.set('q_'+id, JSON.stringify(res));
                    redis.expire('q_'+id, times.getQuestionById);
                    cb(res);
                  })
                }
            })
          }
        }
      });
    }else{
      console.error('getQuestionById: 参数必须为id(问题id), cb(回调函数) ' + __fielname);
    }
  }else{
    console.error('getQuestionById: 参数必须为id(问题id), cb(回调函数) ' + __filename);
  }
}
/*
* @function 添加新问题
* @param newQuestion 包含问题的所有必须信息的json
* @param cb(err,user)
*/
function saveNewQuestion( newQuestion, cb ){
  if(arguments.length==2){
    if(typeof cb == "function" && typeof newQuestion == "object"){
      const newQ = new dbs.question(newQuestion);
      newQ.save((err,question)=>{
        if(err){
          console.error("saveNewQuestion: 新问题保存失败 " + __filename);
          console.error(err);
          cb(err, null);
        }else{
          dbs.user.findByIdAndUpdate(question.author,{$push:{'myQuestions':question._id},$inc:{'balance':-question.money}},(err,user)=>{
            if(err){
              console.error("saveNewQuestion: 对用户集合更新时失败 " + __filename);
              console.error(err);
              cb(err, null);
            }else{
              cb(err, user);
              redis.get("lastQuestion", (err, reply)=>{
                if(err){
                  console.error("saveNewQuestion: redis获取数据失败 " + __filename);
                  console.error(err);
                }else{
                  if(reply){
                    reply = JSON.parse(reply);
                    reply.unshift(question);
                    redis.set("lastQuestion", JSON.stringify(reply));
                  }
                }
              });
              dbs.type.update({'type':{$in:question.type}},{$addToSet:{'questionIdList':question._id}},{multi:true},(err)=>{
                if(err){
                  console.error("saveNewQuestion: 对类型集合更新时失败 " + __filename);
                  console.error(err);
                }
              });
            }
          });
        }
      });
    }else{
      console.error("saveNewQuestion: 参数必须为newQuestion(问题基本信息的json), cb(回调函数) " + __filename);
    }
  }else{
    console.error("saveNewQuestion: 参数必须为newQuestion(问题基本信息的json), cb(回调函数) " + __filename);
  }
}
/*
* @function 添加新评论
* @param  评论过程过程中必须的信息组成的json {uid:当前评论用户的id,qid:当前评论问题的id,answer:评论的基本信息json}
* @param cb(err,answer)
*/
function saveNewAnswer( thisAnswer, cb ){
  if(arguments.length == 2){
    if(typeof cb == "function" && typeof thisAnswer == "object"){
      if(typeof thisAnswer.uid == "string" && typeof thisAnswer.qid == "string" && typeof thisAnswer.answer == "object"){
        const newAnswer = new dbs.answer(thisAnswer.answer);
        newAnswer.save((err, answer)=>{
          if(err){
            console.error("saveNewAnswer: 评论保存失败" + __filename);
            console.error(err);
            cb(err,null);
          }else{
            dbs.question.findByIdAndUpdate(thisAnswer.qid, {$push:{answerList:answer._id}}, (err, question)=>{
              if(err){
                console.error("saveNewAnswer: 评论id保存到问题集合失败" + __filename);
                console.error(err);
                cb(err,null);
              }else{
                dbs.user.findByIdAndUpdate(thisAnswer.uid, {$push:{myAnswers:answer._id}}, (err, user)=>{
                  if(err){
                    console.error("saveNewAnswer: 评论id保存到用户集合失败" + __filename);
                    console.error(err);
                    cb(err,null);
                  }else{
                    cb(null,answer);
                    redis.get("q_"+thisAnswer.qid, (err, reply)=>{
                      if(err){
                        console.error("saveNewAnswer: 获取" + __filename);
                        console.error(err);
                        cb(err,null);
                      }else{
                        reply = JSON.parse(reply);
                        answer.author = {
                          _id: user._id,
                          nickName: user.nickName,
                          headPortrait: user.headPortrait
                        };
                        reply.answer.push(answer);
                        redis.set("q_"+thisAnswer.qid, JSON.stringify(reply));
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }else{
        console.error("saveNewAnswer: 第一个参数的结构出错 " + __filename);
      }
    }else{
      console.error("saveNewAnswer: 参数必须为thisAnswer(评论基本信息的json), cb(回调函数) " + __filename);
    }
  }else{
    console.error("saveNewAnswer: 参数必须为thisAnswer(评论基本信息的json), cb(回调函数) " + __filename);
  }
}
/*
* 刷新redis
*/
function flushdb(){
  redis.expire('lastQuestion',-1);
  redis.expire('10_question',-1);
  redis.expire('10_user',-1);
  redis.expire('10_s_question',-1);
}

methods = {
  flushdb,
  getAllTypes,
  getLastQuestion,
  getTopRewardQuestion,
  getTopUser,
  getTopQuestion,
  getQuestionById,
  saveNewQuestion
}

module.exports = methods;
