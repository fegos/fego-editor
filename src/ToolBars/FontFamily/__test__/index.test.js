import React from 'react'
import { mount, render } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import FontFamily from '..'
import defaultToolBars from '../../../defaultToolBars'
import ModalManage from '../../../utils/ModalManage'

describe('FontFamily', () => {
	const contentState = ContentState.createFromBlockArray(convertFromHTML('<div>test</div>'))
	const editorState = EditorState.createWithContent(contentState)
	const wrapper = mount(
		<FontFamily editorState={editorState} onChange={() => { }}
			config={defaultToolBars.FontFamily} modalManage={new ModalManage()}
		/>
	);
	it('渲染时开头应该有一个div', () => {
		expect(wrapper.html().startsWith('<div')).toEqual(true)
	})
	it('应该有一个Select子组件', () => {
		expect(wrapper.find('Select').length).toBe(1)
	})
	it('config应该为默认值', () => {
		expect(wrapper.prop('config')).toEqual(defaultToolBars.FontFamily)
	})
	it('在expanded为true时应该有4个li元素', () => {
		expect(wrapper.find('li').length).toBe(0)
		wrapper.setState({
			expanded: true
		})
		expect(wrapper.find('li').length).toBe(4)
	})
	it('快照', () => {
		const rendered = render(
			<FontFamily editorState={editorState} onChange={() => { }}
				config={defaultToolBars.FontFamily} modalManage={new ModalManage()}
			/>
		)
		expect(toJSON(rendered)).toMatchSnapshot()
	})
})