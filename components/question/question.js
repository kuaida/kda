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
    return {
      editorHtml: '',
    }
  },
  changeQuill(html) {
      this.setState( Object.assign( {}, this.state, {editorHtml:html} ) );
      // this.setState({editorHtml: html});
  },
  submit() {
    $.ajax({
      type: 'post',
      url: '/question/comment',
      data: {data: this.state.editorHtml, user: 'q', time: new Date()},
      dataType: 'json',
      success: function(data,status) {
        // console.log(data);
      }
    })
  },

  render(){
    return (
      <div className='question-main'>

        <Jumbotron className='question-title'>
          <h2>问题标题!</h2>
          <p>问题内容.水电费水电费收费是否说法个人个人供热哈哈和给对方会如何如何如何收到货今天以具体要看具体客户私人将同意就后天人格和人个人个人</p>
          <p>关键字：node,react</p>
          <Media>
           <Media className='question-img'>
              <img width={30} height={30} src="/assets/thumbnail.png" alt="Image"/>
              <span>用户名</span>
              <span>浏览量：10 </span><span> 倒计时：60</span>

            </Media>
          </Media>
          <p className='question-btn' backgroundColor={deepPurple300}><Button bsStyle="primary">收藏</Button></p>
          <p className='question-btn' backgroundColor={deepPurple300}><Button bsStyle="success">点赞</Button></p>
          <Row className="show-grid">
            <Col lg={12} md={12} sm={12} xs={12} className='question-answer'>
              <div>

                <div className='question-img'>
                <img width={30} height={30} src="/assets/thumbnail.png" alt="Image"/>
                <span>用户名: </span>
                <span>评论内容.</span>
                </div>
                <p className='question-btn' backgroundColor={deepPurple300}><Button bsStyle="danger">采纳</Button></p>
              </div>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} >
            <ReactQuill theme="snow"
            onChange={(html) => { this.changeQuill(html) }}
            placeholder={'please input'}
            />
            <p className="question-btn"><Button bsStyle="primary" onClick={this.submit}>提交</Button></p>
            </Col>
          </Row>


        </Jumbotron>


      </div>
    );
  }
})


ReactDOM.render(

  <Index />,

  document.getElementById('react-root')
);
