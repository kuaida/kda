import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import { deepPurple900 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Checkbox from 'material-ui/Checkbox';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ExpandTransition from 'material-ui/internal/ExpandTransition';
import TextField from 'material-ui/TextField';
const muiTheme = getMuiTheme({
  palette: {
    primary1Color: deepPurple900,
  }
});

class HorizontalTransition extends React.Component {

  constructor(props) {
     super(props);
     this.state = {
       loading: false,
       finished: false,
       stepIndex: 0,
       dis:0,
       numberList:0,
       userName:null,
     }
 }

  dummyAsync(cb) {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };

  handleNext() {
    const {stepIndex,numberList} = this.state;
    if (!this.state.loading) {
      if($('#email').val()){
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        var isok= reg.test($('#email').val());
        if (!isok) {
          $('.email_p_pu').html('邮箱格式不正确').addClass('color_red');
        }else{
          $('.email_p_pu').html('正在发送邮件，请稍等').addClass('color_green');
          $.ajax({
            type:'POST',
            url:'/resetPasswd/val',
            dataType:'json',
            data:{email:$('#email').val()},
            success:function(result){
              if(result.status == 1){
                this.dummyAsync(() => this.setState({
                  loading: false,
                  stepIndex: this.state.stepIndex + 1,
                  finished: this.state.stepIndex >= 2,
                  numberList:result.numberList,
                  userName:result.userName,
                }));
              }else if(result.status == 2){
                $('.email_p_pu').html('网络不佳，发送失败').addClass('color_yellow');
              }else{
                $('.email_p_pu').html('邮箱不存在,请先去注册').addClass('color_red');
              }
            }.bind(this)
          })
        }
      }

      if($('#val').val() == this.state.numberList){
        this.dummyAsync(() => this.setState({
          loading: false,
          stepIndex: this.state.stepIndex + 1,
          finished: this.state.stepIndex >= 2,
        }));
      }else{
          $('.val_p_pu').html('验证失败').addClass('color_red');
      }

      if($('#newPasswd').val()){
        if($('#newPasswd').val().length < 8){
          $('.mod_p_err').html('密码不能少于8位').addClass('color_red')
        }else{
          if($('#newPasswd').val() == $('#newPasswd1').val()){
            $.ajax({
              type:'POST',
              url:'/resetPasswd/mod',
              dataType:'json',
              data:{password:$('#newPasswd').val(),account:this.state.userName},
              success:(result) => {
                if(result){
                  this.dummyAsync((result) => this.setState({
                    loading: false,
                    stepIndex: this.state.stepIndex + 1,
                    finished: this.state.stepIndex >= 2,
                  }));
                }
              }
            })
          }else{
            $('.mod_p_err').html('两次密码不一致').addClass('color_red');
          }
        }
      }

    }
  };

  handlePrev() {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: this.state.stepIndex - 1,
      }));
    }
  };

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <div>
            <p className='email_p_pu'>我们将向您的邮箱发送验证码</p>
            <TextField id='email' style={{marginTop: 0}} floatingLabelText="输入您的账户邮箱" />
          </div>
        );
      case 1:
        return (
          <div>
          <p className='val_p_pu'>发送成功，请查收</p>
          <TextField style={{marginTop: 0}} id='val' floatingLabelText="输入验证码" />
          </div>
        );
      case 2:
        return (
          <div>
            <p className='mod_p_err'></p>
            <TextField style={{marginTop: 0}} id='newPasswd' type='password' floatingLabelText="输入新密码" />
            <TextField style={{marginTop: 0,float:'right'}} type='password' id='newPasswd1' floatingLabelText="确认新密码" />
          </div>
        );
      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }

  renderContent() {
    const {finished, stepIndex} = this.state;
    const contentStyle = {margin: '0 16px', overflow: 'hidden'};

    if (finished) {
      return (
        <div style={contentStyle}>
          <p>
            <a href="/login">
              修改成功，点击我去登陆把。
            </a>
          </p>
        </div>
      );
    }

    return (
      <div style={contentStyle}>
        <div>{this.getStepContent(stepIndex)}</div>
        <div style={{marginTop: 24, marginBottom: 12}}>
          <FlatButton
            label="返回上一步"
            disabled={stepIndex === 0}
            onTouchTap={this.handlePrev.bind(this)}
            style={{marginRight: 12}}
          />
          <RaisedButton
            label={stepIndex === 2 ? '完成' : '确认'}
            primary={true}
            onTouchTap={this.handleNext.bind(this)}
          />
        </div>
      </div>
    );
  }

  render() {
    const {loading, stepIndex} = this.state;

    return (
      <div style={{width: '100%', maxWidth: 700, margin: 'auto'}}>
        <Stepper activeStep={stepIndex}>
          <Step>
            <StepLabel>输入邮箱地址</StepLabel>
          </Step>
          <Step>
            <StepLabel>输入验证码</StepLabel>
          </Step>
          <Step>
            <StepLabel>设置新密码</StepLabel>
          </Step>
        </Stepper>
        <ExpandTransition loading={loading} open={true}>
          {this.renderContent()}
        </ExpandTransition>
      </div>
    );
  }

}

ReactDOM.render(
  <MuiThemeProvider muiTheme = { muiTheme }>
    <HorizontalTransition />
  </MuiThemeProvider>,
  document.getElementById('resetPasswd')
);
