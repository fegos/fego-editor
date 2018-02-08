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
	'unstyled': 'p'
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
	console.log(entity)
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
	Array.isArray(styles) && styles.map(item => style += `${item.key}: ${item.value};`)
	return style;
}
// 块级内容转html
const blockToHTML = (contentState) => (block) => {
	if (block.type === 'atomic' || (block.entityRanges.length > 0 && block.inlineStyleRanges.length === 0)) {
		return atomicBlock(block, contentState)
	} else {
		const blockType = BlockTypeMap[block.type];
		if (blockType) {
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

// function draftToHtml(editorContent) {
// 	let html = [];
// 	if (editorContent) {
// 		const { blocks, entityMap } = editorContent;
// 		blocks.map(block => {
// 			if (['unordered-list-item', 'ordered-list-item'].includes(block.type)) {

// 			} else {
// 				html.push(getBlockHtml(block, entityMap))
// 			}
// 		})
// 	}
// 	return html.join('')
// }
// 处理块级
// const getBlockHtml = (block, entityMap) => {
// 	let blockHtml = []
// 	if (block.type === 'atomic' || (block.entityRanges.length > 0 && block.inlineStyleRanges.length === 0)) {
// 		blockHtml.push(getAtomicHtml(entityMap[block.entityRanges[0].key], block.text))
// 	} else {
// 		let tag = BlockTypeMap[block.type];
// 		if (tag) {
// 			const blockStyle = getBlockStyle(block.data);
// 			const innerText = getBlockInnerHtml(block);
// 			blockHtml.push(`<${tag}`)
// 			blockStyle && blockHtml.push(` style="${blockStyle}" `);
// 			blockHtml.push(`>${innerText}</${tag}>`)
// 		}
// 	}
// 	return blockHtml.join('')
// }
// const getBlockStyle = (styles) => {
// 	let style = '';
// 	Array.isArray(styles) && styles.map(item => {
// 		style += `${item.key}: ${item.value};`
// 	})
// 	return style;
// }
// const getBlockInnerHtml = (block) => {
// 	let ranges = block.entityRanges.map(entityRange => {
// 		let { offset, length } = entityRange;
// 		return { offset, length, type: 'Entity' }
// 	});
// 	this.hanleInlineStyle(block)
// 	let sections = [], lastOffset = 0, blockInnerHtml = [];
// 	ranges.map(item => {
// 		if (item.offset > lastOffset) {
// 			sections.push({
// 				start: lastOffset,
// 				end: item.offset
// 			})
// 		}
// 		sections.push({
// 			start: item.offset,
// 			end: item.offset + item.length,
// 			type: item.type
// 		})
// 		lastOffset = item.offset + item.length
// 	})
// 	if (lastOffset < block.text.length) {
// 		sections.push({
// 			start: lastOffset,
// 			end: block.text.length
// 		})
// 	}
// 	sections.map(item => {
// 		let inlineStyle = {}, html = '';
// 		if (item.type === 'Entity') {

// 		} else {
// 			let styleSections = [];
// 			let { start, end } = item;
// 			for (let i = start; i < end; i++) {
// 				if ('') {

// 				} else {
// 					styleSections.push({
// 						text: [block.text[i]],
// 						start: i,
// 						end: i + 1,
// 						// style: styleRange.style
// 					})
// 				}
// 			}
// 		}
// 	})
// 	return blockInnerHtml.join('')
// }
// 处理实体HTML
// const getAtomicHtml = (entity, text) => {
// 	let atomicHtml = '';
// 	let { alignment, width, height, src } = entity.data, style = '';
// 	switch (alignment) {
// 		case "left":
// 			style = ' float: left;'
// 			break;
// 		case 'right':
// 			style = ' float: right;'
// 			break;
// 		case 'center':
// 			style = ' display: block; margin: 0px auto;'
// 			break;
// 		default:
// 			break;
// 	}
// 	switch (entity.type) {
// 		case 'video':
// 			{
// 				let { autoPlay, controls } = entity.data;
// 				atomicHtml = `<video src="${src}" style="width: ${width}; height: ${height};${style}" ></video>`
// 				if (autoPlay) atomicHtml = `<video src="${src}" autoPlay style="width: ${width}; height: ${height};${style}" ></video>`
// 				if (controls) atomicHtml = `<video src="${src}" controls style="width: ${width}; height: ${height};${style}" ></video>`
// 				if (autoPlay && controls) atomicHtml = `<video src="${src}" autoPlay controls style="width: ${width}; height: ${height};${style}" ></video>`
// 				break;
// 			}
// 		case 'image':
// 			atomicHtml = `<img src="${src}" style="width: ${width}; height: ${height};${style}" />`
// 			break;
// 		case 'LINK':
// 			atomicHtml = `<a href="${entity.data.url}" target="${entity.data.target}" >${text}</a>`
// 			break;
// 		default:
// 			break;
// 	}
// 	return atomicHtml
// }