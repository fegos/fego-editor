Fego-editor
---
基于DraftJS开发的富文本编辑器

安装
---
```
# 使用npm安装
npm install https://github.com/fegos/fego-editer --save
```

使用示例
---
```js
import React, { Component } from 'react'
import { EditorState, convertToRaw } from 'draft-js'
import Editor, { draftToHtml, htmlToDraft } from 'fego-editor'
export default class EditorTest extends Component {
	cache = {
		html: ''
	}
	constructor(props) {
		super(props)
		let str = `<h1><span style="font-family:FangSong;">a</span></h1><img src="https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo_top_ca79a146.png" 
			width="auto" height="auto" style="float:right;"/><ol><li style="text-align:center;"><span style="color:blue;">asdasd</span>
			</li><ol><li><span style="color:blue;"><span style="font-size:20px;">asda</span></span></li></ol></ol>
			<p style="text-align: center;"><span style="font-size:30px;"><em><u><strong>asd</strong></u></em></span></p>
			<video src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" width="auto" height="auto">a</video><a href="www.163.com" target="_blank">asdasd</a><p></p>`;
		let contentState = htmlToDraft(str)
		this.state = {
			editorState: EditorState.createWithContent(contentState),
		}
		// this.state = {
		// 	editorState: EditorState.createEmpty()
		// }
		this.toolBars = {
			Color: ['white', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'pink']
		}
	}
	onChange = (editorState) => {
		this.setState({ editorState })
	}
	handleClick = () => {
		let contentState = this.state.editorState.getCurrentContent();
		let html = convertToRaw(contentState);
		console.log(html)
		this.cache.html = draftToHtml(contentState)
		console.log(this.cache.html)
	}
	handleClick2 = () => {
		let content = htmlToDraft(this.cache.html)
		console.log(convertToRaw(content))
	}
	handleHTMLChange = (html) => {
		console.log(html)
	}
	render() {
		let { editorState } = this.state;
		return (
			<div>
				<Editor editorState={editorState} onChange={this.onChange} getHtml={this.getHtml} toolBars={this.toolBars} />
				<br />
				<button onClick={this.handleClick}>draft转html</button>&nbsp;&nbsp;&nbsp;&nbsp;
				<button onClick={this.handleClick2}>html转draft</button>
			</div>
		)
	}
}
```

属性
---
`editorState`: EditorState

以受控属性的方式更新编辑器的EditorState

`onChange`: EditorState

接收EditorState变化的回调函数

`toolBars`: Object

工具栏配置参数

`defaultEditorState`: EditorState

默认的EditorState

配置工具栏
---
通过传入toolBars的prop，用来配置工具栏

toolBars是一个对象类型，默认值为
```js
{
	options: ['BlockType', 'Color', 'FontFamily', 'FontSize', 'Image', 'Inline', 'Link', 'List', 'TextAlign', 'Video', 'History'],
	BgColor: [],
	BlockType: ['正文', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
	Color: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet', 'pink'],
	FontFamily: [{
		name: 'SimHei', family: '"SimHei", "黑体"'
	}, {
		name: 'Yahei', family: '"Microsoft Yahei", "微软雅黑"'
	}, {
		name: 'KaiTi', family: '"KaiTi", "楷体"'
	}, {
		name: 'FangSong', family: '"FangSong", "仿宋"'
	}],
	FontSize: [16, 20, 30, 40, 50, 70, 100, 200],
	History: ['undo', 'redo'],
	Image: {},
	Inline: ['bold', 'italic', 'underline'],
	Link: {},
	List: ['ul', 'ol', 'indent', 'outdent'],
	TextAlign: ['left', 'center', 'right', 'justify'],
	Video: {},
	Remove: {}
}
```
配置options来控制工具栏功能按钮显示，传入数组覆盖默认值

示例
```js
	<Editor toolBars={{ options: [ 'BlockType', 'Color', 'FontSize' ] }} />
```
只会显示BlockType、Color、FontSize三种按钮

目前支持自定义Color、FontFamily、FontSize，传入数组覆盖默认值

示例
```js
	<Editor toolBars={{ Color: [ 'cyan', 'red', 'orange' ], FontSize: [ 10, 20, 30, 40], FontFamily: [{
		name: 'Araial',
		family: 'Arial, Helvetica, sans-serif'
	}] }} />
```

配置上传图片
---
配置toolBars的Image属性，uploadUrl为图片上传到服务器的url，uploadCallback为添加图片后的回调函数，返回值必须是图片的地址，默认使用ajax异步上传图片
```js
{
	uploadUrl: '',
	uploadCallback: (uploadUrl, file) => {}
}
```

鸣谢
---
- 感谢Jyoti Puri开发的[draftjs-utils](https://github.com/jpuri/draftjs-utils)提供的帮助和[react-draft-wysiwyg](https://github.com/jpuri/react-draft-wysiwyg)提供的参考，Thanks！
- 感谢超能刚哥开发的[braft-editor](https://github.com/margox/braft-editor)提供的参考，Thanks！
- 感谢HubSpot开发的[draft-convert](https://github.com/HubSpot/draft-convert)，Thanks！