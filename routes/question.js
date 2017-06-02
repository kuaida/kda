var express = require('express');
var router = express.Router();
var dbmodel = require('../collections');

/* GET home page. */
router.get('/:id', function(req, res, next) {
  res.render('question',{'user': req.session.user, 'questionid': req.params.id});
});

module.exports = router;
