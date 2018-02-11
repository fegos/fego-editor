const defaultToolBars = {
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
};

export {
	defaultToolBars,
	defaultBlockRenderMap,
}
