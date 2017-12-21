import React, { Component } from 'react'
import { EditorState } from 'draft-js'
import classnames from 'classnames'
import './index.less'

// 居中时的样式
const centerStyle = {
	position: 'relative',
	display: 'block',
	margin: '0 auto'
}

export default class Wrapper extends Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
			childrenStyle: null
		}
	}
	changeModalVisible = visible => {
		this.setState({ visible })
	}
	changeMediaAlignment = e => {
		const { block, contentState, onChange, getEditorState } = this.props;
		const entityKey = block.getEntityAt(0);
		let alignment = e.target.getAttribute('value'), childrenStyle = null,
			editorState = getEditorState();
		contentState.mergeEntityData(entityKey, { alignment })
		onChange(EditorState.push(editorState, contentState, 'change-block-data'))
	}
	render() {
		let { visible } = this.state;
		let { block, contentState, children } = this.props;
		let childrenStyle = null, toolbarStyle = 'toolbar';
		const entity = contentState.getEntity(block.getEntityAt(0)), entityData = entity.getData();
		let { alignment, width, height } = entityData;
		if (['left', 'right'].includes(alignment)) {
			childrenStyle = { float: alignment }
		} else if (alignment === 'center') {
			childrenStyle = centerStyle
		}
		toolbarStyle = classnames('toolbar', {
			'toolbarRight': childrenStyle && childrenStyle.float === 'right'
		});
		return (
			<span onMouseEnter={this.changeModalVisible.bind(this, true)}
				onMouseLeave={this.changeModalVisible.bind(this, false)}
			>
				{
					visible &&
					<div className={toolbarStyle} >
						<button value='' onMouseDown={this.changeMediaAlignment}>默认</button>&nbsp;&nbsp;&nbsp;
						<button value='left' onMouseDown={this.changeMediaAlignment}>左</button>&nbsp;&nbsp;&nbsp;
						<button value='center' onMouseDown={this.changeMediaAlignment}>中</button>&nbsp;&nbsp;&nbsp;
						<button value='right' onMouseDown={this.changeMediaAlignment}>右</button>
					</div>
				}
				{React.cloneElement(children, { style: Object.assign({ width, height }, childrenStyle) })}
			</span>
		)
	}
}