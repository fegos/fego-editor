import React, { Component } from 'react';
import { render } from 'react-dom';
import Editor, { draftToHtml, htmlToDraft } from './Editor';
import Draft, { EditorState, ContentState } from 'draft-js'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			editorState: EditorState.createEmpty()
		}
	}
	onEditorStateChange = (editorState) => {
		this.setState({ editorState })
	}
	onEditorContentChange = (editorContent) => {
		console.log(draftToHtml(editorContent))
	}
	render() {
		return (
			<Editor />
		)
	}
}

render(<App />, document.getElementById('root'))