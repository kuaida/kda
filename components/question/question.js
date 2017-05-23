import React from 'react';
import ReactDOM from 'react-dom';
import ReactQuill from 'react-quill';
import { Router, Route } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Button, Col, Row, Media, Jumbotron } from 'react-bootstrap';
import { deepPurple900, deepPurple300, yellowA700, grey500, green800, redA700 } from 'material-ui/styles/colors';



var Index = React.createClass({
  changeQuill(html) {
      this.setState( Object.assign( {}, this.state, {editorHtml:html} ) );
  },

  render(){
    return (
      <div className='question-main'>

        <Jumbotron className='question-title'>
          <h1>问题标题!</h1>
          <p>问题内容.</p>
          <p>关键字：node,react</p>
          <Media>
           <Media className='question-img'>
              <img width={30} height={30} src="/assets/thumbnail.png" alt="Image"/>
              <span>用户名</span>
              <span>浏览量：10 </span><span> 倒计时：60</span>

            </Media>
          </Media>
          <p><Button bsStyle="primary">收藏</Button></p>
          <Row className="show-grid">
            <Col lg={12} md={12} sm={12} xs={12} className='question-answer'>
              <div>
                <h1>问题标题!</h1>
                <Media className='question-img'>
                <img width={30} height={30} src="/assets/thumbnail.png" alt="Image"/>
                <span>用户名: </span>
                <span>评论内容.</span>
                </Media>
              </div>
            </Col>
            <Col lg={12} md={12} sm={12} xs={12} >
            <ReactQuill theme="snow"
            onChange={(html) => { this.changeQuill(html) }}
            placeholder={'please input'}
            />
            <p className="question-btn"><Button bsStyle="primary">提交</Button></p>
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
