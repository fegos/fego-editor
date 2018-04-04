import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modifier, EditorState } from 'draft-js'
import { getSelectedBlocksMetadata } from 'draftjs-utils'
import { ToolBarBtn } from '../../utils'
import Iconfont from '../../iconfont'

const TEXTALIGN_TYPES = [
	{ label: 'left', style: 'left', icon: 'iconLeftAlign', title: '左对齐' },
	{ label: 'center', style: 'center', icon: 'iconCenterAlign', title: '居中' },
	{ label: 'right', style: 'right', icon: 'iconRightAlign', title: '右对齐' },
	{ label: 'justify', style: 'justify', icon: 'iconJustify', title: '两端对齐' },
]

export default class TextAlign extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
		config: PropTypes.array.isRequired,
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
			<div className="FegoEditor-toolbars">
				{
					TEXTALIGN_TYPES.filter(item => config.includes(item.label)).map((type) =>
						<ToolBarBtn
							key={type.label} title={type.title}
							active={type.style === currentTextAlignment}
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