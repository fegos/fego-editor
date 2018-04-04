import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RichUtils, EditorState } from 'draft-js'
import { changeDepth } from 'draftjs-utils'
import { ToolBarBtn } from '../../utils'
import Iconfont from '../../iconfont'

const LIST_STYLES = [
	{ label: 'ul', style: 'unordered-list-item', icon: 'iconUl', title: '无序列表' },
	{ label: 'ol', style: 'ordered-list-item', icon: 'iconOl', title: '有序列表' },
	{ label: 'indent', style: 'indent', icon: 'iconIndent', title: '增加缩进量' },
	{ label: 'outdent', style: 'outdent', icon: 'iconOutdent', title: '减少缩进量' },
]

export default class List extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
		config: PropTypes.array.isRequired
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
		const selection = editorState.getSelection(),
			blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
		return (
			<div className="FegoEditor-toolbars">
				{
					LIST_STYLES.filter(item => config.includes(item.label)).map(type =>
						<ToolBarBtn
							key={type.label} title={type.title}
							onToggle={this.onToggle}
							style={type.style}
							active={blockType === type.style}
						>
							{Iconfont[type.icon]}
						</ToolBarBtn>
					)
				}
			</div>
		)
	}
}