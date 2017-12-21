import React from 'react'
import { Entity } from 'draft-js'
import Wrapper from '../Wrapper'

const ImageBlock = (props) => {
	const { src, style, config } = props;
	return (
		<Wrapper {...config} >
			<img src={src} style={style} />
		</Wrapper>
	)
}
const VideoBlock = (props) => {
	const { src, style, controls, autoPlay, config } = props;
	return (
		<Wrapper {...config} >
			<video src={src} style={style} controls={controls} autoPlay={autoPlay} />
		</Wrapper>
	)
}
const Media = (config) => (props) => {
	let { contentState, block } = props;
	const entity = contentState.getEntity(block.getEntityAt(0));
	const entityData = entity.getData();
	const type = entity.getType();
	let media;
	if (type === 'image') {
		media = <ImageBlock {...entityData} config={{ ...config, contentState, block }} />
	} else if (type === 'video') {
		media = <VideoBlock {...entityData} config={{ ...config, contentState, block }} />
	}
	return media;
}
// config 表示额外添加的参数，包含（editorState获取方法，和更新editorState的方法）
const mediaBlockRenderer = (config) => (block) => {
	if (block.getType() === 'atomic') {
		return {
			component: Media(config),
			editable: false,
		};
	}
	return null;
}
export default mediaBlockRenderer