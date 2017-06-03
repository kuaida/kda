import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
// import ActionAndroid from 'material-ui/svg-icons/action/android';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import { deepPurple900, deepPurple300, yellowA700, grey500, green800, redA700, deepPurple800 } from 'material-ui/styles/colors';
import { Grid, Row, Col, Clearfix } from 'react-bootstrap';
import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';

import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';

const QueryString = require('querystring');

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


import getMuiTheme from 'material-ui/styles/getMuiTheme';
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: deepPurple900,
  }
});



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
      paddingBottom:16,
      marginBottom: 12,
      fontWeight: 400,
      borderBottomWrdth:0.5,
      borderBottomColor:'#999',
      borderBottomStyle:'solid',
    },
    tabs:{
      width:'100%',
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
      left:"85%",
    },
    hh3:{
      paddingLeft:"80%"
    },
    st:{
    paddingTop:15,
    boxSizing:"border-box"
  },
  hr:{
    margin:0
  },
  a:{
    color:'#333'
  },
  paper:{
    height: "100%",
    width: "100%",
    textAlign: 'left',
    display: 'inline-block',
  }
};

const Rstyles = {
  button: {
    width:170,
    height:170,
    // backgroundImage:url('http://img0.imgtn.bdimg.com/it/u=646551672,3473801352&fm=23&gp=0.jpg'),
    color:'red',
    position:'absolute',
    bottom:20,
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
    <RaisedButton label="编辑个人资料" secondary={true} style={styles.rbutton} buttonStyle={{backgroundColor:'gray'}}/>
  </div>
);

// const RaisedButtonExampleSimpleA = () => (
//   <div style={{position:"absolute",top:'85%',left:"70%"}}>
//     <RaisedButton label="确认修改" secondary={true} style={styles.rbutton} buttonStyle={{backgroundColor:'gray'}} type="submit"/>
//   </div>
// );



class RaisedButtonExampleComplexA extends React.Component{
  render(){
    return(
      <img   style={Rstyles.button} src='https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1495906819171&di=b2e3152c9fed35e4dc075fa016c03e82&imgtype=0&src=http%3A%2F%2Fimg0.ph.126.net%2FHdusTv3EtUlluC6EdtBnGg%3D%3D%2F999517642317344430.jpg'/>
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


class CardExampleWithAvatar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data:[],
    };
  }
  componentWillMount(){
    fetch('/userinfo/infodata',{
      method:"POST",
      headers: {
                "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: 'include',
    })
    .then((response)=>{
      return response.json();
    })
    .then((json)=>{
        this.setState({data:json});
    })
    .catch((err)=>{
      console.log(err);
    });
  }
  render(){
    return(
      <Card style={styles.card}>
      <RaisedButtonExampleComplex />
      <CardMedia>
      <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1495906588407&di=b2b86cbd547797b7d2df72a290d36ebc&imgtype=0&src=http%3A%2F%2Fimg4.178.com%2Fhots%2F201507%2F232141257200%2F232141467641.png" style={{width:'100%',height:300}} />
      </CardMedia>
      <RaisedButtonExampleComplexA />
      <div style={styles.info}>
      <h3>{this.state.data.nickName}</h3>
      </div>
      <CardHeader
      title="查看详细资料"
      actAsExpander={true}
      showExpandableButton={true}
      style={styles.info}
      />
      <CardText expandable={true} style={styles.info}>
      <p>帐 号: <strong>{this.state.data.account}</strong></p>
      <p>昵 称: <strong>{this.state.data.nickName}</strong></p>
      <p>年 龄: <strong>{this.state.data.age}</strong></p>
      <p>性 别: <strong>{this.state.data.gender}</strong></p>
      <p>生 日: <strong>{this.state.data.birthday}</strong></p>
      </CardText>
      <DialogExampleDialogDatePicker/>
      </Card>
    )
  }
};



class RaisedButtonExampleComplex extends React.Component{
  render(){
    return(
      <RaisedButton
      label="编辑封面图片"
      labelPosition="before"
      style={styles.button}
      containerElement="label"
      >
      <input type="file" style={styles.exampleImageInput} />
      </RaisedButton>
    )
  }
};


class TabsExampleControlled extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: 'a',
      data:[],
    };
  }

  handleChange(value){
    this.setState(Object.assign({},this.state,{value: value}));
  };


  componentWillMount(){
    fetch('/userinfo/userdata',{
      method:"POST",
      headers: {
                "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: 'include',
    })
    .then((response)=>{
      return response.json();
    })
    .then((json)=>{
        this.setState({data:json});
    })
    .catch((err)=>{
      console.log(err);
    });
  }

data(value){
    if (value=='a') {
      var data=[]
      this.state.data.map(function(value){
        data=value.myQuestions
      })
      if (data.length!==0) {
          data.map(function(a){
            return(
              <div style={styles.st}>
              <h4 style={{paddingLeft:25}}><a href="/question" style={styles.a}>{a.ref.title}</a></h4>
              <p style={styles.hh3}><i>{a.ref.createTime}</i></p>
              <hr style={styles.hr}/>
              </div>
            )
          })
      }else {
          return(
              <div style={styles.st}>
                <h4 style={{paddingLeft:25}}><a href="/publish" style={styles.a}>还没有提问,点我提问题</a></h4>
                <hr style={styles.hr}/>
              </div>
          )
      }
    }
    if (value=='b') {
      var data=[]
      this.state.data.map(function(value){
        data=value.myAnswers
      })
      if (data.length!==0) {
          data.map(function(a){
            return(
              <div style={styles.st}>
              <h4 style={{paddingLeft:25}}><a href="/question" style={styles.a}>{a.ref.title}</a></h4>
              <p style={styles.hh3}><i>{a.ref.createTime}</i></p>
              <hr style={styles.hr}/>
              </div>
            )
          })
      }else {
          return(
              <div style={styles.st}>
                <h4 style={{paddingLeft:25}}><a href="/" style={styles.a}>还没有回答,点我去回答</a></h4>
                <hr style={styles.hr}/>
              </div>
          )
      }
    }
    if (value=='c') {
      var data=[]
      this.state.data.map(function(value){
        data=value.myCollections
      })
      if (data.length!==0) {
          data.map(function(a){
            return(
              <div style={styles.st}>
              <h4 style={{paddingLeft:25}}><a href="/question" style={styles.a}>{a.ref.title}</a></h4>
              <p style={styles.hh3}><i>{a.ref.createTime}</i></p>
              <hr style={styles.hr}/>
              </div>
            )
          })
      }else {
          return(
              <div style={styles.st}>
                <h4 style={{paddingLeft:25}}><a href="/" style={styles.a}>还没有收藏,快去收藏</a></h4>
                <hr style={styles.hr}/>
              </div>
          )
      }
    }
}
  render() {
    return (
      <Tabs
        value={this.state.value}
        onChange={this.handleChange.bind(this)}
        style={styles.tabs}
      >
        <Tab label="问题" value="a">
            {this.data('a')}
        </Tab>
        <Tab label="回答" value="b">
          {this.data('b')}
        </Tab>
        <Tab label="收藏" value="c">
          {this.data("c")}
        </Tab>
      </Tabs>
    );
  }
}


class DialogExampleDialogDatePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }
  handleOpen(){
    this.setState({open: true});
  };

  handleClose(){
    this.setState({open: false});
  };
  infodata(info){
    let data = QueryString.stringify(info);
    console.log(data);
    if (data) {
      fetch('/userinfo/infodata',{
        method:"POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        credentials: 'include',
        body:data
      })
    }
  }
  val(){
    let text={}
    text.nickName=$('.v1 input').val()
    text.age=$('.v2 input').val()
    text.gender=$('.v3 input').val()
    text.birthday=$('.v4 input').val()
    text.totalReward=$('.v5 input').val()
    this.infodata(text)
  }
  render() {
    const actions = [
      <FlatButton
        label="返回"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose.bind(this)}
      />,
    ];
    return (
      <div>
        <RaisedButton label="修改个人资料" onTouchTap={this.handleOpen.bind(this)} style={styles.rb}/>
        <Dialog
          title="我的详细信息"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose.bind(this)}
        >
            <DividerExampleForm/>
            <div style={{position:"absolute",top:'85%',left:"70%"}}>
              <RaisedButton label="确认修改" secondary={true} style={styles.rbutton} buttonStyle={{backgroundColor:'gray'}} onTouchTap={()=>{this.val()}} href="/userinfo"/>
            </div>
        </Dialog>
      </div>
    );
  }
}

const style = {
  marginLeft: 20,
};
class DividerExampleForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      data:''
    }
  }
  componentWillMount(){
    fetch('/userinfo/infodata',{
      method:"POST",
      headers: {
                "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: 'include',
    })
    .then((response)=>{
      return response.json();
    })
    .then((json)=>{
        this.setState({data:json});
    })
    .catch((err)=>{
      console.log(err);
    });
  }
  render(){
    return(
      <Paper zDepth={2}>
      姓名:<TextField className="v1" hintText={this.state.data.nickName} style={style} underlineShow={false} />
      <Divider />
      年龄:<TextField className="v2" hintText={this.state.data.age} style={style} underlineShow={false} />
      <Divider />
      性别:<TextField className="v3" hintText={this.state.data.gender} style={style} underlineShow={false} />
      <Divider />
      生日:<TextField className="v4" hintText={this.state.data.birthday} style={style} underlineShow={false} />
      <Divider />
      支付宝:<TextField className="v5" hintText={this.state.data.totalReward} style={style} underlineShow={false} />
      <Divider />
      </Paper>
    )
  }
};


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
  <MuiThemeProvider muiTheme={muiTheme}>
    <Counter/>
  </MuiThemeProvider>,
  document.getElementById('index')
);
