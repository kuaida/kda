var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');


router.get('/', function(req, res, next) {
    res.render('userinfo', {
      user: req.session.user,
    });
})

router.post('/userdata',function(req,res,next){
  dbmodel.user.find({_id: req.session.user._id},function(err,data){
    res.json(data)
    // console.log(data);
  })
})

router.post('/infodata',function(req,res,next){
  if (req.body) {
    dbmodel.user.update({_id: req.session.user._id},{$set:req.body},function(err) {
      if (err) {
        console.log('错误'+err);
      }
    })
  }

  dbmodel.user.findOne({},function(err,data){
    res.json(data)
    // console.log(data);
  })
})

module.exports = router;
