import React, { Component } from "react";
import PropTypes from "prop-types";
import FegoEditor, { draftToHtml, htmlToDraft } from "./fegoEditor";
import { EditorState } from "draft-js";

class Editor extends Component {
	static propTypes = {
		editorState: PropTypes.object.isRequired,
		onEditorStateChange: PropTypes.func.isRequired,
		onContentStateChange: PropTypes.func,
		uploadUrl: PropTypes.string
	};
	static defaultProps = {
		uploadUrl: "",
		editorState: EditorState.createEmpty()
	};
	onChange = editorState => {
		let { onEditorStateChange, onContentStateChange } = this.props;
		onEditorStateChange(editorState);
		onContentStateChange(editorState.getCurrentContent());
	};
	imageUploadCallBack = file =>
		new Promise((resolve, reject) => {
			let { uploadUrl } = this.props;
			if (!/.(png|jpg|jpeg)$/.test(file.type)) {
				alert("只支持上传png或jpg格式的图片");
				reject();
				return;
			}
			// 1048576表示1MB
			if (file.size > 1048576) {
				alert("只支持上传小于1M的图片");
				reject();
				return;
			}
			const xhr = new XMLHttpRequest(); // eslint-disable-line no-undef
			xhr.open("POST", uploadUrl);
			const data = new FormData(); // eslint-disable-line no-undef
			data.append("upload", file);
			xhr.send(data);
			xhr.addEventListener("load", () => {
				const response = JSON.parse(xhr.responseText);
				resolve({ data: { link: response.data.imgUrl } });
			});
			xhr.addEventListener("error", () => {
				const error = JSON.parse(xhr.responseText);
				reject(error);
			});
		});
	render() {
		let { editorState, uploadUrl, ...rest } = this.props;
		return (
			<FegoEditor {...rest}
				editorState={editorState}
				onChange={this.onChange}
				toolBars={{
					Image: { uploadUrl, uploadCallback: this.imageUploadCallBack }
				}}
			/>
		);
	}
}

export { draftToHtml, htmlToDraft };
export default Editor;
