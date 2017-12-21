import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AtomicBlockUtils, Entity } from 'draft-js'
import ToolBarBTn from '../../ToolBarBTn'

const IMAGE_TYPES = [
	{ label: 'image', style: 'image', className: 'icon-image' }
];

export default class Image extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
		uploadUrl: PropTypes.string,
		uploadCallBack: PropTypes.func
	}
	constructor(props) {
		super(props)
		this.state = {
			imageVisible: false,
			urlValue: '',
			imgUrl: '点击或拖拽上传图片',
			btnDisabled: true,
			imgAddType: 'local',
			width: 'auto',
			height: 'auto'
		}
	}
	componentDidMount() { }
	confirmMedia = () => {
		const { editorState, onChange } = this.props;
		const { imgUrl, urlType, width, height } = this.state;
		const entityKey = Entity.create(urlType, 'IMMUTABLE', { src: imgUrl, width, height });
		onChange(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' '))
		this.setState({
			imageVisible: false,
			urlValue: '',
			imgUrl: '点击或拖拽上传图片',
			width: 'auto',
			height: 'auto',
			btnDisabled: true
		})
	}
	onURLInputKeyDown = e => {
		if (e.which === 13) {
			e.preventDefault();
			this.handleImgAdd();
		}
	}
	handleImgAdd = () => {
		let { uploadUrl, uploadCallBack } = this.props;
		let { imgAddType } = this.state;
		uploadUrl = uploadUrl || 'api/com/upload'
		if (imgAddType === 'local' && uploadUrl) {
			let callback = imgUrl => this.setState({ imgUrl }, this.confirmMedia);
			uploadCallBack ? uploadCallBack(uploadUrl, this.refs.url, callback) :
				this.uploadCallBack(uploadUrl, this.refs.url, callback)
		} else {
			this.confirmMedia()
		}
	}
	handleCancel = () => {
		this.setState({ imageVisible: false })
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
	promptForMedia = type => {
		this.setState({
			imageVisible: true,
			urlType: type,
		});
	}
	onToggle = () => {
		this.promptForMedia('image');
	}
	toggleImgAddType = e => {
		this.setState({ imgAddType: e.target.value })
	}
	handleModalClick = e => {
		e.stopPropagation()
	}
	render() {
		let { imageVisible, urlValue, btnDisabled, imgAddType, imgUrl, width, height } = this.state;
		let { accept = 'image/png, image/jpeg, image/jpg' } = this.props;
		let imageModal = '';
		if (imageVisible) {
			imageModal = (
				<div style={styles.modal} ref='imgModal' onClick={this.handleModalClick}>
					<div style={styles.center} >
						<button style={styles.btn} value='local' onClick={this.toggleImgAddType} >本地图片</button>&nbsp;&nbsp;|&nbsp;&nbsp;
						<button style={styles.btn} value='online' onClick={this.toggleImgAddType}>在线图片</button>
					</div>
					<div>
						<div style={styles.uploadBox}>
							{
								imgAddType === 'local' ? <div>
									<label style={styles.uploadArea} htmlFor='localImg' >{imgUrl}</label>
									<input type='file' ref='url' id='localImg' accept={accept} value={urlValue} onChange={this.handleChange.bind(this, 'imgUrl')} style={styles.upload} />
								</div>
									: <input type='text' value={urlValue} onChange={this.handleChange.bind(this, 'imgUrl')} placeholder='请输入图片url' style={styles.input} />
							}
							<div style={styles.imgStyleDiv}>
								<label>宽度：</label>
								<input type="text" value={width} onChange={this.handleChange.bind(this, 'width')} style={styles.imgStyleInput} />
							</div>
							<div style={styles.imgStyleDiv}>
								<label>高度：</label>
								<input type="text" value={height} onChange={this.handleChange.bind(this, 'height')} style={styles.imgStyleInput} />
							</div>
						</div>
						<div style={styles.center} >
							<button style={styles.btn} disabled={btnDisabled} onMouseDown={this.handleImgAdd} onKeyDown={this.onURLInputKeyDown} >确定</button> &nbsp;&nbsp;&nbsp;&nbsp;
							<button style={styles.btn} onMouseDown={this.handleCancel} >取消</button>
						</div>
					</div>
				</div>
			)
		}
		return (
			<span className="Editor-toolbars">
				{
					IMAGE_TYPES.map(type =>
						<ToolBarBTn
							key={type.label}
							onToggle={this.onToggle}
							style={type.style}
						>
							<span style={{
								display: 'inline-block',
								width: '15px',
								height: '15px',
								borderRadius: '3px',
							}} className={type.className} >
							</span>
						</ToolBarBTn>
					)
				}
				{imageModal}
			</span>
		)
	}
}
const styles = {
	modal: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		position: 'absolute',
		width: '260px',
		zIndex: 2,
		padding: '10px',
		border: '1px solid #00000030',
		background: '#fff'
	},
	uploadArea: {
		display: 'flex',
		width: '100%',
		height: '60px',
		cursor: 'pointer',
		justifyContent: 'center',
		alignItems: 'center',
		border: '1px dashed #000'
	},
	upload: {
		position: 'absolute',
		clip: 'rect(0, 0, 0, 0)'
	},
	input: {
		width: '100%'
	},
	btn: {
		width: '80px',
		height: '30px',
		color: '#fff',
		border: '1px solid #0090EC',
		borderRadius: '3px',
		background: '#0090EC'
	},
	center: {
		textAlign: 'center'
	},
	uploadBox: {
		margin: '15px 5px 10px'
	},
	imgStyleDiv: {
		display: 'inline-block',
		width: '45%',
		margin: '15px 5px 0 0'
	},
	imgStyleInput: {
		width: '50%'
	}
};