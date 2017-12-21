import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modifier, EditorState } from 'draft-js'
import { getSelectedBlocksMetadata } from 'draftjs-utils'
import ToolBarBTn from '../../ToolBarBTn'

const TextAlign_Types = [
	{ label: 'left', style: 'left' },
	{ label: 'right', style: 'right' },
	{ label: 'center', style: 'center' },
	{ label: 'justify', style: 'justify' },
]

export default class TextAlign extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
	}
	constructor(props) {
		super(props)
		this.state = {
			currentTextAlignment: undefined
		}
	}
	componentWillReceiveProps = nextProps => {
		if (nextProps.editorState !== this.props.editorState) {
			this.setState({
				currentTextAlignment: getSelectedBlocksMetadata(nextProps.editorState).get('text-align')
			})
		}
	}
	onToggle = type => {
		let { editorState, onChange } = this.props;
		let { currentTextAlignment } = this.state;
		let textAlignType = undefined;
		if (currentTextAlignment !== type) {
			textAlignType = type
		}
		let newContentState = Modifier.setBlockData(editorState.getCurrentContent(), editorState.getSelection(),
			{ 'text-align': textAlignType });
		onChange(EditorState.push(editorState, newContentState, 'change-block-data'))
	}
	render() {
		let { currentTextAlignment } = this.state;
		let { config } = this.props;
		return (
			<span className="Editor-toolbars">
				{
					TextAlign_Types.filter(item => config.options.includes(item.label)).map((type) =>
						<ToolBarBTn
							key={type.label}
							active={type.style === currentTextAlignment}
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