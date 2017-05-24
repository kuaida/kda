import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'material-ui/RaisedButton';
// import ActionAndroid from 'material-ui/svg-icons/action/android';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {green100, green500, green700} from 'material-ui/styles/colors';

const styles = {
  button: {
    margin: 12,
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
};


const CardExampleWithAvatar = () => (
  <Card>
    <CardMedia
      overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
    >
      <img src="" style={{width:'100%',height:240}} />
    </CardMedia>
    <CardTitle title="Card title" subtitle="Card subtitle" />
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

class Counter extends React.Component{
  render(){
    return(
      <div>
        <CardExampleWithAvatar />
        <RaisedButtonExampleComplex />
      </div>
    )
  }
}
// Counter.propTypes = {initialCount:React.PropTypes.number};
// Counter.defaultProps = {initialCount:0};

ReactDOM.render(
  <MuiThemeProvider>
    <Counter/>
  </MuiThemeProvider>,
  document.getElementById('uploadphoto')
);
