import React from 'react';
import ReactDOM from 'react-dom';
import Head from './views/head';
import { Router, Route } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import { Button, Col, Row, Media } from 'react-bootstrap';

// class Index extends React.Component {
//   render(){
//     return (
//       <div>
//         <h1>Hello</h1>
//       </div>
//     );
//   }
// }

var Index = React.createClass({
  render(){
    return (
      <div className='main'>
        <Row className="show-grid">
          <Col xs={12} md={8}><h1>{'Hello world'}</h1></Col>
          <Col xs={12} md={8}><h4>关键字：<small>react node</small></h4></Col>
          <Button bsStyle='primary'>收藏</Button>
          <Col xs={12} md={8}>
          <img width={30} height={30} src="" alt="Image"/>
          <span>浏览量：10</span><span>倒计时：60</span>
          </Col>
          <Col xs={12} md={8}><h2>问题内容</h2></Col>
        </Row>

      </div>
    );
  }
})


ReactDOM.render(
  <Index />,
  document.getElementById('react-root')
);
