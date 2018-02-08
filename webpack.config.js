'use strict'
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ROOT_PATH = path.resolve(__dirname, './')
const SRC_PATH = path.resolve(ROOT_PATH, 'src')

module.exports = {
	context: ROOT_PATH,
	resolve: {
		modules: ['node_modules'],
		alias: {
			'iconfont': path.resolve(SRC_PATH, 'iconfont'),
			'utils': path.resolve(SRC_PATH, 'utils')
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
		"draft-convert": "draft-convert",
		'draft-js': 'draft-js',
		'react': 'react',
		'react-dom': 'react-dom',
		'immutable': 'immutable'
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			loader: 'babel-loader',
			include: [SRC_PATH]
		}, {
			test: /\.css$/,
			use: ['style-loader', 'postcss-loader']
		}, {
			test: /\.less$/,
			exclude: [
				path.resolve(ROOT_PATH, 'node_modules')
			],
			use: ExtractTextPlugin.extract({
				fallback: {
					loader: 'style-loader'
				},
				use: [{
					loader: 'css-loader',
					options: {
						modules: true,
						localIdentName: '[local]',
						minimize: true
					}
				}, 'postcss-loader', 'less-loader']
			})
		}]
	},
	plugins: [
		new ExtractTextPlugin('editor.css'),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				unused: true,
				dead_code: true,
				warnings: false
			}
		}),
		new BundleAnalyzerPlugin
	]
}