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
			<div className="container" >
				<Editor style={{ height: '380px' }}
					editorState={editorState}
					onEditorStateChange={this.onEditorStateChange}
					uploadUrl={""}
					onContentStateChange={this.onEditorContentChange}
				/>
				{
					// <p>生成的HTML</p>
					// <div className="content" >
					// 	{content}
					// </div>
				}
			</div>
		);
	}
}

render(<App />, document.getElementById("root"));
