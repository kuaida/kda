var express = require('express');
var router = express.Router();
// 引入db
var db = require('../collections')
// 加密用的
var bcrypt = require('bcrypt');
var salt = 10;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('./views/index.html');
});


// 直接登录的 路由
router.get ('/login',function(req, res, nest){
  res.render('login', { user: 'no',passwd: 'no'});
})

// 登录之后判断是否成功的路由
router.post('/login',function(req,res,next){
  // db.User.findOne 查询命令 db.User 是我们自己定的
  // 按条件查询 第一个参数是查询条件
  db.User.findOne({account:req.body.account},function(err,data){
    if(data){  // 查询出你输入的密码跟数据库的密码进行比较  bcrypt.compare 进行比较
      bcrypt.compare(req.body.passwd,data.passwd,function(err,hash){
        if(hash){
          res.redirect('/');
        }else{
          res.render('login',{user:'no',passwd:'yes'})
        }
      })
    }else {
      res.render('login',{user:'yes',passwd:'no'})
    }
  })
})

// 直接注册走的界面
router.get('/zhuce',function(req,res,next){
  res.render('zhuce',{cunzai: 'no'});
})

// 注册提交之后的界面
router.post('/zhuce',function(req,res,next){
  db.User.findOne({account:req.body.account},function(err,data){
    if(data){
      res.render('zhuce',{cunzai: 'yes'})
    }else{  // 创建一个实例化对象然后保存它
      var user = new db.User({
        account:req.body.account,
        passwd:req.body.passwd
      });
      // 给密码加密
      bcrypt.hash(req.body.passwd, salt,function(err,hash){
        user.passwd = hash;
        user.save(function(err){
          console.log(err);
          res.render('login',{user:'no',passwd:'no'})
        })
      })
    }
  })
})


module.exports = router;
