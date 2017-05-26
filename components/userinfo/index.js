import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
// import ActionAndroid from 'material-ui/svg-icons/action/android';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {green100, green500, green700} from 'material-ui/styles/colors';
import { Grid, Row, Col, Clearfix } from 'react-bootstrap';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
const styles = {
  button: {
    margin: 12,
    position:'absolute',
    top:50,
    left:'82%',
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: '100%',
    opacity: 0,
  },
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  tabs:{
    width:'100%'
  },
  card:{
    position:'relative'
  },
  info:{
    width:"50%",
    paddingLeft:220,
  },
  rbutton:{
    margin: 12,
  },
  rb:{
    position:'absolute',
    top:"85%",
    left:"85%"
  }
};

const Rstyles = {
  button: {
    width:170,
    height:170,
    // backgroundImage:url('http://img0.imgtn.bdimg.com/it/u=646551672,3473801352&fm=23&gp=0.jpg'),
    color:'red',
    position:'absolute',
    top:250,
    left:"2%"
  },
  exampleImageInput: {
    cursor: 'pointer',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    width: "100%",
    opacity: 0,
  },
};


const RaisedButtonExampleSimple = () => (
  <div style={styles.rb}>
    <RaisedButton label="编辑个人资料" secondary={true} style={styles.rbutton} />
  </div>
);

class RaisedButtonExampleComplexA extends React.Component{
  render(){
    return(
      <img   style={Rstyles.button} src='http://t2.27270.com/uploads/tu/201702/427/26.png'/>
      // <RaisedButton
      // label="修改我的个人头像"
      // labelPosition="before"
      //
      // containerElement="label"
      // >
      // <input type="file" style={styles.exampleImageInput} />
      // </RaisedButton>
    )
  }
}


const CardExampleWithAvatar = () => (
  <Card style={styles.card}>
  <RaisedButtonExampleComplex />
    <CardMedia>
      <img src="http://t2.27270.com/uploads/tu/201703/40/24.png" style={{width:'100%',height:300}} />
    </CardMedia>
    <RaisedButtonExampleComplexA />
    <div style={styles.info}>
      <h3>我叫张三</h3>
      <p>一句话介绍自己</p>
    </div>
    <CardHeader
     title="查看详细资料"
     actAsExpander={true}
     showExpandableButton={true}
     style={styles.info}
   />
   <CardText expandable={true} style={styles.info}>
    我的资料
   </CardText>
   <RaisedButtonExampleSimple />
  </Card>
);

const RaisedButtonExampleComplex = () => (
    <RaisedButton
    label="编辑封面图片"
    labelPosition="before"
    style={styles.button}
    containerElement="label"
    >
      <input type="file" style={styles.exampleImageInput} />
    </RaisedButton>
);

class TabsExampleControlled extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'a',
    };
  }

  handleChange(value){
    this.setState({
      value: value,
    });
  };

  render() {
    return (
      <Tabs
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
        style={styles.tabs}
      >
        <Tab label="动态" value="a">
          <div>
            <h2 style={styles.headline}>我的动态</h2>
            <p>
              <h3>题目:</h3>
            </p>
          </div>
        </Tab>
        <Tab label="回答" value="b">
          <div>
            <h2 style={styles.headline}>我的回答</h2>
            <p>
              This is another example of a controllable tab. Remember, if you
              use controllable Tabs, you need to give all of your tabs values or else
              you wont be able to select them.
            </p>
          </div>
        </Tab>
        <Tab label="提问" value="c">
          <div>
            <h2 style={styles.headline}>我的提问</h2>
            <p>
              This is another example of a controllable tab. Remember, if you
              use controllable Tabs, you need to give all of your tabs values or else
              you wont be able to select them.
            </p>
          </div>
        </Tab>
        <Tab label="收藏" value="d">
          <div>
            <h2 style={styles.headline}>我的收藏</h2>
            <p>
              This is another example of a controllable tab. Remember, if you
              use controllable Tabs, you need to give all of your tabs values or else
              you wont be able to select them.
            </p>
          </div>
        </Tab>
      </Tabs>
    );
  }
}


class Counter extends React.Component{
  render(){
    return(
      <div>
        <CardExampleWithAvatar />
        <TabsExampleControlled/>
      </div>
    )
  }
}



ReactDOM.render(
  <MuiThemeProvider>
    <Counter/>
  </MuiThemeProvider>,
  document.getElementById('index')
);
