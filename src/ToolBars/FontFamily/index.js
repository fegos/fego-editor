import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RichUtils } from 'draft-js'
import { ToolBarBtn, Select, Func } from '../../utils'
let { toggleInlineStyle } = Func;

let FONTFAMILY_STYLES = [
	{ label: '黑体', style: 'SimHei' },
	{ label: '微软雅黑', style: 'Yahei' },
	{ label: '楷体', style: 'KaiTi' },
	{ label: '仿宋', style: 'FangSong' }
];
export default class FontFamily extends Component {
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
		config = config.map(item => `fontFamily${item.name}`)
		let newEditorState = toggleInlineStyle(editorState, config, inlineStyle)
		onChange(newEditorState)
	}
	render() {
		let { editorState, config, modalManage } = this.props;
		const { expanded } = this.state;
		const currentStyle = editorState.getCurrentInlineStyle();
		let activeItem = 0;
		let options = config.map(item => ({
			style: `fontFamily${item.name}`,
			label: item.name
		}))
		options.find((item, idx) => {
			if(currentStyle.has(item.style)) {
				activeItem = idx
				return true
			}
			return false
		})
		return (
			<div className="FegoEditor-toolbars" title='字体' >
				<Select {...{ activeItem, expanded, options }} onToggle={this.onToggle} changeExpand={this.onExpand} />
			</div>
		)
	}
}