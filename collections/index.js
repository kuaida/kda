const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/kdadb';
//const url = 'mongodb://192.168.1.11:27017/stu';

mongoose.connect(url);

let db = mongoose.connection;

db.once('open', function(){
  console.log('connect db ok!');
})

let Schema = mongoose.Schema;

let userSchema = Schema({
  account:String,
  nickName:String,
  password:String,
  gender:Boolean,
  age:Number,
  birthday:String,
  myCollections:[{type:'Object',ref:'question'}],
  myQuestions:[{type:'Object',ref:'question'}],
  myAnswers:[{type:'Object',ref:'question'}],
  alipayAccount:String,
  balance:Number,
  headPortrait:String,
  backgroundImage:String
});

let questionSchema = Schema({
  title:String,
  type:[],
  content:String,
  author:{type:'Object',ref:'user'},
  answerList:[{type:'Object',ref:'question'}],
  charge:Boolean,
  validTime:Number,
  money:Number,
  createTime:String,
  pageviews:Number
});

let answerSchema = Schema({
  question:Object{type:'Object',ref:'question'},
  Content:String,
  answerTime:String,
  author:Object,
  adopt:Boolean,
  likers:[]
});

let typeSchema = Schema({
  type:	String,
  questionIdList:[{type:'Object',ref:'question'}]
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
