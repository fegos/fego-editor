import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, RichUtils, Modifier } from 'draft-js'
import { getSelectionEntity, getSelectionText } from 'draftjs-utils'	// getEntityRange, 
import ToolBarBTn from '../../ToolBarBTn'

const LINK_TYPES = [
	{ label: 'link', style: 'link' },
	{ label: 'unlink', style: 'unlink' },
]

export default class Link extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
	}
	constructor(props) {
		super(props)
		this.state = {
			linkTitle: '',
			linkTarget: '',
			linkVisible: false,
			btnDisabled: true
		}
	}
	componentWillMount() {
		let { editorState } = this.props;
		if (editorState) {
			this.setState({
				currentEntity: getSelectionEntity(editorState)
			})
		}
	}
	componentWillReceiveProps = (nextProps) => {
		if (this.props.editorState !== nextProps.editorState) {
			let currentEntity = getSelectionEntity(nextProps.editorState);
			this.setState({ currentEntity })
		}
	}
	onToggle = type => {
		if (type === 'link') {
			this.addLink()
		} else {
			this.removeLink()
		}
	}
	onlinkInputKeyDown = e => {
		if (e.which === 13) {
			this.confirmLink(e)
		}
	}
	addLink = () => {
		let { link, selectionText } = this.getCurrentValue();
		this.setState({
			linkVisible: true,
			linkTitle: (link && link.title) || selectionText,
			linkTarget: link && link.target,
			linkTargetOption: (link && link.targetOption) || '_blank'
		}, () => {
			setTimeout(() => this.refs.url.focus(), 0)
		})
	}
	removeLink = () => {
		let { editorState, onChange } = this.props;
		let { currentEntity } = this.state;
		let selection = editorState.getSelection()
		if (currentEntity) {
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
		// onChange(RichUtils.toggleLink(
		// 	editorState,
		// 	editorState.getSelection(),
		// 	entityKey
		// ))
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
		let { linkVisible, linkTitle, linkTarget, btnDisabled } = this.state;
		let urlInput = ''
		if (linkVisible) {
			urlInput = (
				<div style={linkStyle.modal} >
					<label>超链接：</label>
					<input ref='title' type="text" value={linkTitle} style={{ width: '100%' }} onChange={this.handleChange.bind(this, 'linkTitle')} />
					<br />
					<label>超链接地址：</label>
					<input ref='url' type="text" value={linkTarget} style={{ width: '100%' }} onChange={this.handleChange.bind(this, 'linkTarget')} 
						onKeyDown={this.onlinkInputKeyDown}  />
					<br />
					<div style={{ textAlign: 'center', marginTop: '10px' }}>
						<button disabled={btnDisabled} onMouseDown={this.confirmLink}>确定</button> &nbsp;&nbsp;&nbsp;&nbsp;
						<button onMouseDown={() => { this.setState({ linkVisible: false }) }} >取消</button>
					</div>
				</div>
			)
		}
		return (
			<span className="Editor-toolbars">
				{
					LINK_TYPES.map(type =>
						<ToolBarBTn
							key={type.label}
							onToggle={this.onToggle}
							style={type.style}
						>
							{type.label}
						</ToolBarBTn>
					)
				}
				{urlInput}
			</span>
		)
	}
}

const linkStyle = {
	modal: {
		position: 'absolute',
		zIndex: 2,
		padding: '10px',
		border: '1px solid #00000030',
		background: '#fff'
	}
}