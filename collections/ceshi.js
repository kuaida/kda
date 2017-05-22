var db = require('./index');

const user = new db.user({
  account:'guohao@123.com',
  nickName:'jason',
  password:	'123',
  gender:	true,
  age:	25,
  birthday:	'1992/02/21',
  myCollections:	[{C1:'collection1'}],
  myQuestions:	[{q_id:'question1._id'}],
  myAnswers:	[{a_id:'answer1._id'}],
  alipayAccount:	'15191452136',
  balance:20
});
user.save((err) => {
  if (err) console.log(err);
  console.log('用户保存成功');
});


const question = new db.question({
  title:'问题1',
  type:['html','ejs'],
  content:'html和ejs有什么区别',
  author:{name:'guohao',id:'id'},
  answerList:[{a1:'a1.id'},{a2:'a2.id'}],
  charge:true,
  validTime:24,
  money:10,
  createTime:'2017/05/22 21:00',
  pageviews:100
});
question.save((err) => {
  if (err) console.log(err);
  console.log('问题保存成功');
});


const answer = new db.answer({
  question:{question:'question.title',id:'id'},
  Content:'html和ejs的区别:.......',
  answerTime:'2017/05/22 10:01',
  author:{author:'james',id:'id'},
  adopt:true,
  likeNum:200
});
answer.save((err) => {
  if (err) console.log(err);
  console.log('答案保存成功');
});

const type = new db.type({
    type:	'html',
    questionIdList:	['q_id1','q_id2']
});

type.save((err) => {
  if (err) console.log(err);
  console.log('分类保存成功');
});


const bill = new db.bill({
  consumptionRecord:[{time:'2017/05/30 21:02',money:'10'}],
  rechargeRecord:[{time:'2017/05/29 21:02',money:'10'}]
});

bill.save((err) => {
  if (err) console.log(err);
  console.log('账单保存成功');
});
