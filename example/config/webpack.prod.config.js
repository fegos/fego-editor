'use strict';
const path = require('path')
const webpack = require('webpack');
const BUILD_PATH = path.resolve(__dirname, '../dist')

// 加载配置文件
var config = require('./webpack.config')
config.output = Object.assign(config.output, {
	filename: '[name].[chunkhash:8].js',
	chunkFilename: '[name].chunks.[chunkhash:8].js'
})
// 代码压缩
config.plugins.push(new webpack.optimize.UglifyJsPlugin({
	beautify: false,
	comments: false,
	compress: {
		warnings: false,
		drop_console: true
	}
}))

config.output.path = BUILD_PATH

module.exports = config
