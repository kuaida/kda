const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/kdadb';
//const url = 'mongodb://192.168.1.11:27017/stu';

mongoose.connect(url);

let db = mongoose.connection;

db.once('open', function(){
  console.log('connect db ok!');
})

let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

let userSchema = Schema({
  account:String,
  nickName:String,
  password:String,
  gender:Boolean,
  age:Number,
  birthday:String,
  myCollections:[{type:'ObjectId',ref:'question'}],
  myQuestions:[{type:'ObjectId',ref:'question'}],
  myAnswers:[{type:'ObjectId',ref:'question'}],
  alipayAccount:String,
  balance:Number,
  headPortrait:String,
  backgroundImage:String
});

let questionSchema = Schema({
  title:String,
  type:[],
  content:String,
  author:{type:'ObjectId',ref:'user'},
  answerList:[{type:'ObjectId',ref:'question'}],
  charge:Boolean,
  validTime:Number,
  money:Number,
  createTime:String,
  pageviews:Number
});

let answerSchema = Schema({
  question:Object{type:'ObjectId',ref:'question'},
  Content:String,
  answerTime:String,
  author:Object,
  adopt:Boolean,
  likers:[]
});

let typeSchema = Schema({
  type:	String,
  questionIdList:[{type:'ObjectId',ref:'question'}]
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
