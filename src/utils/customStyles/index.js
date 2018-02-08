export default function setCustomStyles(props) {
	const cssMap = {
		'color': 'color',
		'bgColor': 'backgroundColor',
		'fontSize': 'fontSize',
		'fontFamily': 'fontFamily'
	};
	let customInlineStyle = {};
	// 遍历传入的options赋值给
	for (let style of Object.keys(cssMap)) {
		if(!props[style]) continue;
		for (let item of props[style]) {
			if(style === 'fontFamily') {
				customInlineStyle[`${style}${item.name}`] = { [cssMap[style]]: item.family }
			} else {
				customInlineStyle[`${style}${item}`] = { [cssMap[style]]: item }
			}
		}
	}
	return customInlineStyle
}