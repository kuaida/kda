import React from 'react';
import ReactDOM from 'react-dom';
import ReactQuill from 'react-quill';
import { Router, Route } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Button, Col, Row, Media, Jumbotron, Image } from 'react-bootstrap';
import { deepPurple900, deepPurple300, yellowA700, grey500, green800, redA700 } from 'material-ui/styles/colors';



var Index = React.createClass({
  getInitialState() {
    var userid = $('.question-user').text();
    var questionid = $('.question-id').text();
    return {
      editorHtml: '',
      like: [],
      collection: false,
      adopt: [],
      title: '',
      content: '',
      type: [],
      userid: userid,
      questionid: questionid,
      answer: [],
      btn: false,
      author: '',
      headPortrait: '',
      pageviews: '',
      adt: false,
      answerlist: [],
    }
  },
  componentDidMount: function() {
    var a = this;
    var btn = $('.question-user').text();
    var atr = $('.question-user').text();
    if (btn === '') {
      btn = true
    } else {
      btn = false
    };
    $.ajax({
      type: 'get',
      url: '/api/question/'+this.state.questionid,
      dataType: 'json',
      success: function(json) {
        var adoptArray = [];
        var likeArray = [];
        var answerid = [];
        var length = json.answer.length
        for (var i = 0; i < length; i++) {
          adoptArray.push(false)
        }
        for (var j = 0; j < length; j++) {
          likeArray.push(false)
        }
        for (var k = 0; k < length; k++) {
          answerid.push(json.answer[k].author)
        }
        console.log(answerid);
        if (json.question.author._id === atr) {
          atr = false
        } else {
          atr = true
        };
        a.setState({
          title: json.question.title,
          content: json.question.content,
          type: json.question.type,
          answer: json.answer,
          btn: btn,
          adopt: adoptArray,
          like: likeArray,
          author: json.question.author.nickName,
          headPortrait: json.question.author.headPortrait,
          pageviews: json.question.pageviews,
          adt: atr,
          answerlist: answerid,
        })
      }
    })
  },
  changeQuill(html) {
      this.setState( Object.assign( {}, this.state, {editorHtml:html} ) );
      // this.setState({editorHtml: html});
  },
  submit() {

    var user = $('.question-user').text();
    var id = $('.question-id').text();
    var thissub = this;
    $.ajax({
      type: 'post',
      url: '/api/question/comment',
      data: {Content: this.state.editorHtml, author: this.state.userid, answerTime: new Date(), question: this.state.questionid},
      dataType: 'json',
      success: function(data) {
        thissub.setState({
          answer: data.answer,
          editorHtml: ''
        })
      }
    })
  },

  likebtn(i) {
    var userid = $('.question-user').text();
    var questionid = $('.question-id').text();
    $.ajax({
      type: 'post',
      url: '/api/question/like/'+questionid+'/'+userid,
      data: {userid: this.state.userid, questionid: this.state.questionid},
      dataType: 'json',
      success: function(data,status) {
      }
    })
    var likes = this.state.like;
    likes[i] = !likes[i];
    this.setState({like: likes})
  },

  collection() {
    var userid = $('.question-user').text();
    var questionid = $('.question-id').text();
    $.ajax({
      type: 'post',
      url: '/api/question/collection/'+questionid+'/'+userid,
      data: {userid: this.state.userid, questionid: this.state.questionid},
      dataType: 'json',
      success: function(data,status) {
      }
    })
    this.setState({collection: !this.state.collection})
  },

  adopt(i) {
    var userid = $('.question-user').text();
    var questionid = $('.question-id').text();
    $.ajax({
      type: 'post',
      url: '/api/question/adopt/'+questionid+'/'+userid,
      data: {userid: this.state.userid, questionid: this.state.questionid, state:this.state.adopt[i], user: this.state.answerlist[i]._id},
      dataType: 'json',
      success: function(data,status) {
      }
    })
    var d = this.state.adopt;
    d[i] = !d[i]
    console.log(this.state.adopt);
    this.setState({adopt: d,
                   adt: true,
                  })
  },

  adoptstate(i) {
    var e = this.state.adopt;
    return e[i] ? '已采' : '采纳'
  },

  likestate(i) {
    var f = this.state.like;
    return f[i] ? '已赞' : '点赞'
  },

  render(){

    var text1 = this.state.collection ? '已收藏' : '收藏';

    return (
      <div className="question-body">
      <div className='question-main'>
        <div className="question-left">
          <p className='question-btn' backgroundColor={deepPurple300}><Button bsStyle="primary" disabled={this.state.btn} onClick={this.collection}>{text1}</Button></p>
          <div className="question-left-width">
          <h2><i className="fa fa-handshake-o" aria-hidden="true"></i>{this.state.title}</h2>
          <h4 className="question-content" dangerouslySetInnerHTML={{__html:this.state.content}}></h4>
          <p className="question-content">关键字：{this.state.type.map(function(data) {
            return(
              <span className="question-type">{data}</span>
            )
          })}</p>
          <Image className="question-image question-content" src={this.state.headPortrait} circle />
          <span className="question-author">{this.state.author}</span>
          <span className="question-author">被浏览{this.state.pageviews}次</span>
          </div>
        </div>

          <Row className="show-grid">
            {this.state.answer.map(function(data,i) {
              return (
                <div key={i}>
                  <Col lg={12} md={12} sm={12} xs={12} className='question-answer'>
                    <div className='question-img'>
                      <Image className="question-image" src={data.author.headPortrait} circle />
                      <span className="question-font">{data.author.nickName}</span>

                      <div className="question-font1" dangerouslySetInnerHTML={{__html:data.Content}}></div>
                      <Col lg={12} md={12} sm={12} xs={12} className="question-btn1">
                      <Button className="question-btn1" bsStyle="primary" disabled={this.state.adt} onClick={this.adopt.bind(this,i)}>{this.adoptstate.bind(this,i)()}</Button>
                      <Button className="question-btn1" bsStyle="success" disabled={this.state.btn} onClick={this.likebtn.bind(this,i)}>{this.likestate.bind(this,i)()}</Button>
                      </Col>
                    </div>
                  </Col>
                </div>
              )
            }.bind(this)
          )}
          </Row>
          <Row className="show-grid question-input">
            <Col lg={12} md={12} sm={12} xs={12} >
            <ReactQuill theme="snow"
            onChange={(html) => { this.changeQuill(html) }}
            placeholder={'please input'}
            value={this.state.editorHtml}
            />

            <p className="question-btn"><Button bsStyle="primary" disabled={this.state.btn} onClick={this.submit}>提交</Button></p>
            </Col>
          </Row>
      </div>
      <div className="question-question">

      </div>
      </div>
    );
  }
})


ReactDOM.render(

  <Index />,

  document.getElementById('react-root')
);
