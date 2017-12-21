import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RichUtils, EditorState } from 'draft-js'
import { changeDepth } from 'draftjs-utils';
import ToolBarBTn from '../../ToolBarBTn'

const LIST_STYLE = [
	{ label: 'ul', style: 'unordered-list-item' },
	{ label: 'ol', style: 'ordered-list-item' },
	{ label: 'indent', style: 'indent' },
	{ label: 'outdent', style: 'outdent' },
]

export default class List extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
	}
	onToggle = blockType => {
		let { editorState, onChange } = this.props;
		if (blockType === 'indent') {
			onChange(changeDepth(editorState, 1, 4))
		} else if (blockType === 'outdent') {
			onChange(changeDepth(editorState, -1, 4))
		} else {
			onChange(RichUtils.toggleBlockType(editorState, blockType))
		}
	}
	render() {
		let { editorState, config } = this.props;
		return ( 
			<span className="Editor-toolbars">
				{
					LIST_STYLE.filter(item => config.options.includes(item.label)).map(type =>
						<ToolBarBTn
							key={type.label}
							onToggle={this.onToggle}
							style={type.style}
						>
							{type.label}
						</ToolBarBTn>
					)
				}
			</span>
		)
	}
}