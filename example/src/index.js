import React, { Component } from "react";
import { render } from "react-dom";
import Editor, { draftToHtml, htmlToDraft } from "./Editor";
import Draft, { EditorState, ContentState } from "draft-js";
import './style.css'

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: EditorState.createEmpty(),
			content: ''
		};
	}
	onEditorStateChange = editorState => {
		this.setState({ editorState });
	};
	onEditorContentChange = editorContent => {
		this.setState({
			content: draftToHtml(editorContent)
		})
		console.log(draftToHtml(editorContent));
	};
	render() {
		let { editorState, content } = this.state;
		return (
			<div className="flex" >
				<header className="header" >
					<h1 className="title" >FegoEditor</h1>
					<h3 className="desc" >基于DraftJS开发的React富文本编辑器</h3>
					<a className="doc" href="https://github.com/fegos/fego-editer/blob/master/README.md">查看文档</a>
				</header>
				<div className="container" >
					<Editor
						editorState={editorState}
						onEditorStateChange={this.onEditorStateChange}
						uploadUrl={""}
						onContentStateChange={this.onEditorContentChange}
					/>
					<br />
					<p>生成的HTML</p>
					<div className="content" >
						{content}
					</div>
				</div>
				<footer>
					<p>©2018 fegoEditor.github.io</p>
				</footer>
			</div>
		);
	}
}

render(<App />, document.getElementById("root"));
