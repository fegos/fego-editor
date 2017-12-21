'use strict'
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const ROOT_PATH = path.resolve(__dirname, './')
const SRC_PATH = path.resolve(ROOT_PATH, 'src')

module.exports = {
	resolve: {
		modules: ['node_modules'],
		alias: {
			'src': SRC_PATH,
		},
		extensions: ['.js', '.jsx']
	},
	entry: {
		index: './src/index.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		libraryTarget: 'commonjs2'
	},
	externals: {
		'react': 'react',
		'draft-js': 'draft-js'
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			loader: 'babel-loader',
			include: [SRC_PATH]
		}, {
			test: /\.css$/,
			use: [ 'style-loader', 'postcss-loader']
		}, {
			test: /\.less$/,
			exclude: [
				path.resolve(ROOT_PATH, 'node_modules')
			],
			use: ExtractTextPlugin.extract({
				fallback: {
					loader: 'style-loader', 
					options: {
						modules: true,
						localIdentName: '[local]'
					}
				},
				use: ['css-loader', 'less-loader']
			}) 
		}, {
			test: /\.(png|jpg|gif)$/,
			loader: 'url-loader',
			options: {
				limit: 8192,
				name: 'img/[name].[ext]?[hash:base64:8]'
			}
		}, {
			test: /\.(eot|svg|ttf|woff|woff2)$/,
			loader: 'file-loader',
			options: {
				name: 'src/iconfont/[name].[ext]?[hash]'
			}
		}]
	},
	plugins: [
		new ExtractTextPlugin('editor.css'),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		})
	]
}// 代码压缩