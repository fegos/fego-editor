import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RichUtils } from 'draft-js'
import ToolBarBTn from '../../ToolBarBTn'

let FONTFAMILY_STYLE = [
	{ label: '黑体', style: 'SimHei' },
	{ label: '微软雅黑', style: 'Yahei' },
	{ label: '楷体', style: 'KaiTi' },
	{ label: '仿宋', style: 'FangSong' }
];
export default class FontFamily extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
	}
	onToggle = inlineStyle => {
		let { editorState, onChange } = this.props;
		onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle))
	}
	render() {
		let { editorState, config } = this.props;
		let currentStyle = editorState.getCurrentInlineStyle();
		return (
			<span className="Editor-toolbars">
				{
					FONTFAMILY_STYLE.filter(item => config.options.includes(item.label)).map(type =>
						<ToolBarBTn
							key={type.label}
							active={currentStyle.has(type.style)}
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