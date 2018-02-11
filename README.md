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


鸣谢
---
- 感谢Jyoti Puri开发的[draftjs-utils](https://github.com/jpuri/draftjs-utils)提供的帮助和[react-draft-wysiwyg](https://github.com/jpuri/react-draft-wysiwyg)提供的参考，Thanks！
- 感谢超能刚哥开发的[braft-editor](https://github.com/margox/braft-editor)提供的参考，Thanks！
- 感谢HubSpot开发的[draft-convert](https://github.com/HubSpot/draft-convert)，Thanks！