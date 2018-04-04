import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AtomicBlockUtils } from 'draft-js'
import { ToolBarBtn } from '../../utils'
import Iconfont from '../../iconfont'

const IMAGE_TYPES = [
	{ label: 'image', style: 'image', icon: 'iconImage', title: '图片' }
], defaultState = {
	imgVisible: false,
	urlValue: '',
	imgUrl: '点击上传图片',
	btnDisabled: true,
	imgAddType: 'local',
	width: 'auto',
	height: 'auto'
}

export default class Image extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
		config: PropTypes.object.isRequired,
		modalManage: PropTypes.object.isRequired
	}
	constructor(props) {
		super(props)
		this.state = defaultState
	}
	componentWillMount() {
		let { modalManage } = this.props;
		modalManage.addCallback(this.changeImgVisible)
	}
	componentWillUnmount() {
		let { modalManage } = this.props;
		modalManage.removeCallback(this.changeImgVisible)
	}
	changeImgVisible = () => {
		this.setState({
			...defaultState,
			imgVisible: this.imgVisible
		})
		this.imgVisible = false
	}
	confirmMedia = () => {
		const { editorState, onChange } = this.props;
		const { imgUrl, urlType, width, height } = this.state;
		const contentState = editorState.getCurrentContent();
		const entityKey = contentState.createEntity(urlType, 'IMMUTABLE', { src: imgUrl, width, height }).getLastCreatedEntityKey();
		onChange(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' '))
		this.changeImgVisible()
	}
	handleImgAdd = () => {
		let { uploadUrl = '', uploadCallBack = null } = this.props.config;
		let { imgAddType } = this.state;
		if (imgAddType === 'local' && uploadUrl) {
			let callback = imgUrl => this.setState({ imgUrl }, this.confirmMedia);
			uploadCallBack ? uploadCallBack(uploadUrl, this.refs.url, callback) :
				this.uploadCallBack(uploadUrl, this.refs.url, callback)
		} else {
			this.confirmMedia()
		}
	}
	uploadCallBack = (url, fileName, callback) => {
		const xhr = new XMLHttpRequest(), data = new FormData();
		xhr.open('POST', url)
		data.append('upload', fileName.file)
		xhr.addEventListener('load', () => {
			console.log('上传成功', 2)
			const response = JSON.parse(xhr.responseText);
			let { imgUrl } = response.data
			callback(imgUrl)
		})
		xhr.addEventListener('error', () => {
			const error = JSON.parse(xhr.responseText);
			console.log(error);
		})
		xhr.send(data)
	}
	handleChange = (type, e) => {
		let { value } = e.target
		if (type === 'imgUrl') {
			this.setState({
				urlValue: value,
				btnDisabled: !Boolean(value)
			})
		}
		this.setState({ [type]: value })
	}
	onToggle = () => {
		this.imgVisible = !this.state.imgVisible
		this.setState({
			urlType: 'image',
			urlValue: ''
		})
	}
	toggleImgAddType = e => {
		this.setState({
			imgAddType: e.target.value,
			imgUrl: '点击上传图片'
		})
		return false
	}
	render() {
		let { imgVisible, urlValue, btnDisabled, imgAddType, imgUrl, width, height } = this.state;
		let { accept = 'image/png, image/jpeg, image/jpg' } = this.props;
		let imageModal = '';
		if (imgVisible) {
			imageModal = (
				<div className='modal' ref='imgModal' onMouseDown={e => e.stopPropagation()} title='图片' >
					<div className='center' onMouseDown={this.toggleImgAddType} >
						<button className='btn' value='local' >本地图片</button>&nbsp;&nbsp;|&nbsp;&nbsp;
						<button className='btn' value='online' >在线图片</button>
					</div>
					<div className='uploadBox'>
						{
							imgAddType === 'local' ? <div>
								<label className='uploadArea' htmlFor='localImg' >{imgUrl}</label>
								<input type='file' ref='url' id='localImg' accept={accept} value={urlValue} className='upload'
									onChange={this.handleChange.bind(this, 'imgUrl')} />
							</div>
								: <input type='text' value={urlValue} onChange={this.handleChange.bind(this, 'imgUrl')} placeholder='请输入图片url' className='input' />
						}
						<div className='imgStyleDiv'>
							<label>宽度：</label>
							<input type="text" value={width} onChange={this.handleChange.bind(this, 'width')} className='imgStyleInput' />
						</div>
						<div className='imgStyleDiv' >
							<label>高度：</label>
							<input type="text" value={height} onChange={this.handleChange.bind(this, 'height')} className='imgStyleInput' />
						</div>
					</div>
					<div className='center' >
						<button className='btn btnPrimary' disabled={btnDisabled} onMouseDown={this.handleImgAdd} >确定</button> &nbsp;&nbsp;&nbsp;&nbsp;
						<button className='btn' onMouseDown={this.changeImgVisible} >取消</button>
					</div>
				</div>
			)
		}
		return (
			<div className="FegoEditor-toolbars">
				{
					IMAGE_TYPES.map(type =>
						<ToolBarBtn
							key={type.label} title={type.title}
							onToggle={this.onToggle}
							style={type.style}
						>
							{Iconfont[type.icon]}
						</ToolBarBtn>
					)
				}
				{imageModal}
			</div>
		)
	}
}