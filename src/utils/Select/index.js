import React, { Component } from 'react'

export default class Select extends Component {
	onToggle = idx => {
		let { options, onToggle } = this.props;
		onToggle(options[idx].style)
	}
	render() {
		let { options, changeExpand, expanded, activeItem = 0 } = this.props;
		return (
			<div className='FegoEditor-select' >
				<div className='FegoEditor-selectLabel' onMouseDown={changeExpand} >
					<div>{options[activeItem].label}</div>
					<svg className="icon" aria-hidden="true" viewBox="0 0 1024 1024" style={{ verticalAlign: 'top' }} >
						<path d="M494 638l256.5-252H242z"></path>
					</svg>
				</div>
				{
					expanded && <ul className='FegoEditor-selectContent' >
						{
							options.map((item, idx) => {
								let active = idx === activeItem ? true : false;
								return <li key={idx} title={item.label} className={active ? 'FegoEditor-selectItem FegoEditor-activeSelectItem' : 'FegoEditor-selectItem' } 
									onMouseDown={this.onToggle.bind(this, idx)} >
									{item.label}
								</li>
							})
						}
					</ul>
				}
			</div>
		)
	}
}