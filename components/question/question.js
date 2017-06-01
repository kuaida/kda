import React from 'react';
import ReactDOM from 'react-dom';
import ReactQuill from 'react-quill';
import { Router, Route } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Button, Col, Row, Media, Jumbotron } from 'react-bootstrap';
import { deepPurple900, deepPurple300, yellowA700, grey500, green800, redA700 } from 'material-ui/styles/colors';



var Index = React.createClass({
  getInitialState() {
    var apt = $('.question-like').text();
    if (apt === 'true') {
      apt = true
    } else {
      apt = false
    };
    var userid = $('.question-user').text();
    var questionid = $('.question-id').text();
    return {
      editorHtml: '',
      like: false,
      collection: false,
      adopt: apt,
      title: '',
      content: '',
      type: [],
      userid: userid,
      questionid: questionid,
      answer: [],

    }
  },
  componentDidMount: function() {
    var a = this;
    $.ajax({
      type: 'get',
      url: '/api/question/'+this.state.questionid,
      dataType: 'json',
      success: function(json) {
        a.setState({
          title: json.question.title,
          content: json.question.content,
          type: json.question.type,
          answer: json.answer
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
    $.ajax({
      type: 'post',
      url: '/api/question/comment',
      data: {Content: this.state.editorHtml, author: this.state.userid, answerTime: new Date(), question: this.state.questionid},
      dataType: 'json',
      success: function(data,status) {
        // console.log(data);
      }
    })
  },

  likebtn() {
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
    this.setState({like: !this.state.like})
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

  adopt() {
    var userid = $('.question-user').text();
    var questionid = $('.question-id').text();
    $.ajax({
      type: 'post',
      url: '/api/question/adopt/'+questionid+'/'+userid,
      data: {userid: this.state.userid, questionid: this.state.questionid, state:this.state.adopt},
      dataType: 'json',
      success: function(data,status) {
      }
    })
    this.setState({adopt: !this.state.adopt})
  },

  render(){
    var text = this.state.like ? '取消' : '点赞';
    var text1 = this.state.collection ? '已收藏' : '收藏';
    var text2 = this.state.adopt ? '已采纳' : '采纳';
    return (
      <div className='question-main'>
        <div className="question-question">
          <div className="question-left">
          <p className='question-btn' backgroundColor={deepPurple300}><Button bsStyle="primary" onClick={this.collection}>{text1}</Button></p>
          <div className="question-left-width">
          <h2><i className="fa fa-handshake-o" aria-hidden="true"></i>{this.state.title}</h2>
          <h4>{this.state.content}</h4>
          <p>关键字：{this.state.type.map(function(data) {
            return(
              <span>{data}</span>
            )
          })}</p>
          </div>
          </div>
          </div>

          <Row className="show-grid">
            {this.state.answer.map(function(data) {
              return (
                <div>
                  <Col lg={12} md={12} sm={12} xs={12} className='question-answer'>
                    <div className='question-img'>
                      <span>用户名：</span>
                      <span>{data.Content}</span>
                    </div>
                  </Col>
                  <Col lg={12} md={12} sm={12} xs={12} className="question-btn1">
                  <Button className="question-btn1" bsStyle="primary" onClick={this.adopt}>{text2}</Button>
                  <Button className="question-btn1" bsStyle="success" onClick={this.likebtn}>{text}</Button>
                  </Col>
                </div>
              )
            }.bind(this)
          )}
          </Row>
          <Row className="show-grid">
            <Col lg={12} md={12} sm={12} xs={12} >
            <ReactQuill theme="snow"
            onChange={(html) => { this.changeQuill(html) }}
            placeholder={'please input'}
            />
            <p className="question-btn"><Button bsStyle="primary" onClick={this.submit}>提交</Button></p>
            </Col>
          </Row>
      </div>
    );
  }
})


ReactDOM.render(

  <Index />,

  document.getElementById('react-root')
);
