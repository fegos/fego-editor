import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modifier, EditorState } from 'draft-js'
import { ToolBarBtn } from '../../utils'
import Iconfont from '../../iconfont'

export default class TextAlign extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
	}
	onToggle = () => {
		let { editorState, onChange } = this.props;
		const inlineStyleMap = ['BOLD', 'ITALIC', 'UNDERLINE'];
		let contentState = editorState.getCurrentContent(),
			selection = editorState.getSelection();
		inlineStyleMap.forEach(style => {
			contentState = Modifier.removeInlineStyle(contentState, selection, style)
		})
		onChange(EditorState.push(editorState, contentState, 'change-inline-style'))
	}
	render() {
		return (
			<div className="FegoEditor-toolbars">
				<ToolBarBtn
					onToggle={this.onToggle}
					style='remove'
				>
					{Iconfont['iconRemove']}
				</ToolBarBtn>
			</div>
		)
	}
}