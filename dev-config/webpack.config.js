var path = require('path');
var webpack = require('webpack');
const loaders = require('./webpack/loaders');
const plugins = require('./webpack/plugins');
const utils = require('./webpack/utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');  
const { APP_PATH, BUILD_PATH, PUBLIC_PATH } = require('./paths') 
    //获取命令行NODE_ENV环境变量,默认为development
const NODE_ENV = process.env.NODE_ENV || "development";

//判断当前是否处于开发状态下
const __DEV__ = NODE_ENV === "development";

//定义统一的Application，不同的单页面会作为不同的Application
const appsConfig = require("./apps.config");
const apps = appsConfig.apps;
//定义入口变量
let entry = {};

//根据不同的环境状态设置不同的开发变量
console.log(`-------------__DEV__:${__DEV__}`);
if (__DEV__) {
    //开发状态下的默认入口
    entry.dev = ['react-hot-loader/patch',
        `webpack-dev-server/client?http://0.0.0.0:${appsConfig.devServerConfig.port}`,
        'webpack/hot/only-dev-server'
    ];
}
entry.vendors = ['./dev-config/vendors.js']; //存放所有的公共文件

appsConfig.apps.forEach((n) => {
    n.compiled && (entry[n.id] = (n.src));
});
console.log(JSON.stringify(entry))

//设置开发时源代码映射工具
const devTool = __DEV__ ? 'cheap-module-eval-source-map' : 'hidden-source-map';

//基本配置
var config = {
    cache: false,
    entry,
    devtool: devTool,
    //所有的出口文件，注意，所有的包括图片等本机被放置到了dist目录下，其他文件放置到static目录下
    output: {
        path: BUILD_PATH, //生成目录
        publicPath: PUBLIC_PATH, //生成的公共目录
        filename: '[name].bundle.js', //文件名,不加chunkhash,以方便调试时使用
        sourceMapFilename: '[name].bundle.map', //映射名
        chunkFilename: '[name].[chunkhash].chunk.js', //块文件索引
    },
    resolve: appsConfig.resolve,
    //配置插件
    plugins: __DEV__ ?
        //开发环境下所需要的插件
        [].concat(plugins.commonPlugins).concat(plugins.devPlugins) :
        //生产环境下需要添加的插件
        [].concat(plugins.commonPlugins).concat(plugins.prodPlugins),
    module: {
        rules: [
            // loaders.jslint,
            loaders.jsx,
            loaders.style,
            loaders.assets,
            loaders.json
        ]
    },
    externals: utils.externals,
    target: 'web',
    devServer: appsConfig.devServerConfig
};


//定义HTML文件入口,默认的调试文件为src/index.html
var htmlPages = [];

//遍历定义好的app进行构造
apps.forEach(function(app) {

    //判断是否加入编译
    if (app.compiled === false) {
        //如果还未开发好,就设置为false
        return;
    }
    //添加入口
    config.entry[app.id] = app.src;

    //判断是否设置了HTML页面,如果设置了则添加
    if (app.indexPage) {
        //构造HTML页面
        htmlPages.push({
            filename: app.id + ".html",
            // favicon: path.join(__dirname, 'assets/images/favicon.ico'),
            template: `underscore-template-loader!${app.indexPage}`, //默认使用underscore作为模板
            inject: false, // 使用自动插入JS脚本,
            chunks: ["vendors", app.id], //选定需要插入的chunk名,
            //设置压缩选项
            minify: __DEV__ ? {} : {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        });
    }
});

//自动创建HTML代码
htmlPages.forEach(function(p) {
    config.plugins.push(new HtmlWebpackPlugin(p));
});
//如果是生成环境下，将文件名加上hash
// config.output.filename = '[name].bundle.[hash:8].js';
config.output.filename = '[name].bundle.js';

module.exports = config;