var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');


router.get('/', function(req, res, next) {
    res.render('userinfo', {
      user: 'ren',
    });
})

router.post('/userdata',function(req,res,next){
  dbmodel.user.find({nickName:req.session.user},function(err,data){
    res.json(data)
    console.log(data);
  })
})

router.post('/infodata',function(req,res,next){
  // console.log(req.body())
  dbmodel.user.findOne({nickName:req.session.user},function(err,data){
    res.json(data)
    console.log(data);
  })
})

module.exports = router;
