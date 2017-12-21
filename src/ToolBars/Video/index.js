import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AtomicBlockUtils, Entity } from 'draft-js'
import ToolBarBTn from '../../ToolBarBTn'

const Video_TYPES = [
	{ label: 'video', style: 'video' }
];

export default class Video extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onChange: PropTypes.func.isRequired,
	}
	constructor(props) {
		super(props)
		this.state = {
			videoVisible: false,
			urlValue: '',
			btnDisabled: true,
			width: 'auto',
			height: 'auto',
			controls: false,
			autoPlay: true
		}
	}
	componentDidMount() { }
	confirmMedia = () => {
		const { editorState, onChange } = this.props;
		const { urlValue, urlType, width, height, controls, autoPlay } = this.state;
		const entityKey = Entity.create(urlType, 'IMMUTABLE', { src: urlValue, width, height, controls, autoPlay });
		onChange(AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' '))
		this.setState({
			videoVisible: false,
			urlValue: '',
			width: 'auto',
			height: 'auto',
			btnDisabled: true
		})
	}
	onURLInputKeyDown = e => {
		if (e.which === 13) {
			e.preventDefault()
			this.handleVideoAdd()
		}
	}
	handleVideoAdd = () => {
		this.confirmMedia()
	}
	handleCancel = () => {
		this.setState({ videoVisible: false })
	}
	handleChange = (type, e) => {
		let { value, checked } = e.target
		if(type === 'videoUrl') {
			this.setState({
				urlValue: value,
				btnDisabled: !Boolean(value)
			})
		}
		this.setState({ [type]: e.target.getAttribute('type') !== 'checkbox' ? value : checked })
	}
	promptForMedia = type => {
		this.setState({
			videoVisible: true,
			urlType: type,
		})
	}
	onToggle = () => {
		this.promptForMedia('video')
	}
	handleModalClick = e => {
		e.stopPropagation()
	}
	render() {
		let { videoVisible, urlValue, btnDisabled, width, height, controls, autoPlay } = this.state;
		let videoModal = '';
		if (videoVisible) {
			videoModal = (
				<div style={styles.modal} onClick={this.handleModalClick}>
					<div>
						<div style={styles.uploadBox}>
							<input type='text' value={urlValue} onChange={this.handleChange.bind(this, 'videoUrl')} placeholder='请输入视频url' style={styles.input} />
							<div style={styles.videoStyleDiv}>
								<label>宽度：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
								<input type="text" value={width} onChange={this.handleChange.bind(this, 'width')} style={styles.videoStyleInput} />
							</div>
							<div style={styles.videoStyleDiv}>
								<label>高度：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
								<input type="text" value={height} onChange={this.handleChange.bind(this, 'height')} style={styles.videoStyleInput} />
							</div>
							<div style={styles.videoStyleDiv}>
								<label>显示控件：</label>
								<input type="checkbox" checked={controls} onChange={this.handleChange.bind(this, 'controls')} style={styles.videoStyleInput} />
							</div>
							<div style={styles.videoStyleDiv}>
								<label>自动播放：</label>
								<input type="checkbox" checked={autoPlay} onChange={this.handleChange.bind(this, 'autoPlay')} style={styles.videoStyleInput} />
							</div>
						</div>
						<div style={styles.center} >
							<button style={styles.btn} disabled={btnDisabled} onMouseDown={this.handleVideoAdd} onKeyDown={this.onURLInputKeyDown} >确定</button> &nbsp;&nbsp;&nbsp;&nbsp;
							<button style={styles.btn} onMouseDown={this.handleCancel} >取消</button>
						</div>
					</div>
				</div>
			)
		}
		return (
			<span className="Editor-toolbars">
				{
					Video_TYPES.map(type =>
						<ToolBarBTn
							key={type.label}
							onToggle={this.onToggle}
							style={type.style}
						>
							{type.label}
						</ToolBarBTn>
					)
				}
				{videoModal}
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
	upload: {
		height: '1px',
		marginTop: '-5px',
		opacity: 0
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
	videoStyleDiv: {
		display: 'inline-block',
		width: '45%',
		margin: '15px 5px 0 0'
	},
	videoStyleInput: {
		width: '40%'
	}
};