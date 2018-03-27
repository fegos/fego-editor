import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, RichUtils, Modifier } from 'draft-js'
import { ToolBarBtn, Func, Picker } from 'utils'
let { toggleInlineStyle } = Func;

export default class Color extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
		config: PropTypes.array.isRequired,
		modalManage: PropTypes.object.isRequired
	}
	constructor(props) {
		super(props)
		this.state = {
			expanded: false
		}
	}
	componentWillMount() {
		let { modalManage } = this.props;
		modalManage.addCallback(this.changeExpand)
	}
	componentWillUnmount() {
		let { modalManage } = this.props;
		modalManage.removeCallback(this.changeExpand)
	}
	changeExpand = () => {
		this.setState({
			expanded: this.expanded
		})
		this.expanded = false
	}
	onExpand = () => {
		this.expanded = !this.state.expanded
	}
	onToggle = inlineStyle => {
		let { editorState, onChange, config } = this.props;
		config = config.map(item => `color${item}`)
		let newEditorState = toggleInlineStyle(editorState, config, `color${inlineStyle}`)
		onChange(newEditorState)
	}
	render() {
		const { editorState, config } = this.props;
		const { expanded } = this.state;
		const currentStyle = editorState.getCurrentInlineStyle();
		let activeItem = -1;
		config.find((style, idx) => {
			if (currentStyle.has(`color${style}`)) {
				activeItem = idx
				return true
			}
			return false
		})
		return (
			<div className="FegoEditor-toolbars" title='颜色' >
				{
					config.isTile ? config.map((style, idx) =>
						<ToolBarBtn
							key={idx}
							active={currentStyle.has(`color${style}`)}
							onToggle={this.onToggle}
							style={`color${style}`}
						>
							<svg className="icon" viewBox="0 0 1024 1024" style={{ color: style }} >
								<path d="M127.64823801 128.11282l766.89124798 0 0 766.891248-766.891248 0 0-766.891248Z" />
							</svg>
						</ToolBarBtn>
					) : 
					<Picker {...{ expanded, activeItem }} options={config} onToggle={this.onToggle} changeExpand={this.onExpand} style={{ maxHeight: '120px', width: '148px', overflow: 'auto' }} />
				}
			</div>
		)
	}
}