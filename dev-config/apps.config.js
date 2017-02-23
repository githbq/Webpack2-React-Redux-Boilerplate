/**
 * Created by apple on 16/6/8.
 */

const { ROOT_PATH, APP_PATH, BUILD_PATH, NODE_ENV, __DEV__,TEMPLATE_PATH } = require('./paths'); 
const path = require('path');
module.exports = {

    //基本的应用配置信息
    apps: [
        //HelloWorld
        {
            id: "index",
            src: "./src/simple/helloworld/helloworld",
            indexPage: TEMPLATE_PATH,
            compiled: true
        },
        {
            id: "react",
            src: "./src/react/react_app",
            indexPage: TEMPLATE_PATH,
            compiled: false
        },
        {
            id: "redux",
            src: "./src/redux/redux_app",
            indexPage: TEMPLATE_PATH,
            compiled: false
        }
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.json'], // '' 移给enforceExtension配置
        enforceExtension: false, // true : 不匹配 ''
        modules: [APP_PATH, 'node_modules'],
        // 设置路径别名
        alias: {
            // img: path.join(APP_PATH, 'img'),
        },
        // plugins: [new DirectoryNamedWebpackPlugin()],
    }, 
    //用于服务端渲染的Server路径
    ssrServer: {
        serverEntrySrc: './src/react/ssr_server.js'
    },

    //依赖项配置
    proxy: {
        //后端服务器地址 http://your.backend/
        backend: "",
    },

    //如果是生成的依赖库的配置项
    library: {
        name: "library_portal", //依赖项入口名
        entry: "./src/simple/library/library_portal.js", //依赖库的入口,
        libraryName: "libraryName", //生成的挂载在全局依赖项下面的名称
        libraryTarget: "var" //挂载的全局变量名
    }
};