import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactQuill from 'react-quill';
import { Grid, Row, Col, Clearfix } from 'react-bootstrap';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { deepPurple900, deepPurple300, yellowA700, grey500, green800, redA700, deepPurple800 } from 'material-ui/styles/colors';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
const QueryString = require('querystring');

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: deepPurple900,
  }
});

const [STATE_WILLDO,STATE_DO,STATE_DID] = ['willDo','doing','did'];

const styles = {
  colBottom: {
    marginBottom:'20px'
  },
  title: {
    fontSize:"18px",
    fontWeight:"bold"
  },
  nopayToggle: {
    backgroundColor:grey500,
    padding:"10px",
    paddingBottom:"4px",
    borderRadius:"2px"
  },
  payToggle:{
    backgroundColor:deepPurple800,
    padding:"10px",
    paddingBottom:"4px",
    borderRadius:"2px"
  },
  slider:{
    cursor:"pointer",
    marginTop:"10px",
    marginBottom:"15px",
    height:"25px"
  },
  cover:{
    position:"fixed",
    zIndex:"99",
    width:"100%",
    height:"100%",
    top:"0",
    left:"0",
    backgroundColor:"rgba(158,158,158,0.6)"
  },
  CircularProgress:{
    position:"absolute",
    top:"40%",
    left:"48%"
  }
};
/**
* this.state.state的各种值说明:
* 1 表示提交按钮可点击
* 2 表示正在提交内容
* 3 表示提交成功
* 4 表示提交提交内容失败
*/
class Publish extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      type: [],
      typeItems:[],
      editorHtml: '',
      pay: false,
      time: 1,
      count: 1,
      state:1
    }
  }
  componentWillMount(){
    fetch('/publish/getAllTypes')
    .then((response)=>{
      return response.json();
    })
    .then((allTypes)=>{
      this.setState(Object.assign({},this.state,{typeItems:allTypes.types}));
    })
    .catch((err)=>{
      console.log(err);
    });
  }
  typeItems(values){
    return this.state.typeItems.map((item)=>
      <MenuItem
        key={item._id}
        insetChildren={true}
        checked={values && values.indexOf(item.type) > -1}
        value={item.type}
        primaryText={item.type}
      />
    );
  }
  postQuestion(data){
    fetch('/publish/postQuestion',{
      method:"POST",
      headers: {
                "Content-Type": "application/x-www-form-urlencoded"
      },
      credentials: 'include',
      body:data
    })
    .then((response)=>{
      return response.json();
    })
    .then((json)=>{
      if(json.state==200){
        this.setState(Object.assign({},this.state,{state:3}));
        setTimeout(()=>{
          window.location.assign('/');
        },2000);
      }else if(json.state==400){
        this.setState(Object.assign({},this.state,{state:4}));
      }else if(json.state==300){
          window.location.assign('/login');
      }
    })
    .catch((err)=>{
      console.log(err);
    });
  }
  showInfo(state){
    if(state==2){
      return (
        <CircularProgress
            size={60}
            thickness={7}
            style={styles.CircularProgress}
        />
      );
    }else if(state==3){
      return (
          <div style={Object.assign({},styles.CircularProgress,{color:green800,fontWeight:"bold"})}>提交问题成功</div>
        );
    }else if(state==4){
      setTimeout(()=>{
        this.setState(Object.assign({},this.state,{state:1}));
      },2000);
      return (
        <div style={Object.assign({},styles.CircularProgress,{color:redA700,fontWeight:"bold"})}>提交失败</div>
      );
    }
  }
  buttonClick(){
    if(this.state.state==1){
      if(this.state.title&&this.state.type.length&&this.state.editorHtml){
          this.setState(Object.assign({},this.state,{state:2}));
          let data = QueryString.stringify(Object.assign({},this.state,{typeItems:null}));
          this.postQuestion(data);
      }
    }
  }
  changeCount(count){
    this.setState(Object.assign({},this.state,{count:count}));
  }
  changeTime(time){
    this.setState(Object.assign({},this.state,{time:time}));
  }
  changePay(isChecked){
    this.setState(Object.assign({},this.state,{pay:isChecked}));
  }
  changeType(val){
    if(val.length<=3){
      this.setState(Object.assign({},this.state,{type:val}));
    }
  }
  changeTitle( title ){
      this.setState( Object.assign( {}, this.state, {title:title} ) );
  }
  changeQuill(html) {
      this.setState( Object.assign( {}, this.state, {editorHtml:html} ) );
  }
  render() {
    return (
      <Grid>
          <Row>
            <Col lg={8} lgOffset={2} md={8} mdOffset={2} sm={8} smOffset={2} style={styles.colBottom}>
              <TextField
                hintText="来个标题"
                fullWidth={true}
                type="text"
                inputStyle={styles.title}
                onChange={ ( e, title )=>{ this.changeTitle( title ) } }
              />
            </Col>
            <Col lg={8} lgOffset={2} md={8} mdOffset={2} sm={8} smOffset={2} style={styles.colBottom}>
                <SelectField
                multiple={true}
                hintText="问题类别(1~3个)"
                fullWidth={true}
                value={this.state.type}
                onChange={( e, index, values )=>{ this.changeType(values) }}
                >
                  {this.typeItems(this.state.type)}
                </SelectField>
            </Col>
            <Col lg={8} lgOffset={2} md={8} mdOffset={2} sm={8} smOffset={2} style={styles.colBottom}>
              <ReactQuill theme="snow"
                          onChange={(html) => { this.changeQuill(html) }}
                          placeholder={this.props.placeholder}
              />
            </Col>
            <Col lg={3} lgOffset={2} md={4} mdOffset={2} sm={6} smOffset={2} xs={12} style={styles.colBottom}>
              <Toggle
                label={this.state.pay?"悬赏":"不悬赏"}
                labelStyle={this.state.pay?{color:"#fff"}:{}}
                style={this.state.pay?styles.payToggle:styles.nopayToggle}
                onToggle={( e, isChecked )=>{this.changePay(isChecked)}}
              />
            </Col>
            <Col lg={8} lgOffset={2} md={8} mdOffset={2} sm={8} smOffset={2} style={styles.colBottom,{display:this.state.pay?"block":"none"}}>
              <Row>
               <Col lg={6} md={6} sm={6} xs={12}>
                  <h4>悬赏在 <b　style={{color:deepPurple900}}>{this.state.time}</b> 小时后失效</h4>
                  <Slider
                    value={this.state.time}
                    min={1}
                    max={24}
                    step={1}
                    sliderStyle={styles.slider}
                    onChange={ ( e, time ) => { this.changeTime(time) } }
                    />
                </Col>
                <Col lg={6} md={6} sm={6} xs={12}>
                    <h4>悬赏金 <b style={{color:yellowA700}}>{this.state.count}</b> 快币</h4>
                    <Slider
                      value={this.state.count}
                      min={1}
                      max={500}
                      step={1}
                      sliderStyle={styles.slider}
                      onChange={ ( e, count ) => { this.changeCount(count) } }
                      />
                </Col>
              </Row>
            </Col>
            <Col lg={8} lgOffset={2} md={8} mdOffset={2} sm={8} smOffset={2}>
              <RaisedButton
                  disabled={this.state.state==1?false:true}　
                  label="提交"
                  labelStyle={{fontSize:"16px",fontWeight:"bold"}}
                  backgroundColor={deepPurple900}
                  labelColor="#fff"
                  disabledBackgroundColor= {deepPurple300}
                  disabledLabelColor={grey500}
                  fullWidth={true}
                  onTouchTap={ () => { this.buttonClick() } }
              />
            </Col>
          </Row>
          <div style={Object.assign({},styles.cover,{display:this.state.state==1?"none":"block"})}>
              {this.showInfo(this.state.state)}
          </div>
      </Grid>
    );
  }
}

ReactDOM.render(
  <MuiThemeProvider muiTheme={muiTheme}>
    <Publish placeholder="请描述您的问题..."/>
  </MuiThemeProvider>,
  document.getElementById('publish')
);
