import React from 'react'
import { mount, render } from 'enzyme'
import toJSON from 'enzyme-to-json'
import { EditorState, ContentState, convertFromHTML } from 'draft-js'
import BlockType from '..'
import defaultToolBars from '../../../default'
import ModalManage from '../../../utils/ModalManage'
import { wrap } from 'module';

describe('BlockType', () => {
	const contentState = ContentState.createFromBlockArray(convertFromHTML('<div>test</div>'))
	const editorState = EditorState.createWithContent(contentState)
	BlockType.prototype.componentWillMount = jest.fn()
	BlockType.prototype.componentWillUnmount = jest.fn()
	BlockType.prototype.onExpand = jest.fn()
	BlockType.prototype.onToggle = jest.fn()
	const wrapper = mount(
		<BlockType editorState={editorState} onChange={() => { }}
			config={defaultToolBars.BlockType} modalManage={new ModalManage()}
		/>
	);
	it('渲染时开头应该有一个div', () => {
		expect(wrapper.html().startsWith('<div')).toEqual(true)
	})
	it('应该有一个Select子组件', () => {
		expect(wrapper.find('Select').length).toBe(1)
	})
	it('config应该为默认值', () => {
		expect(wrapper.prop('config')).toEqual(defaultToolBars.BlockType)
	})
	it('在expanded为true时应该有7个li元素', () => {
		wrapper.setState({
			expanded: true
		})
		// wrapper.find('.FegoEditor-selectLabel').at(0).simulate('mouseDown')
		// expect(BlockType.prototype.onExpand).toHaveBeenCalledTimes(1)
		expect(wrapper.find('li').length).toBe(7)
	})
	it('测试生命周期函数', () => {
		wrapper.unmount()
		expect(BlockType.prototype.componentWillUnmount).toHaveBeenCalledTimes(1)
		wrapper.mount()
		expect(BlockType.prototype.componentWillMount).toHaveBeenCalledTimes(2)
	})
	it('快照', () => {
		const rendered = render(
			<BlockType editorState={editorState} onChange={() => { }}
				config={defaultToolBars.BlockType} modalManage={new ModalManage()}
			/>
		)
		expect(toJSON(rendered)).toMatchSnapshot()
	})
})