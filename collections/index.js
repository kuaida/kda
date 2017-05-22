const mongoose = require('mongoose');
const url = 'mongodb://cnstu.top:27017/stu';
//const url = 'mongodb://192.168.1.11:27017/stu';
// 引入数据库操作
// 链接数据库
mongoose.connect(url);
// 文件句柄
let db = mongoose.connection;

db.once('open', function(){
  console.log('数据库链接成功');
})
// 引入模块
let Schema = mongoose.Schema;

let userShema = new Schema({
  // 放用户名
  name: {type: String, default: 'admin' },
  passwd: {type: String, default: 'admin' }
});

// 把user包装成一个模块 让其它调用
module.exports.User = mongoose.model('User', userShema);
