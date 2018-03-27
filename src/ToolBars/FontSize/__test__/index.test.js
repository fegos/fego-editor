import React from 'react'
import { mount, render } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import FontSize from '..'
import defaultToolBars from '../../../default'
import ModalManage from '../../../utils/ModalManage'

describe('FontSize', () => {
	const contentState = ContentState.createFromBlockArray(convertFromHTML('<div>test</div>'))
	const editorState = EditorState.createWithContent(contentState)
	const wrapper = mount(
		<FontSize editorState={editorState} onChange={() => { }}
			config={defaultToolBars.FontSize} modalManage={new ModalManage()}
		/>
	);
	it('渲染时开头应该有一个div', () => {
		expect(wrapper.html().startsWith('<div')).toEqual(true)
	})
	it('应该有一个Select子组件', () => {
		expect(wrapper.find('Select').length).toBe(1)
	})
	it('config应该为默认值', () => {
		expect(wrapper.prop('config')).toEqual(defaultToolBars.FontSize)
	})
	it('在expanded为true时应该有8个li元素', () => {
		expect(wrapper.find('li').length).toBe(0)
		wrapper.setState({
			expanded: true
		})
		expect(wrapper.find('li').length).toBe(8)
	})
	it('快照', () => {
		const rendered = render(
			<FontSize editorState={editorState} onChange={() => { }}
				config={defaultToolBars.FontSize} modalManage={new ModalManage()}
			/>
		)
		expect(toJSON(rendered)).toMatchSnapshot()
	})
})