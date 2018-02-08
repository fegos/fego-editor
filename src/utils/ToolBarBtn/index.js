import React, { Component } from 'react'

export default class ToolBarBtn extends React.Component {
	onToggle = (e) => {
		let { onToggle, style } = this.props;
		e.preventDefault()
		onToggle(style)
	}
	render() {
		let { active, title, children, className = '' } = this.props;
		let className1 = 'FegoEditor-toolBarBtn';
		if (active) {
			className1 = 'FegoEditor-toolBarBtn FegoEditor-activeBtn'
		}
		className1 = `${className1} ${className}`
		return (
			<div className={className1} onMouseDown={this.onToggle} title={title} >
				{children}
			</div>
		)
	}
}