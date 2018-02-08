import React, { Component } from 'react'
import { EditorState } from 'draft-js'

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
			childrenStyle: null,
			top: 0
		}
	}
	changeModalVisible = (visible, e) => {
		this.setState({
			visible,
			top: e.target.height + 5
		})
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
		let { visible, top } = this.state;
		let { block, contentState, children } = this.props;
		let childrenStyle = null, toolbarStyle = 'FegoEditor-wrapper';
		const entity = contentState.getEntity(block.getEntityAt(0)), entityData = entity.getData();
		let { alignment, width, height } = entityData;
		switch (alignment) {
			case 'left':
				childrenStyle = { float: alignment }
				toolbarStyle = 'FegoEditor-wrapper'
				break;
			case 'center':
				childrenStyle = centerStyle
				toolbarStyle = 'FegoEditor-wrapper FegoEitor-wrapperCenter'
				break;
			case 'right':
				childrenStyle = { float: alignment }
				toolbarStyle = 'FegoEditor-wrapper FegoEitor-wrapperRight'
				break;
			default:
				break;
		}
		return (
			<div onClick={this.changeModalVisible.bind(this, true)} style={{ position: 'relative', zIndex: '999' }} >
				{
					visible &&
					<div className={toolbarStyle} style={{ top: `-${top}px` }} onMouseDown={this.changeMediaAlignment} >
						<span value='' >默认</span>&nbsp;&nbsp;&nbsp;
						<span value='left' >左</span>&nbsp;&nbsp;&nbsp;
						<span value='center' >中</span>&nbsp;&nbsp;&nbsp;
						<span value='right' >右</span>
					</div>
				}
				{
					React.cloneElement(children, {
						style: Object.assign({ width, height }, childrenStyle)
					})
				}
			</div>
		)
	}
}