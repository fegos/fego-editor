import Immutable from 'immutable'

const defaultToolBars = {
	options: ['BlockType', 'Color', 'FontFamily', 'FontSize', 'History', 'Image', 'Inline', 'Link', 'List', 'TextAlign', 'Video'],
	BlockType: {
		options: ['H1', 'H2', 'H3', 'H4', 'H5', 'H6']
	},
	Color: {
		options: ['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet', ]
	},
	FontFamily: {
		options: ['黑体', '微软雅黑', '楷体', '仿宋', ]
	},
	FontSize: {
		options: ['16', '30']
	},
	History: {
		options: ['Undo', 'Redo']
	},
	Image: { },
	Inline: {
		options: ['bold', 'italic', 'underline']
	},
	Link: { },
	List: {
		options: ['ul', 'ol', 'indent', 'outdent']
	},
	TextAlign: {
		options: ['left', 'center', 'right', 'justify']
	},
	Video: {}
};
const defaultStyleMap = {
	red: {
		color: 'rgba(255, 0, 0, 1)'
	},
	orange: {
		color: 'rgba(255, 127, 0, 1)'
	},
	yellow: {
		color: 'rgba(180, 180, 0, 1)'
	},
	green: {
		color: 'rgba(0, 180, 0, 1)'
	},
	blue: {
		color: 'rgba(0, 0, 255, 1)'
	},
	indigo: {
		color: 'rgba(75, 0, 130, 1)'
	},
	violet: {
		color: 'rgba(127, 0, 255, 1)'
	},
	fontSize16: {
		fontSize: 16
	},
	fontSize30: {
		fontSize: 30
	},
	SimHei: {
		fontFamily: '"SimHei", "黑体"'
	},
	Yahei: {
		fontFamily: '"Microsoft Yahei", "微软雅黑"'
	},
	KaiTi: {
		fontFamily: '"KaiTi", "楷体"'
	},
	FangSong: {
		fontFamily: '"FangSong", "仿宋"'
	}
};
const defaultBlockRenderMap = Immutable.Map({
	'header-two': {
		element: 'h2',
		aliasedElements: ['p'],
	},
	'left': {
		element: 'div',
	},
	'right': {
		element: 'div',
	},
	'center': {
		element: 'div',
	},
});
export {
	defaultToolBars,
	defaultStyleMap,
	defaultBlockRenderMap
}