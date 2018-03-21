const defaultToolBars = {
	options: ['BlockType', 'Color', 'FontFamily', 'FontSize', 'Image', 'Inline', 'Link', 'List', 'TextAlign', 'Video', 'History'],
	BgColor: [],
	BlockType: ['正文', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
	Color: ['rgb(97,189,109)', 'rgb(26,188,156)', 'rgb(84,172,210)', 'rgb(44,130,201)',
		'rgb(147,101,184)', 'rgb(71,85,119)', 'rgb(204,204,204)', 'rgb(65,168,95)', 'rgb(0,168,133)',
		'rgb(61,142,185)', 'rgb(41,105,176)', 'rgb(85,57,130)', 'rgb(40,50,78)', 'rgb(0,0,0)',
		'rgb(247,218,100)', 'rgb(251,160,38)', 'rgb(235,107,86)', 'rgb(226,80,65)', 'rgb(163,143,132)',
		'rgb(239,239,239)', 'rgb(255,255,255)', 'rgb(250,197,28)', 'rgb(243,121,52)', 'rgb(184,49,47)',
		'rgb(209,72,65)', 'rgb(124,112,107)', 'rgb(209,213,216)'],
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
	Image: {
		uploadUrl: '',
		uploadCallback: null
	},
	Inline: ['bold', 'italic', 'underline'],
	Link: {},
	List: ['ul', 'ol', 'indent', 'outdent'],
	TextAlign: ['left', 'center', 'right', 'justify'],
	Video: {},
	Remove: {}
};

export default defaultToolBars
