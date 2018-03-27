import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { RichUtils } from 'draft-js'
import { ToolBarBtn, Select } from 'utils'
import { getSelectedBlocksList } from 'draftjs-utils'

const BLOCK_TYPES = [
	{ label: '正文', style: 'unstyled' },
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
	onToggle = wrapperType => {
		let { editorState, onChange } = this.props;
		onChange(RichUtils.toggleBlockType(editorState, wrapperType))
	}
	render() {
		const { editorState, config } = this.props;
		const { expanded, } = this.state;
		const selection = editorState.getSelection();
		const currentBlockType = editorState.getCurrentContent().
			getBlockForKey(selection.getStartKey()).getType();
		const options = BLOCK_TYPES.filter(item => config.includes(item.label));
		let activeItem = 0;
		options.find((item, idx) => {
			if(currentBlockType === item.style) {
				activeItem = idx
				return true
			}
			return false
		})
		return (
			<div className="FegoEditor-toolbars" title='样式' >
				<Select {...{ expanded, activeItem, options }} onToggle={this.onToggle} changeExpand={this.onExpand} />
			</div>
		)
	}
}