import React from 'react'

function findLinkEntities(contentBlock, callback, contentState) {
	contentBlock.findEntityRanges(character => {
		const entityKey = character.getEntity();
		return (entityKey !== null && contentState.getEntity(entityKey).getType() === 'LINK')
	}, callback)
}
const LinkUrl = props => {
	const { url } = props.contentState.getEntity(props.entityKey).getData();
	console.log(url, props.children)
	return (
		<a href={url} style={style.link}>{props.children}</a>
	)
}
const style = {
	link: {
		textDecoration: 'underline',
	}
}
export default {
	strategy: findLinkEntities,
	component: LinkUrl
}