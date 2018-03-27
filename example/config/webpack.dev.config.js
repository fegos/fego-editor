'use strict';
const webpack = require('webpack')
// var MOCK_CONF = require('../mock/config')

// 加载配置文件
var config = require('./webpack.config')
config.plugins.unshift(new webpack.DefinePlugin({
	"process.env": {
		NODE_ENV: JSON.stringify("development")
	}
}))
// development环境下sourcemap
config.devtool = 'cheap-module-source-map'
// 本地服务
var devServer = {
	port: 3500,
	historyApiFallback: true,
	hot: true,
	inline: true,
}
// 本地服务
config.devServer = devServer

module.exports = config
