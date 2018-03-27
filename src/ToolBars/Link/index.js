import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js'
import { getSelectionEntity, getSelectionText } from 'draftjs-utils'	// getEntityRange, 
import { ToolBarBtn } from 'utils'
import Iconfont from 'iconfont'

const LINK_TYPES = [
	{ label: 'link', style: 'link', icon: 'iconLink', title: '添加链接' },
	{ label: 'unlink', style: 'unlink', icon: 'iconUnlink', title: '取消链接', className: 'FegoEditor-diabledBtn' },
], defaultState = {
	linkTitle: '',
	linkTarget: '',
	linkVisible: false,
	btnDisabled: true
}

export default class Link extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
		modalManage: PropTypes.object.isRequired
	}
	constructor(props) {
		super(props)
		this.state = defaultState
	}
	componentWillMount() {
		let { editorState, modalManage } = this.props;
		if (editorState) {
			this.setState({
				currentEntity: getSelectionEntity(editorState)
			})
		}
		modalManage.addCallback(this.changeModalVisible)
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.props.editorState !== nextProps.editorState) {
			let currentEntity = getSelectionEntity(nextProps.editorState);
			this.setState({ currentEntity })
		}
	}
	componentWillUnmount() {
		let { modalManage } = this.props;
		modalManage.removeCallback(this.changeModalVisible)
	}
	changeModalVisible = () => {
		let obj = {};
		if (this.linkVisible) {
			obj = { linkVisible: this.linkVisible }
		} else {
			obj = {
				...defaultState,
				linkVisible: this.linkVisible
			}
		}
		this.setState(obj)
		this.linkVisible = false
	}
	onToggle = type => {
		if (type === 'link') {
			this.addLink()
		} else {
			this.removeLink()
		}
	}
	addLink = () => {
		let currentValue = this.getCurrentValue()
		let { link, selectionText } = currentValue;
		this.linkVisible = !this.state.linkVisible
		this.setState({
			linkTitle: (link && link.title) || selectionText,
			linkTarget: link && link.target,
			linkTargetOption: (link && link.targetOption) || '_blank'
		}, () => this.refs.url.focus())
	}
	removeLink = () => {
		let { editorState, onChange } = this.props;
		let { currentEntity } = this.state;
		let selection = editorState.getSelection()
		if (currentEntity && !selection.isCollapsed()) {
			let entityRange = this.getEntityRange(editorState, currentEntity)
			selection = selection.merge({
				anchorOffset: entityRange.start,
				focusOffset: entityRange.end
			})
		}
		onChange(RichUtils.toggleLink(editorState, selection, null))
	}
	confirmLink = e => {
		e.preventDefault()
		let { editorState, onChange } = this.props;
		let { linkTitle, linkTarget, linkTargetOption, currentEntity } = this.state;
		let selection = editorState.getSelection();
		if (currentEntity) {
			const entityRange = this.getEntityRange(editorState, currentEntity)
			selection = selection.merge({
				anchorOffset: entityRange.start,
				focusOffset: entityRange.end
			})
		}
		const entityKey = editorState.getCurrentContent()
			.createEntity('LINK', 'MUTABLE', { url: linkTarget, target: linkTargetOption })
			.getLastCreatedEntityKey();
		let contentState = Modifier.replaceText(editorState.getCurrentContent(), selection,
			`${linkTitle}`, editorState.getCurrentInlineStyle(), entityKey);
		let newEditorState = EditorState.push(editorState, contentState, 'insert-characters');
		// 在超链接后添加一个空格
		selection = newEditorState.getSelection().merge({
			anchorOffset: selection.get('anchorOffset') + linkTitle.length,
			focusOffset: selection.get('anchorOffset') + linkTitle.length,
		});
		newEditorState = EditorState.acceptSelection(newEditorState, selection);
		contentState = Modifier.insertText(
			newEditorState.getCurrentContent(),
			selection,
			' ',
			newEditorState.getCurrentInlineStyle(),
			undefined,
		);
		// toogleLink 方法
		// onChange(RichUtils.toggleLink(editorState, selection, entityKey))
		onChange(EditorState.push(newEditorState, contentState, 'insert-characters'))
		this.setState({
			linkVisible: false
		})
	}
	handleChange = (type, e) => {
		let { value } = e.target;
		this.setState({
			[type]: value,
			btnDisabled: !Boolean(value)
		})
	}
	// 获取当前选中的link
	getCurrentValue = () => {
		const { editorState } = this.props;
		const { currentEntity } = this.state;
		const contentState = editorState.getCurrentContent();
		const currentValues = {};
		if (currentEntity && contentState.getEntity(currentEntity).get('type') === 'LINK') {
			currentValues.link = {}
			const entityRange = currentEntity && this.getEntityRange(editorState, currentEntity);
			currentValues.link.target = currentEntity && contentState.getEntity(currentEntity).get('data').url
			currentValues.link.targetOption = currentEntity && contentState.getEntity(currentEntity).get('data').target
			currentValues.link.title = entityRange && entityRange.text
		}
		currentValues.selectionText = getSelectionText(editorState)
		return currentValues
	}
	getEntityRange = (editorState) => {
		let start = null, end = null;
		if (editorState) {
			let selection = editorState.getSelection();
			start = selection.getStartOffset()
			end = selection.getEndOffset()
		}
		return {
			start, end
		}
	}
	render() {
		let { linkVisible, linkTitle = '', linkTarget = '', btnDisabled } = this.state;
		let urlInput = '';
		LINK_TYPES[1].className = this.getCurrentValue().link ? '' : 'FegoEditor-diabledBtn'
		if (linkVisible) {
			urlInput = (
				<div className='modal' style={{ lineHeight: '20px' }} onMouseDown={e => e.stopPropagation()} >
					<label>链接文字：</label>
					<input ref='title' type="text" value={linkTitle} style={{ width: '100%' }} onChange={this.handleChange.bind(this, 'linkTitle')} />
					<br />
					<label>链接地址：</label>
					<input ref='url' type="text" value={linkTarget} style={{ width: '100%' }} onChange={this.handleChange.bind(this, 'linkTarget')}
						onKeyDown={this.onlinkInputKeyDown} />
					<br />
					<div className='center' style={{ marginTop: '10px' }} >
						<button className='btn btnPrimary' disabled={btnDisabled} onMouseDown={this.confirmLink}>确定</button> &nbsp;&nbsp;&nbsp;&nbsp;
						<button className='btn' onMouseDown={() => { this.setState({ linkVisible: false }) }} >取消</button>
					</div>
				</div>
			)
		}
		return (
			<div className="FegoEditor-toolbars">
				{
					LINK_TYPES.map(item => {
						let { title, style, className, label } = item;
						return <ToolBarBtn
							key={label} {...{ title, style, className }}
							onToggle={this.onToggle}
						>
							{Iconfont[item.icon]}
						</ToolBarBtn>
					})
				}
				{urlInput}
			</div>
		)
	}
}