import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RichUtils } from 'draft-js'
import { ToolBarBtn } from 'utils'
import Iconfont from 'iconfont'

const INLINE_TYPES = [
	{ label: 'bold', style: 'BOLD', icon: 'iconBold', title: '加粗' },
	{ label: 'italic', style: 'ITALIC', icon: 'iconItalic', title: '斜体' },
	{ label: 'underline', style: 'UNDERLINE', icon: 'iconUnderline', title: '下划线' },
];

export default class FontSize extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
		config: PropTypes.array.isRequired,
		modalManage: PropTypes.object.isRequired
	}
	onToggle = inlineStyle => {
		let { editorState, onChange } = this.props;
		onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle))
	}
	render() {
		let { editorState, config } = this.props;
		let currentStyle = editorState.getCurrentInlineStyle();
		return (
			<div className="FegoEditor-toolbars">
				{
					INLINE_TYPES.filter(item => config.includes(item.label)).map(type =>
						<ToolBarBtn
							key={type.label} title={type.title}
							active={currentStyle.has(type.style)}
							onToggle={this.onToggle}
							style={type.style}
						>
							{Iconfont[type.icon]}
						</ToolBarBtn>
					)
				}
			</div>
		)
	}
}