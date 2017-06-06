const mongoose = require('mongoose');
const url = 'mongodb://127.0.0.1:27017/kdadb';

mongoose.Promise = global.Promise;
mongoose.connect(url);

let db = mongoose.connection;

db.once('open', function(){
  console.log('connect db ok!');
})

let Schema = mongoose.Schema;
let ObjectId = Schema.Types.ObjectId;

let userSchema = Schema({
  account: {
    type: 'String',
    requried: true
  },
  nickName: {
    type: 'String',
    default: 'user'
  },
  password: {
    type: 'String',
    required: true
  },
  gender: {
    type: 'Boolean',
    default: true
  },
  age: {
    type: 'Number',
    default: 0
  },
  birthday: {
    type: 'String',
    default: '1990-01-01'
  },
  myCollections: [
    {
      type: 'ObjectId',
      ref: 'question'
    }
  ],
  myQuestions: [
    {
      type: 'ObjectId',
      ref: 'question'
    }
  ],
  myAnswers: [
    {
      type: 'ObjectId',
      ref: 'answer'
    }
  ],
  alipayAccount: {
    type: 'String',
    default: ''
  },
  balance: {
    type: 'Number',
    default: 100
  },
  headPortrait: {
    type: 'String',
    default: '/images/head.jpg'
  },
  backgroundImage: {
    type: 'String',
    default: ''
  },
  totalReward: {
    type: 'Number',
    default: 0
  }
});

let questionSchema = Schema({
  title: {
    type: 'String',
    default: ''
  },
  type: [],
  content: {
    type: 'String',
    default: ''
  },
  author: {
    type: 'ObjectId',
    ref: 'user'
  },
  answerList: [
    {
      type: 'ObjectId',
      ref: 'answer'
    }
  ],
  charge: {
    type: 'Boolean',
    default: false
  },
  validTime: {
    type: 'Number',
    default: 0
  },
  money: {
    type: 'Number',
    default: 0
  },
  createTime: {
    type: 'String',
    default: ''
  },
  pageviews: {
    type: 'Number',
    default: 0
  }
});

let answerSchema = Schema({
  question: {
    type: 'ObjectId',
    ref: 'question'
  },
  Content: {
    type: 'String',
    default: ''
  },
  answerTime: {
    type: 'String',
    default: ''
  },
  author: {
    type: 'ObjectId',
    ref: 'user'
  },
  adopt: {
    type: 'Boolean',
    default: false
  },
  likers: []
});

let typeSchema = Schema({
  type: {
    type: 'String',
    default: ''
  },
  questionIdList: [
    {
      type: 'ObjectId',
      ref: 'question'
    }
  ]
});

let billSchema = Schema({
  consumptionRecord: [],
  rechargeRecord: []
})
module.exports.user = mongoose.model('user', userSchema);
module.exports.question = mongoose.model('question',questionSchema);
module.exports.answer = mongoose.model('answer',answerSchema);
module.exports.type = mongoose.model('type',typeSchema);
module.exports.bill = mongoose.model('bill',billSchema);
