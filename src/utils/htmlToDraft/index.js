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
	'blockquote': 'blockquote',
	'pre': 'code-block',
	'p': 'unstyled',
}
const htmlToStyle = (nodeName, node, currentStyle) => {
	if (nodeName === 'span') {
		let { style: { color, backgroundColor, fontSize, fontFamily } } = node;
		if (color) {
			return currentStyle.add(`color${color}`)
		} else if (backgroundColor) {
			return currentStyle.add(`bgColor${backgroundColor}`)
		} else if (fontSize) {
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
	switch (nodeName) {
		case 'a':
			let { href: url, target } = node;
			return createEntity('LINK', 'MUTABLE', { url, target })
			break;
		case 'video':
			{
				let { src: url, attributes: { width, height, style }, controls, autoPlay } = node, alignment;
				if (style.value === 'display:block;margin:0 auto;') {
					alignment = 'center'
				} else {
					alignment = style.value.match(/^float:(.*);$/)[1]
				}
				return createEntity('VIDEO', 'IMMUTABLE', { url, width: width.value, height: height.value, alignment, controls, autoPlay })
			}
			break;
		case 'img':
			{
				let { src: url, attributes: { width, height, style } } = node, alignment;
				if (style.value === 'display:block;margin:0 auto;') {
					alignment = 'center'
				} else {
					alignment = style.value.match(/^float:(.*);$/)[1]
				}
				return createEntity('IMAGE', 'IMMUTABLE', { url, width: width.value, height: height.value, alignment })
			}
			break;
		default:
			break;
	}
}
const htmlToBlock = (nodeName, node) => {
	let nodeType = BlockTypeMap[nodeName];
	if (nodeName === 'img' || nodeName === 'video') {
		return {
			type: 'atomic',
			data: {}
		}
	}
	return {
		type: nodeType,
		data: {}
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