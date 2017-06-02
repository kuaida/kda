const dbs   = require('../collections');
const redis = require('./connect');
const times = {
  getAllTypes:60*60*12,
  getLastQuestion:60*10,
  getTopRewardQuestion:60*10,
  getTopUser:60*30,
  getTopQuestion:60*3
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
          dbs.question.find({}).limit(500).populate('author',{_id:1,nickName:1,headPortrait:1}).exec((err, docs)=>{
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
* @function 获得某一类的问题
* @param options 查询的条件,包括type,state
*     type 问题的类型 如"node.js",默认"all"
*     money 问题的状态 如悬赏"money",非悬赏"nomoney",默认"all"
*     state 问题的状态 提问中"asking",已解决"solve",默认"all"
* @param cb 回调函数,接受一个查询结果作为参数
*/
function getOneTypeQuestion(options,cb){
  if(typeof options == "function"){
    cb      = options;
    options = {
      type: "all",
      money: "all",
      state: "all"
    };
  }
  if(typeof options == "object"){
    options.type  = options.type  || "all";
    options.money = options.money || "all";
    options.state = options.state || "all";
  }
  if(typeof cb != "function"){
    console.error("getOneTypeQuestion:参数不是一个函数" + __filename);
    return;
  }
}


methods = {
  getAllTypes,
  getLastQuestion,
  getTopRewardQuestion,
  getTopUser,
  getTopQuestion
}

module.exports = methods;
