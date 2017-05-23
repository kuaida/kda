var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{user:''});
});

router.get('/userinfo',function(req,res,next){
  res.render('userinfo.ejs')
})
module.exports = router;
