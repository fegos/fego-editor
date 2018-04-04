import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState } from 'draft-js'
import { ToolBarBtn } from '../../utils'
import Iconfont from '../../iconfont'

const HISTORY_TYPES = [
	{ label: 'undo', style: 'undo', icon: 'iconUndo', title: '撤销' },
	{ label: 'redo', style: 'redo', icon: 'iconRedo', title: '重做' }
];

export default class History extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
		config: PropTypes.array.isRequired,
	}
	onToggle = type => {
		let { editorState, onChange } = this.props;
		onChange(EditorState[type](editorState))
	}
	render() {
		let { config } = this.props;
		return (
			<div className="FegoEditor-toolbars">
				{
					HISTORY_TYPES.filter(item => config.includes(item.label)).map(type =>
						<ToolBarBtn
							key={type.label} title={type.title}
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