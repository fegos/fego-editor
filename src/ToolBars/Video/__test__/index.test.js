import React from 'react'
import { mount, render } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import Video from '..'
import defaultToolBars from '../../../defaultToolBars'
import ModalManage from '../../../utils/ModalManage'

describe('Video', () => {
	const contentState = ContentState.createFromBlockArray(convertFromHTML('<div>test</div>'))
	const editorState = EditorState.createWithContent(contentState)
	const wrapper = mount(
		<Video editorState={editorState} onChange={() => { }}
			config={defaultToolBars.Video} modalManage={new ModalManage()}
		/>
	);
	it('渲染时开头应该有一个div', () => {
		expect(wrapper.html().startsWith('<div')).toEqual(true)
	})
	it('should have a toolBarBtn child component', () => {
		expect(wrapper.find('ToolBarBtn').length).toBe(1)
	})
	it('快照', () => {
		const rendered = render(
			<Video editorState={editorState} onChange={() => { }}
				config={defaultToolBars.Video} modalManage={new ModalManage()}
			/>
		)
		expect(toJSON(rendered)).toMatchSnapshot()
	})
})