import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState } from 'draft-js'
import ToolBarBTn from '../../ToolBarBTn'

const History_STYLE = [
	{ label: 'undo', style: 'undo', className: 'icon-undo' },
	{ label: 'redo', style: 'redo', className: 'icon-redo' }
];

export default class History extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
	}
	onToggle = type => {
		let { editorState, onChange } = this.props;
		onChange(EditorState[type](editorState))
	}
	render() {
		let { config } = this.props;
		return (
			<span className="Editor-toolbars">
				{
					History_STYLE.filter(item => config.options.includes(item.label)).map(type =>
						<ToolBarBTn
							key={type.label}
							onToggle={this.onToggle}
							style={type.style}
						>
							<span style={{
								display: 'inline-block',
								width: '15px',
								height: '15px',
								borderRadius: '3px',
							}} className={type.className} >
							</span>
						</ToolBarBTn>
					)
				}
			</span>
		)
	}
}