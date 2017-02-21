const { PUBLIC_PATH, APP_PATH,BUILD_PATH } = require('./paths')

const config = {
    hot: true, // 使用'webpack/hot/dev-server'
    contentBase: BUILD_PATH, // './src',  // 8080/index.html 
    publicPath: BUILD_PATH,
    port: 7000,
    open: true,
    inline: true,
    // clientLogLevel: 'warning', // none, error, warning or info (default).
    compress: true, // 开启gzip压缩 for everything served
    // HTML5 History API
    historyApiFallback: true,
    // watchContentBase: true, // 导致整个页面刷新

    // -----------------------------------------webpack-dev-middleware options
    // https://github.com/webpack/webpack-dev-middleware
    // 使用 WebpackDashboard 必须 设置为 true
    quiet: false, // 让dev server处于静默的状态启动(控制台中不输出打包的信息)
    noInfo: false, // set to false to see a list of every file being bundled.
    // target: 'web', // https://webpack.js.org/configuration/target/#target

    // https://webpack.js.org/configuration/watch/
    watchOptions: {
        aggregateTimeout: 300, // rebuild 延时, wait so long for more changes
        ignored: /node_modules/,
        poll: 1000, // Check for changes every second
    },
    headers: { 'X-Custom-Header': 'yes' },
    // stats: { colors: true }, //  has no effect when used with quiet or noInfo.

}

module.exports = config;