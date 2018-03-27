/**
 * 富文本编辑器
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap, AtomicBlockUtils, convertToRaw, convertFromRaw, Entity, CompositeDecorator } from 'draft-js'
import { handleNewLine } from 'draftjs-utils'
import * as ToolBars from './ToolBars'
import { LinkDecorator } from './Decorators'
import mediaBlockRenderer from './RenderFn'
import defaultToolBars from './defaultToolBars'
import { ModalManage, setCustomStyleMap } from 'utils'
import './reset.css'
import './index.css'
import 'draft-js/dist/Draft.css'

const decorator = new CompositeDecorator([LinkDecorator]);

export default class MyEditor extends Component {
	static propTypes = {
		editorState: PropTypes.object,
		onChange: PropTypes.func,
		toolBars: PropTypes.object
	}
	constructor(props) {
		super(props)
		this.state = {
			editorState: null,
		};
		this.modalManage = new ModalManage()
		this.blockRendererFn = mediaBlockRenderer({
			getEditorState: this.getEditorState,
			onChange: this.onChange
		})
	}
	componentWillMount() {
		this.initialEditorState(decorator)
	}
	componentDidMount() {
		this.modalManage.init(this.editor)
		// this.modalManage.init('fegoEditor')
	}
	componentWillReceiveProps = nextProps => {
		let { editorState } = nextProps;
		if (this.props.hasOwnProperty('editorState') && editorState !== this.props.editorState) {
			this.setState({
				editorState: editorState ? EditorState.set(editorState, { decorator }) : EditorState.createEmpty(decorator)
			})
		}
	}
	getEditorState = () => {
		return this.state.editorState
	}
	focus = () => {
		this.editor.focus()
	}
	// 初始化editorState
	initialEditorState = decorator => {
		let editorState = EditorState.createEmpty(decorator);
		let { defaultEditorState } = this.props;
		if (this.props.hasOwnProperty('editorState')) {
			editorState = EditorState.set(this.props.editorState, { decorator })
		} else if (this.props.hasOwnProperty('defaultEditorState')) {
			editorState = EditorState.set(defaultEditorState, { decorator })
		}
		this.setState({ editorState })
	}
	onChange = (editorState, callback) => {
		if (!this.props.hasOwnProperty('editorState')) {
			this.setState({
				editorState
			}, this.aftChange(editorState))
		} else {
			this.aftChange(editorState)
		}
	}
	aftChange = editorState => {
		let { onChange, getHtml } = this.props;
		typeof onChange === 'function' && onChange(editorState)
	}
	// 处理回车键
	handleReturn = (event) => {
		const newEditorState = handleNewLine(this.state.editorState, event);
		if (newEditorState) {
			this.onChange(newEditorState)
			return true
		}
		return false
	}
	// 按键回调
	handleKeyCommand = command => {
		let { editorState } = this.state;
		const newEditorState = RichUtils.handleKeyCommand(editorState, command)
		if (newEditorState) {
			this.onChange(newEditorState)
			return true
		}
		return false
	}
	onTab = e => {
		const maxDepth = 4;
		this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
	}
	render() {
		const { editorState } = this.state;
		let { toolBars = {}, style } = this.props;
		toolBars = Object.assign({}, defaultToolBars, toolBars)
		let className = 'FegoEditor-editor';
		let contentState = editorState.getCurrentContent();
		if (!contentState.hasText()) {
			if (contentState.getBlockMap().first().getType() !== 'unstyled') {
				className += ' ' + 'FegoEditor-hidePlaceholder';
			}
		}
		const customStyleMap = setCustomStyleMap({
			color: toolBars.Color, fontSize: toolBars.FontSize, fontFamily: toolBars.FontFamily,
			bgColor: toolBars.BgColor
		})
		return (
			<div className="FegoEditor-root" onMouseDown={this.modalManage.changeModals} style={style} id='fegoEditor' ref={editor => this.editor = editor} >
				<div className='FegoEditor-toolbar' >
					{
						toolBars.options.map((item, idx) => {
							let Control = ToolBars[item], config = toolBars[item];
							return <Control key={idx} editorState={editorState} onChange={this.onChange} config={config} modalManage={this.modalManage} />
						})
					}
				</div>
				<div className={className} onClick={this.focus}>
					<Editor
						ref={ele => this.editor = ele}
						editorState={editorState}
						placeholder="请输入"
						onChange={this.onChange}
						blockStyleFn={getBlockStyle}
						blockRendererFn={this.blockRendererFn}
						customStyleMap={customStyleMap}
						handleReturn={this.handleReturn}
						handleKeyCommand={this.handleKeyCommand}
						handlePastedText={(value) => (console.log('paste', value))}
						handlePastedFiles={this.pasteImage}
						handleDroppedFiles={this.pasteImage}
						onTab={this.onTab}
						spellCheck={true}
						onPaste={(value) => (console.log('paste', value))}
					/>
				</div>
			</div>
		)
	}
}
function getBlockStyle(block) {
	switch (block.getData().get('text-align')) {
		case 'left':
			return 'align-left';
		case 'center':
			return 'align-center';
		case 'right':
			return 'align-right';
		default: return null;
	}
}

export { draftToHtml, htmlToDraft } from 'utils'