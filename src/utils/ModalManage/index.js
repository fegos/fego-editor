export default class ModalManage {
	callbacks = []
	isInEidtor = false
	init = (editor) => {
		// let editor = document.getElementById(id);
		editor.addEventListener('mousedown', e => {
			this.isInEidtor = true
		})
		document.body.addEventListener('mousedown', (e) => {
			if (!this.isInEidtor) {
				this.changeModals()
			} else {
				this.isInEidtor = false
			}
		})
	}
	addCallback = (callback) => {
		this.callbacks.push(callback)
	}
	removeCallback = (callback) => {
		this.callbacks = this.callbacks.filter(func => func !== callback)
	}
	changeModals = () => {
		this.callbacks.forEach(callback => {
			callback()
		})
	}
}