import React, { Component } from 'react'

export default class ToolBarBtn extends React.Component {
	onToggle = (e) => {
		let { onToggle, style } = this.props;
		e.preventDefault();
		onToggle(style)
	}
	render() {
		let { active, children } = this.props;
		let className = 'FegoEditor-toolBarBTn';
		if (active) {
			className += ' ' + 'FegoEditor-activeButton';
		}
		return (
			<span className={className} onMouseDown={this.onToggle}>
				{children}
			</span>
		);
	}
}