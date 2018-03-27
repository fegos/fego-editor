import React from 'react'
import { mount, render } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import Link from '..'
import defaultToolBars from '../../../default'
import ModalManage from '../../../utils/ModalManage'

describe('Link', () => {
	const contentState = ContentState.createFromBlockArray(convertFromHTML('<div>test</div>'))
	const editorState = EditorState.createWithContent(contentState)
	const wrapper = mount(
		<Link editorState={editorState} onChange={() => { }}
			config={defaultToolBars.Link} modalManage={new ModalManage()}
		/>
	);
	it('渲染时开头应该有一个div', () => {
		expect(wrapper.html().startsWith('<div')).toEqual(true)
	})
	it('应该有2个toolBarBtn子组件', () => {
		expect(wrapper.find('ToolBarBtn').length).toBe(2)
	})
	it('快照', () => {
		const rendered = render(
			<Link editorState={editorState} onChange={() => { }}
				config={defaultToolBars.Link} modalManage={new ModalManage()}
			/>
		)
		expect(toJSON(rendered)).toMatchSnapshot()
	})
})