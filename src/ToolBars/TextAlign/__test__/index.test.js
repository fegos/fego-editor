import React from 'react'
import { mount, render } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import TextAlign from '..'
import defaultToolBars from '../../../defaultToolBars'
import ModalManage from '../../../utils/ModalManage'

describe('TextAlign', () => {
	const contentState = ContentState.createFromBlockArray(convertFromHTML('<div>test</div>'))
	const editorState = EditorState.createWithContent(contentState)
	const wrapper = mount(
		<TextAlign editorState={editorState} onChange={() => { }}
			config={defaultToolBars.TextAlign} modalManage={new ModalManage()}
		/>
	);
	it('渲染时开头应该有一个div', () => {
		expect(wrapper.html().startsWith('<div')).toEqual(true)
	})
	it('should have a toolBarBtn child component', () => {
		expect(wrapper.find('ToolBarBtn').length).toBe(4)
	})
	it('快照', () => {
		const rendered = render(
			<TextAlign editorState={editorState} onChange={() => { }}
				config={defaultToolBars.TextAlign} modalManage={new ModalManage()}
			/>
		)
		expect(toJSON(rendered)).toMatchSnapshot()
	})
})