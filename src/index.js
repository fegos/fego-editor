/**
 * 富文本编辑器
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Editor, EditorState, RichUtils, DefaultDraftBlockRenderMap, AtomicBlockUtils, convertToRaw, convertFromRaw, Entity, CompositeDecorator } from 'draft-js'
import { changeDepth, handleNewLine, getSelectionEntity, getCustomStyleMap, extractInlineStyle, getSelectedBlocksType, toggleCustomInlineStyle } from 'draftjs-utils'
import Immutable from 'immutable';
import ToolBarBTn from './ToolBarBTn'
import * as ToolBars from './ToolBars'
import { LinkDecorator } from './Decorators'
import mediaBlockRenderer from './RenderFn'
import { defaultToolBars, defaultStyleMap, defaultBlockRenderMap } from './default'
import './index.less'

const decorator = new CompositeDecorator([LinkDecorator]);

export default class MyEditor extends Component {
	static propTypes = {
		editorState: PropTypes.object,
		onChange: PropTypes.func,
		toolBars: PropTypes.array
	}
	constructor(props) {
		super(props)
		this.state = {
			editorState: null,
		};
		this.blockRendererFn = mediaBlockRenderer({
			getEditorState: this.getEditorState,
			onChange: this.onChange
		})
	}
	componentWillMount() {
		this.initialEditorState(decorator)
	}
	componentDidMount() {
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
		let { onChange } = this.props;
		typeof onChange === 'function' && onChange(editorState)
	}
	// 按键回调
	handleKeyCommand = command => {
		const { editorState } = this.state;
		let newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			this.onChange(newState);
			return true;
		}
		return false;
	}
	onTab = e => {
		const maxDepth = 4;
		this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
	}
	render() {
		const { editorState } = this.state;
		let { toolBars } = this.props;
		if (!(toolBars && Array.isArray(toolBars))) {
			toolBars = defaultToolBars
		}
		let className = 'FegoEditor-editor';
		let contentState = editorState.getCurrentContent();
		if (!contentState.hasText()) {
			if (contentState.getBlockMap().first().getType() !== 'unstyled') {
				className += ' ' + 'FegoEditor-hidePlaceholder';
			}
		}
		return (
			<div style={style.root}>
				<div ref='editorContainer' className="FegoEditor-root">
					<div className=''>
						{
							toolBars.options.map((item, idx) => {
								let Control = ToolBars[item], config = toolBars[item]
								return <Control key={idx} editorState={editorState} onChange={this.onChange} config={config} />
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
							blockRenderMap={DefaultDraftBlockRenderMap.merge(defaultBlockRenderMap)}
							customStyleMap={defaultStyleMap}
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
			</div>
		);
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
const style = {
	root: {
		fontFamily: '\'Georgia\', serif',
		padding: '20px',
		width: '700px',
	}
};