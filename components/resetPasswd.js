import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();
import { deepPurple900 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
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
     }
 }

  dummyAsync(cb) {
    this.setState({loading: true}, () => {
      this.asyncTimer = setTimeout(cb, 500);
    });
  };

  handleNext() {
    const {stepIndex} = this.state;
    if (!this.state.loading) {
      this.dummyAsync(() => this.setState({
        loading: false,
        stepIndex: this.state.stepIndex + 1,
        finished: this.state.stepIndex >= 2,
      }));
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
            <p>我们将向您的邮箱发送验证码</p>
            <TextField style={{marginTop: 0}} floatingLabelText="输入您的账户邮箱" />
          </div>
        );
      case 1:
        return (
          <div>
          <p>发送成功，请查收</p>
            <TextField style={{marginTop: 0}} floatingLabelText="输入验证码" />
          </div>
        );
      case 2:
        return (
          <div>
            <TextField style={{marginTop: 0}} floatingLabelText="输入新密码" />
            <TextField style={{marginTop: 0,float:'right'}} floatingLabelText="确认新密码" />
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
            <a
              href="#"
              onClick={(event) => {
                event.preventDefault();
                this.setState({stepIndex: 0, finished: false});
              }}
            >
              Click here
            </a> to reset the example.
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
