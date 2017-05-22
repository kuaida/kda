var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('./views/index.html');
});

router.get('/resetPasswd', function(req, res, next) {
  res.sendfile('./views/resetPasswd.html');
});

module.exports = router;
