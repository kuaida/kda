const redis = require('redis');
const client= redis.createClient({
  host:'127.0.0.1',
  port:6379,
  password:'ikda.cc'
});

client.on('connect',(err)=>{
  if(err){
    console.log('Redis connect error');
    console.log(err);
  }else{
    console.log('Redis connect OK');
  }
});

module.exports = client;
