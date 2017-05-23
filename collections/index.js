const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/kdadb';
//const url = 'mongodb://192.168.1.11:27017/stu';

mongoose.connect(url);

let db = mongoose.connection;

db.once('open', function(){
  console.log('connect db ok!');
})

let Schema = mongoose.Schema;

let userSchema  = Schema({
  account:String,
  nickName:String,
  password:	String,
  gender:	Boolean,
  age:	Number,
  birthday:	String,
  myCollections:	[],
  myQuestions:	[],
  myAnswers:	[],
  alipayAccount:	String,
  balance:	Number
});

let questionSchema = Schema({
  title:String,
  type:[],
  content:String,
  author:Object,
  answerList:[],
  charge:Boolean,
  validTime:Number,
  money:Number,
  createTime:String,
  pageviews:Number
});

let answerSchema = Schema({
  question:Object,
  Content:String,
  answerTime:String,
  author:Object,
  adopt:Boolean,
  likeNum:Number
});

let typeSchema = Schema({
  	type:	String,
    questionIdList:	[]
});

let billSchema = Schema({
  consumptionRecord:[],
  rechargeRecord:[]
})
module.exports.user = mongoose.model('user', userSchema);
module.exports.question = mongoose.model('question',questionSchema);
module.exports.answer = mongoose.model('answer',answerSchema);
module.exports.type = mongoose.model('type',typeSchema);
module.exports.bill = mongoose.model('bill',billSchema);
