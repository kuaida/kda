var path = require('path');
var webpack = require('webpack');

var ROOT_PATH = path.resolve(__dirname);

let configs = {
  entry: {
    // vender: ['webpack/hot/dev-server', 'webpack-hot-middleware/client'], // 额外插件打包成vender
    vender:['react','react-dom','react-bootstrap'],
    publish: './components/publish.js',
    index: './components/index.js',
    userinfo: './components/userinfo/index.js',
    resetPasswd: './components/resetPasswd.js',
    question: './components/question/question.js',
  },
  output: {
    path: path.join(ROOT_PATH, 'public'),
    publicPath: '/', // output.path的相对路径
    filename: 'js/[name].js' // 根据原始名动态命名
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: ['style', 'css']
      }, {  // es6配置
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/ // 排除node_modules内的文件
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      compress: {
        warnings: false
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({ names:['vendor'] })
  ]
};

module.exports = configs;
