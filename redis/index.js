const dbs   = require('../collections');
const redis = require('./connect');
const times = {
  getAllTypes:60*60,
  getLastQuestion:60*5,
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
    redis.get('allTypes',(err,reply)=>{
      if(err){
        console.error('getAllTypes: get获取缓存错误:'+ __filename);
      }else{
        if(reply){
          cb(JSON.parse(reply).data);
        }else{
          dbs.type.find({},['_id','type'],(err,types)=>{
            if(err){
              console.error('getAllTypes: 查询type集合出现错误:' + __filename);
            }else{
              redis.set('allTypes',JSON.stringify({data:types}));
              redis.expire('allTypes',times.getAllTypes);
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
* @function 获得最近的200条提问
* @param cb 回调函数,接受一个查询结果作为参数
*/
function getLastQuestion(cb){
  if(typeof cb == 'function'){
    redis.get('lastQuestion',(err,reply)=>{
      if(err){
        console.error('getLastQuestion: get获取缓存错误:'+ __filename);
      }else{
        if(replay){
          cb(JSON.parse(reply));
        }else{
          dbs.question.find({}).limit(200).populate('author',{_id:1,nickName:1,headPortrait:1}).exec((err,docs)=>{
            if(err){
              console.error('getLastQuestion: get获取数据库数据失败:'+ __filename);
            }else{
              redis.set('lastQuestion',JSON.stringify(docs));
              redis.expire('lastQuestion',times.getLastQuestion);
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
redis.zrange('question',0,9,(err,v)=>{
  if(err){
    console.error(err);
  }else{
    if(v.length){
      return;
    }else{
      dbs.question.where({'charge':true}).select('_id title money pageviews').limit(1000).exec((err,docs)=>{
        if(err){
          console.error(err);
        }else{
          docs.forEach((doc)=>{
            redis.zadd('question',doc.money,JSON.stringify(doc));
          });
        }
      });
    }
  }
});
function getTopRewardQuestion(cb){
  if(typeof cb == 'function'){
    redis.zrevrange('question',0,9,(err,reply)=>{
      if(err){
        console.error('getTopRewardQuestion: zrevrange获取缓存错误:'+ __filename);
      }else{
        let question = [];
        reply.forEach((cur)=>{
          question.push(JSON.parse(cur));
        });
        cb(question);
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
redis.zrange('user',0,9,(err,v)=>{
  if(err){
    console.error(err);
  }else{
    if(v.length){
      return;
    }else{
      dbs.user.where({}).select('_id nickName headPortrait totalReward').limit(1000).exec((err,docs)=>{
        if(err){
          console.error(err);
        }else{
          docs.forEach((doc)=>{
            redis.zadd('user',doc.totalReward,JSON.stringify(doc));
          });
        }
      });
    }
  }
});
function getTopUser(cb){
  if(typeof cb == 'function'){
    redis.zrevrange('user',0,9,(err,reply)=>{
      if(err){
        console.error('getTopUser: zrevrange获取缓存错误:'+ __filename);
      }else{
        let user = [];
        reply.forEach((cur)=>{
          user.push(JSON.parse(cur));
        });
        cb(user);
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
redis.zrange('topQuestion',0,9,(err,v)=>{
  if(err){
    console.error(err);
  }else{
    if(v.length){
      return;
    }else{
      dbs.question.where({}).select('_id title pageviews').limit(1000).exec((err,docs)=>{
        if(err){
          console.error(err);
        }else{
          docs.forEach((doc)=>{
            redis.zadd('topQuestion',doc.pageviews,JSON.stringify(doc));
          });
        }
      });
    }
  }
});
function getTopQuestion(cb){
  if(typeof cb == 'function'){
    redis.zrevrange('topQuestion',0,9,(err,reply)=>{
      if(err){
        console.error('getTopQuestion: zrevrange获取缓存错误:'+ __filename);
      }else{
        let topQuestion = [];
        reply.forEach((cur)=>{
          topQuestion.push(JSON.parse(cur));
        });
        cb(topQuestion);
      }
    });
  }else{
    console.error('getTopQuestion函数的参数错误' + __filename);
  }
}
/*
* @function 热搜榜前10
* @param cb 回调函数,接受一个查询结果作为参数
*/
function getOneTypeQuestion(){

}

methods = {
  getAllTypes,
  getLastQuestion,
  getTopRewardQuestion,
  getTopUser,
  getTopQuestion
}

module.exports = methods;
