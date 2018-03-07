import React from 'react'
import { convertToRaw } from 'draft-js'
import { convertToHTML } from 'draft-convert'

const BlockTypeMap = {
	'header-one': 'h1',
	'header-two': 'h2',
	'header-three': 'h3',
	'header-four': 'h4',
	'header-five': 'h5',
	'header-six': 'h6',
	'blockquote': 'blockquote',
	'code-block': 'pre',
	'ordered-list-item': 'ol',
	'unordered-list-item': 'li',
	'unstyled': 'p',
}
const InlineTypeMap = {
	BOLD: 'strong',
	ITALIC: 'em',
	UNDERLINE: 'u'
}
// 行内元素转html
const styleToHTML = (style) => {
	const cssMap = {
		color: 'color',
		bgColor: 'backgroundColor',
		fontSize: 'fontSize',
		fontFamily: 'fontFamily'
	}, inlineType = InlineTypeMap[style];
	let html = '', unit = '';
	style = style.replace(/\s/g, '')
	for (let key of Object.keys(cssMap)) {
		let reg = new RegExp(`^${key}(.*)$`);
		if (reg.test(style)) {
			if (style.includes('fontSize')) { unit = 'px' }
			html = <span style={{ [cssMap[key]]: `${style.match(reg)[1]}${unit}` }} />
			break;
		}
	}
	if (inlineType) {
		return {
			start: `<${inlineType}>`,
			end: `</${inlineType}>`
		}
	}
	return html
}
const atomicBlock = (block, contentState) => {
	let editorContent = convertToRaw(contentState);
	let { entityMap } = editorContent, entity = entityMap[block.entityRanges[0].key],
		text = block.text.substr(block.entityRanges[0].offset, block.entityRanges[0].length);
	let atomicHtml = '';
	let { alignment, width, height, src } = entity.data || {}, style = {};
	switch (alignment) {
		case "left":
			style = { float: 'left' }
			break;
		case 'right':
			style = { float: 'right' }
			break;
		case 'center':
			style = { display: 'block', margin: '0 auto' }
			break;
		default:
			break;
	}
	switch (entity.type) {
		case 'video': {
			atomicHtml = <video {...{ src, width, height, style }} ></video>
			let { autoPlay, controls } = entity.data;
			if (autoPlay) atomicHtml = <video autoPlay {...{ src, width, height, style }} />
			if (controls) atomicHtml = <video controls {...{ src, width, height, style }} />
			if (autoPlay && controls) atomicHtml = <video autoPlay controls {...{ src, width, height, style }} />
			break;
		}
		case 'image':
			atomicHtml = <img {...{ src, width, height, style }} />
			break;
		case 'LINK':
			atomicHtml = <a href={entity.data.url} target={entity.data.target} >{text}</a>
			break;
		default:
			break;
	}
	return atomicHtml
}
// 块级行内样式处理
const getBlockStyle = (styles) => {
	let style = '';
	if (Array.isArray(styles)) {
		style = ' style="'
		styles.map(item => style += `${item.key}: ${item.value};`)
		style += '"';
	} else if (Object.keys(styles).length) {
		style = ' style="'
		for (let item of Object.keys(styles)) {
			if(styles[item] !== undefined) {
				style += `${item}: ${styles[item]};`
			}
		}
		style += '"';
	}
	if(style === ' style=""') return ''
	return style;
}
// 块级内容转html
const blockToHTML = (contentState) => (block) => {
	if (block.type === 'atomic' || (block.entityRanges.length > 0 && block.inlineStyleRanges.length === 0)) {
		return atomicBlock(block, contentState)
	} else {
		const blockType = BlockTypeMap[block.type];
		if (['ul', 'ol'].includes(blockType)) {
			let element = React.createElement('li', {
				style: block.data
			}), nest = React.createElement(blockType);
			return {
				element, nest
			}
		} else {
			const blockStyle = getBlockStyle(block.data);
			return {
				start: `<${blockType}${blockStyle}>`,
				end: `</${blockType}>`
			}
		}
	}
}
// 实体转html
const entityToHTML = (entity, originalText) => {
	if (entity.type === 'LINK') {
		return <a href={entity.data.url} target={entity.data.target} >{originalText}</a>;
	}
	return originalText;
}
const draftToHtmlConfig = contentState => {
	return {
		styleToHTML,
		blockToHTML: blockToHTML(contentState),
		entityToHTML
	}
}

export default function draftToHtml(contentState) {
	return convertToHTML(draftToHtmlConfig(contentState))(contentState)
}