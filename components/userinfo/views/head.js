import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

class Head extends Component {
  render(){
    return (
      <div>
        <h1>Hello {this.props.name}</h1>
        <form class="" action="/userinfo" method="get">
        <Button bsStyle="primary" type='submit'>确定</Button>
        </form>
      </div>
    )
  }

}

module.exports = Head;
