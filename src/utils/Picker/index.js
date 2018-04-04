import React, { Component } from 'react'
import Iconfont from '../../iconfont'

export default class Picker extends Component {
	onToggle = idx => {
		let { options, onToggle } = this.props;
		onToggle(options[idx])
	}
	render() {
		let { options, changeExpand, expanded, activeItem = 0, type = 'color', style } = this.props;
		return (
			<div className='FegoEditor-picker'>
				<div className='FegoEditor-pickerLabel' onMouseDown={changeExpand} >
					{
						React.cloneElement(Iconfont.iconColor, {
							style: { [type]: options[activeItem] || '#6a6f7b' }
						})
					}
				</div>
				{
					expanded &&
					<div className='FegoEditor-pickerContainer'>
						<div className='FegoEditor-pickerContent'  { ...{ style } } >
							{
								options.map((item, idx) => {
									let active = idx === activeItem ? true : false;
									return <div key={idx} className={active ? 'FegoEditor-pickerItem FegoEditor-activePickerItem' : 'FegoEditor-pickerItem'}
										onMouseDown={this.onToggle.bind(this, idx)} title={item} >
										<svg className="icon" viewBox="0 0 1024 1024" style={{ color: item }}>
											<path d="M127.64823801 128.11282l766.89124798 0 0 766.891248-766.891248 0 0-766.891248Z"></path>
										</svg>
									</div>
								})
							}
						</div>
					</div>
				}
			</div>
		)
	}
}