import React from 'react'
import { mount, render } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import Color from '..'
import defaultToolBars from '../../../defaultToolBars'
import ModalManage from '../../../utils/ModalManage'

describe('Color', () => {
	const contentState = ContentState.createFromBlockArray(convertFromHTML('<div>test</div>'))
	const editorState = EditorState.createWithContent(contentState)
	const wrapper = mount(
		<Color editorState={editorState} onChange={() => { }}
			config={defaultToolBars.Color} modalManage={new ModalManage()}
		/>
	);
	it('渲染时开头应该有一个div', () => {
		expect(wrapper.html().startsWith('<div')).toEqual(true)
	})
	it('应该有一个Picker子组件', () => {
		expect(wrapper.find('Picker').length).toBe(1)
	})
	it('config应该为默认值', () => {
		expect(wrapper.prop('config')).toEqual(defaultToolBars.Color)
	})
	it('在expanded为true时应该有28个icon元素', () => {
		expect(wrapper.find('.icon').length).toBe(1)
		wrapper.setState({
			expanded: true
		})
		expect(wrapper.find('.icon').length).toBe(28)
	})
	it('快照', () => {
		const rendered = render(
			<Color editorState={editorState} onChange={() => { }}
				config={defaultToolBars.Color} modalManage={new ModalManage()}
			/>
		)
		expect(toJSON(rendered)).toMatchSnapshot()
	})
})