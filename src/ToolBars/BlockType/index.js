import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RichUtils } from 'draft-js'
import ToolBarBTn from '../../ToolBarBTn'

const BLOCK_TYPES = [
	{ label: 'H1', style: 'header-one' },
	{ label: 'H2', style: 'header-two' },
	{ label: 'H3', style: 'header-three' },
	{ label: 'H4', style: 'header-four' },
	{ label: 'H5', style: 'header-five' },
	{ label: 'H6', style: 'header-six' },
];

export default class BlockType extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
		toolBar: PropTypes.array
	}
	onToggle = blockType => {
		let { editorState, onChange } = this.props;
		onChange(RichUtils.toggleBlockType(editorState, blockType))
	}
	render() {
		const { editorState, config } = this.props;
		const selection = editorState.getSelection();
		const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
		return (
			<span className="Editor-toolbars">
				{
					BLOCK_TYPES.filter(item=>config.options.includes(item.label)).map((type) =>
						<ToolBarBTn
							key={type.label}
							active={type.style === blockType}
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