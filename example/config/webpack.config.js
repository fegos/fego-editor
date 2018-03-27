'use strict'
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ROOT_PATH = path.resolve(__dirname, '../')
const SRC_PATH = path.resolve(ROOT_PATH, 'src')

module.exports = {
	context: ROOT_PATH,
	resolve: {
		modules: ['node_modules'],
		extensions: ['.js', '.jsx']
	},
	entry: {
		index: './src/index.js',
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			loader: 'babel-loader',
			include: [SRC_PATH]
		}, {
			test: /\.css$/,
			use: ['style-loader', 'postcss-loader']
		}]
	},
	plugins: [
		new ExtractTextPlugin('style.css'),
		new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV) }),
		new HtmlWebpackPlugin({
			template: './src/index.html'
		})
	],

}