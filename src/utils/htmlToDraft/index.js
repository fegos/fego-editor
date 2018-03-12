import React from 'react'
import { convertFromHTML } from 'draft-convert'
import { convertToRaw } from 'draft-js'

const BlockTypeMap = {
	'h1': 'header-one',
	'h2': 'header-two',
	'h3': 'header-three',
	'h4': 'header-four',
	'h5': 'header-five',
	'h6': 'header-six',
	'atomic': 'figure',
	'blockquote': 'blockquote',
	'pre': 'code-block',
	'p': 'unstyled',
}
const htmlToStyle = (nodeName, node, currentStyle) => {
	if (nodeName === 'span') {
		let { style: { color, backgroundColor, fontSize, fontFamily } } = node;
		if (color) {
			color = color.replace(/\s/g, '')
			return currentStyle.add(`color${color}`)
		} else if (backgroundColor) {
			return currentStyle.add(`bgColor${backgroundColor}`)
		} else if (fontSize) {
			let res = fontSize.match(/(\d*)/)
			fontSize = Array.isArray(res) && res.length && res[1]
			return currentStyle.add(`fontSize${fontSize}`)
		} else if (fontFamily) {
			return currentStyle.add(`fontFamily${fontFamily}`)
		}
		return currentStyle
	} else {
		return currentStyle
	}
}
const htmlToEntity = (nodeName, node, createEntity) => {
	switch(nodeName) {
		case 'a': {
			let { href: { value: url }, target: { value: target } } = node.attributes;
			return createEntity('LINK', 'MUTABLE', { url, target })
		}
		case 'video': {
			let { src, attributes: { width, height, style }, controls, autoPlay } = node, alignment = '';
			let obj = { src, width: width.value, height: height.value };
			if (typeof controls !== 'undefined') { obj = Object.assign(obj, { controls }) }
			if (typeof autoPlay !== 'undefined') { obj = Object.assign(obj, { autoPlay }) }
			if (style) {
				if (style.value === 'display:block;margin:0 auto;') {
					alignment = 'center'
				} else {
					alignment = style.value.match(/^float:(.*);$/)[1]
				}
				obj = Object.assign(obj, { alignment })
			}
			return createEntity('video', 'IMMUTABLE', obj)
		}
		case 'img': {
			let { src, attributes: { width, height, style } } = node, alignment = '';
			let obj = { src, width: width.value, height: height.value };
			if (style) {
				if (style.value === 'display:block;margin:0 auto;') {
					alignment = 'center'
				} else {
					alignment = style.value.match(/^float:(.*);$/)[1]
				}
				obj = Object.assign(obj, { alignment })
			}
			return createEntity('image', 'IMMUTABLE', obj)
		}
		default:
			break;
	}
}
const htmlToBlock = (nodeName, node) => {
	let nodeType = BlockTypeMap[nodeName];
	let data = {};
	for (let style of node.attributes) {
		let arr = style.value.replace(/\s+/g, "").match(/(.*):(.*);/);
		if (Array.isArray(arr) && arr.length > 1) {
			data[arr[1]] = arr[2]
		}
	}
	if (nodeName === 'img' || nodeName === 'video') {
		return {
			type: 'atomic',
			data
		}
	}
	return {
		type: nodeType,
		data
	}
}
const htmlToDraftConfig = {
	htmlToStyle,
	htmlToEntity,
	htmlToBlock
}
export default function htmlToDraft(html) {
	return convertFromHTML(htmlToDraftConfig)(html)
}