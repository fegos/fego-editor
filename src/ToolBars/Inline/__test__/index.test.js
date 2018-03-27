import React from 'react'
import { mount, render } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import Inline from '..'
import defaultToolBars from '../../../default'
import ModalManage from '../../../utils/ModalManage'

describe('Inline', () => {
	const contentState = ContentState.createFromBlockArray(convertFromHTML('<div>test</div>'))
	const editorState = EditorState.createWithContent(contentState)
	const wrapper = mount(
		<Inline editorState={editorState} onChange={() => { }}
			config={defaultToolBars.Inline} modalManage={new ModalManage()}
		/>
	);
	it('渲染时开头应该有一个div', () => {
		expect(wrapper.html().startsWith('<div')).toEqual(true)
	})
	it('应该有3个toolBarBtn子组件', () => {
		expect(wrapper.find('ToolBarBtn').length).toBe(3)
	})
	it('config应该为默认值', () => {
		expect(wrapper.prop('config')).toEqual(defaultToolBars.Inline)
	})
	it('快照', () => {
		const rendered = render(
			<Inline editorState={editorState} onChange={() => { }}
				config={defaultToolBars.Inline} modalManage={new ModalManage()}
			/>
		)
		expect(toJSON(rendered)).toMatchSnapshot()
	})
})