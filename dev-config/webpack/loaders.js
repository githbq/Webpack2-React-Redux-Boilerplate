/**
 * Created by apple on 16/10/9.
 */
'use strict';
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

//获取命令行NODE_ENV环境变量,默认为development
var NODE_ENV = process.env.NODE_ENV || "development";

//判断当前是否处于开发状态下
var __DEV__ = NODE_ENV === "development";
const babelLoaderConfig = {
  presets: ['latest', 'stage-0', 'react'],  // 开启ES6、部分ES7、react特性, preset相当于预置的插件集合
  plugins: [['import', {libraryName: 'antd', style: true}]],  // antd模块化加载, https://github.com/ant-design/babel-plugin-import
  cacheDirectory: true,
};

//基于Babel的JS/JSX Loader
exports.jsx = {
  test: /\.(jsx)$/,
  exclude: /(node_modules)/,
  use: [
    'babel-loader',
  ],
};

//开发阶段不参与
// //对于JS与JSX的格式校验
// exports.jslint = {
//   enforce: 'pre',
//   test: /\.(js|jsx)$/,
//   exclude: /(node_modules)/,
//   use: [
//     'eslint-loader',
//   ],
// };

// //对于TS与TSX的Loader
// exports.tsx = {
//   test: /\.ts|tsx?$/,
//   exclude: /node_modules/,
//   use: [
//     'awesome-typescript-loader'
//   ]
// };

// //对于TS与TSX的校验
// exports.tslint = {
//   test: /\.tsx?$/,
//   exclude: /node_modules/,
//   use: [
//     'tslint-loader'
//   ]
// };
//end 开发阶段不参与

//根据不同的环境开发设置不同的样式加载的Loader
var sassLoaderSuffix = '?outputStyle=expanded&sourceMap=true&sourceMapContents=true&includePaths[]=./node_modules'

if (NODE_ENV === "development") {
  //如果当前为开发环境,则封装内联的CSS
  exports.style = {
    test: /\.(scss|sass|css)$/,
    use: [
      'style-loader',
      'css-loader',
      'postcss-loader',
      'sass-loader' + sassLoaderSuffix
    ]
  };
} else {

  //如果当前为编译环境,则抽取出CSS代码
  exports.style = {
    test: /\.(scss|sass|css)$/,
    use: ExtractTextPlugin.extract({
      use: 'css-loader!postcss-loader!sass-loader' + sassLoaderSuffix
    })
  };

}

//对于图片与字体文件的导入工具,并且设置默认的dist中存放方式
// inline base64 URLs for <=8k images, direct URLs for the rest
exports.assets = {
  test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|gif|mp4|webm)(\?\S*)?$/,
  loader: 'url-loader?limit=8192&name=assets/imgs/[hash].[ext]'
};

//对于JSON文件的导入
exports.json = {
  test: /\.json$/,
  loader: 'json'
};