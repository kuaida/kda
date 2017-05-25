var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('question',{'user':''});
});

router.post('/comment',function(data) {
  console.log(data.body.user);
  console.log(data.body.data);
  console.log(data.body.time);
  
  // let nowtime = new Date().valueOf();
  // let date3 = nowtime - data.body.time;
  //
  //
  // var days=Math.floor(date3 / (24 * 3600 * 1000))
  //
  // var leave1=date3 % (24 * 3600 * 1000)
  // var hours=Math.floor(leave1 / (3600 * 1000))
  //
  // var leave2=leave1 % (3600 * 1000)
  // var minutes=Math.floor(leave2 / (60 * 1000))
  //
  // var leave3=leave2 % (60 * 1000)
  // var seconds=Math.round(leave3 / 1000)
  //
  // var disAndTimeText;
  //
  // if(days>0) {
  //     var myText = '600m  '+days+'天前'
  //
  // }
  //
  // if(days==0&&hours>0) {
  //     var myText = '600m  '+hours+'小时前'
  //
  // }
  //
  // if(days==0&&hours==0&&minutes>0) {
  //     var myText = '600m  '+minutes+'分钟前'
  //
  // }
  //
  // if(days==0&&hours==0&&minutes==0&&seconds>0) {
  //     var myText = '600m  刚刚'
  //
  // }
})

module.exports = router;
