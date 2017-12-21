import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RichUtils } from 'draft-js'
import ToolBarBTn from '../../ToolBarBTn'

const COLORS_STYLE = [
	{ label: 'Red', style: 'red' },
	{ label: 'Orange', style: 'orange' },
	{ label: 'Yellow', style: 'yellow' },
	{ label: 'Green', style: 'green' },
	{ label: 'Blue', style: 'blue' },
	{ label: 'Indigo', style: 'indigo' },
	{ label: 'Violet', style: 'violet' },
];

export default class Color extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
	}
	onToggle = color => {
		let { editorState, onChange } = this.props;
		onChange(RichUtils.toggleInlineStyle(editorState, color))
	}
	render() {
		let { editorState, config } = this.props;
		let currentStyle = editorState.getCurrentInlineStyle();
		return (
			<span className="Editor-toolbars">
				{
					COLORS_STYLE.filter(item => config.options.includes(item.label)).map(type =>
						<ToolBarBTn
							key={type.label}
							active={currentStyle.has(type.style)}
							onToggle={this.onToggle}
							style={type.style}
						>
							<span style={{
								display: 'inline-block',
								width: '15px',
								height: '15px',
								borderRadius: '3px',
								background: type.style
							}}>
							</span>
						</ToolBarBTn>
					)
				}
			</span>
		)
	}
}