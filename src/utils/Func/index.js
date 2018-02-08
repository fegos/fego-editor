import { EditorState, RichUtils, Modifier } from 'draft-js'

function toggleInlineStyle(editorState, styleMap, style) {
	const selection = editorState.getSelection();
	// 只允许存在一种颜色，关掉所有活跃的颜色。
	const nextContentState = styleMap.reduce((contentState, s) => {
		return Modifier.removeInlineStyle(contentState, selection, s)
	}, editorState.getCurrentContent());
	let nextEditorState = EditorState.push(editorState, nextContentState, 'change-inline-style');
	const currentStyle = editorState.getCurrentInlineStyle();
	// 覆盖当前样式
	if(selection.isCollapsed()) {
		nextEditorState = currentStyle.reduce((state, s) => {
			return RichUtils.toggleInlineStyle(state, s)
		}, nextEditorState)
	}
	// 如果当前样式是目标样式，则会清除当前样式
	if(!currentStyle.has(style)) {
		nextEditorState = RichUtils.toggleInlineStyle(nextEditorState, style)
	}
	return nextEditorState
}

export default {
	toggleInlineStyle
}