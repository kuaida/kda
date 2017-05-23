var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{user:'ren'});
});

router.get('/userinfo',function(req,res,next){
  res.render('userinfo',{user:'ren'})
})
module.exports = router;
