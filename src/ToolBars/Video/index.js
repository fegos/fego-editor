import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AtomicBlockUtils } from 'draft-js'
import { ToolBarBtn } from 'utils'
import Iconfont from 'iconfont'

const VIDEO_TYPES = [
	{ label: 'video', style: 'video', icon: 'iconVideo', title: '插入视频' }
], defaultState = {
	videoVisible: false,
	urlValue: '',
	btnDisabled: true,
	width: 'auto',
	height: 'auto',
	controls: false,
	autoPlay: true
}

export default class Video extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
	}
	constructor(props) {
		super(props)
		this.state = defaultState
	}
	componentWillMount() {
		let { modalManage } = this.props;
		modalManage.addCallback(this.changeVideoVisible)
	}
	componentWillUnmount() {
		let { modalManage } = this.props;
		modalManage.removeCallback(this.changeVideoVisible)
	}
	changeVideoVisible = () => {
		this.setState({
			...defaultState,
			videoVisible: this.videoVisible
		})
		this.videoVisible = false
	}
	confirmMedia = () => {
		const { editorState, onChange } = this.props;
		const { urlValue, urlType, width, height, controls, autoPlay } = this.state;
		const contentState = editorState.getCurrentContent();
		const entityKey = contentState.createEntity(urlType, 'IMMUTABLE', { src: urlValue, width, height, controls, autoPlay }).getLastCreatedEntityKey();
		onChange(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' '))
		this.changeVideoVisible()
	}
	handleVideoAdd = () => {
		this.confirmMedia()
	}
	handleChange = (type, e) => {
		let { value, checked } = e.target
		if (type === 'videoUrl') {
			this.setState({
				urlValue: value,
				btnDisabled: !Boolean(value)
			})
		}
		this.setState({ [type]: e.target.getAttribute('type') !== 'checkbox' ? value : checked })
	}
	onToggle = () => {
		this.videoVisible = !this.state.videoVisible
		this.setState({
			urlType: 'video',
		})
	}
	render() {
		let { videoVisible, urlValue, btnDisabled, width, height, controls, autoPlay } = this.state;
		let videoModal = '';
		if (videoVisible) {
			videoModal = (
				<div className='modal' onMouseDown={e => e.stopPropagation()} >
					<div className='uploadBox' >
						<input type='text' value={urlValue} onChange={this.handleChange.bind(this, 'videoUrl')} placeholder='请输入视频url' className='uploadArea input' />
						<div className='videoStyleDiv' >
							<label>宽度：&nbsp;&nbsp;</label>
							<input type="text" value={width} onChange={this.handleChange.bind(this, 'width')} className='videoStyleInput' />
						</div>
						<div className='videoStyleDiv' >
							<label>高度：&nbsp;&nbsp;</label>
							<input type="text" value={height} onChange={this.handleChange.bind(this, 'height')} className='videoStyleInput' />
						</div>
						<div className='videoStyleDiv' >
							<label>显示控件：&nbsp;&nbsp;</label>
							<input type="checkbox" checked={controls} onChange={this.handleChange.bind(this, 'controls')}  />
						</div>
						<div className='videoStyleDiv' >
							<label>自动播放：&nbsp;&nbsp;</label>
							<input type="checkbox" checked={autoPlay} onChange={this.handleChange.bind(this, 'autoPlay')} />
						</div>
					</div>
					<div className='center' >
						<button className='btn btnPrimary' disabled={btnDisabled} onMouseDown={this.handleVideoAdd} >确定</button> &nbsp;&nbsp;&nbsp;&nbsp;
						<button className='btn' onMouseDown={this.changeVideoVisible} >取消</button>
					</div>
				</div>
			)
		}
		return (
			<div className="FegoEditor-toolbars">
				{
					VIDEO_TYPES.map(type =>
						<ToolBarBtn
							key={type.label} title={type.title}
							onToggle={this.onToggle}
							style={type.style}
						>
							{Iconfont[type.icon]}
						</ToolBarBtn>
					)
				}
				{videoModal}
			</div>
		)
	}
}