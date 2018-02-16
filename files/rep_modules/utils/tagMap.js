'use strict';
const parse5Utils = require('parse5-utils');
const stringifyObject = require('stringify-object');
const deepmerge = require('./deepmerge');

const _flatten_options = options => {
	const defaults = {
		map: true,
		selectors: true,
		entries: true,
		limit: 10,
		random: false
	};

	return typeof options == 'object' ? Object.assign({}, defaults, options) : defaults;
};

const hash = str => {
	let hash = 5381;
	let i = str.length;

	while (i) {
		hash = (hash * 33) ^ str.charCodeAt(--i);
	}
	return hash >>> 0;
};


module.exports = {
	setMap: function(str, obj, opt) {
		function buildSelector(arr) {
			let attribs = '';
			for (let i = 0; i < arr[1].length; i++) {
				attribs += '[' + arr[1][i] + ']';
			}

			let classes = '';
			for (let i = 0; i < arr[2].length; i++) {
				classes += '.' + arr[2][i];
			}

			return arr[0] + attribs + classes;
		}

		if (typeof obj !== 'object' || !Object.prototype.hasOwnProperty.call(obj, 'count')) {
			throw new Error('second argument must be an object');
		}

		if (obj.count === 1) {
			if (typeof opt === 'object') {
				if (opt.hasOwnProperty('limit')) {
					opt.limit = Number.isInteger(opt.limit) ? Math.abs(opt.limit) : 10;
				}

				if (opt.hasOwnProperty('random')) {
					opt.random = typeof opt.random === 'boolean' ? opt.random : false;
				}
			}

			this.options = _flatten_options(opt);
			this.mode = obj.mode;
		}

		const fragment = parse5Utils.parseFragment(str);
		const nodeArr = parse5Utils.flatten(fragment);
		const options = this.options;

		if (!options.map && !options.selectors && !options.entries) {
			throw new Error('wrong options');
		}

		this.count = obj.count;

		let tabTags = Object.create(null);
		let tagArr = [[], []];
		let tabAttrs = Object.create(null);
		let attrsArr = [[], []];
		let tabClassList = Object.create(null);
		let classListArr = [[], []];
		let selectorArr = [];

		for (let node of nodeArr) {
			if (node.hasOwnProperty('tagName')) {
				if (options.map && !tabTags[node.tagName]) {
					tabTags[node.tagName] = Object.create(null);
					tagArr[0].push(node.tagName);
				}

				const tagStructArr = [node.tagName, [], []];

				const attributes = node.attrs;

				let classVal = null;
				let localClassList = [];
				let nonClassAttr = [];

				for (let attr of attributes) {
					if (attr.name === 'class') {
						classVal = attr.value;
						localClassList = classVal
							.trim()
							.split(/\s+/)
							.sort();
						tagStructArr[2] = localClassList;
					} else {
						tagStructArr[1].push(attr.name);
						nonClassAttr.push(attr.name);
					}
				}

				if (options.map && attributes.length) {
					if (!tabTags[node.tagName].Attributes)
						{tabTags[node.tagName].Attributes = [];}

					for (let attr of attributes) {
						tabTags[node.tagName].Attributes.push(attr.name);
						tabTags[node.tagName].Attributes = [...new Set(tabTags[node.tagName].Attributes)];

						if (!tabAttrs[attr.name]) {
							tabAttrs[attr.name] = Object.create(null);
							attrsArr[0].push(attr.name);
						}
						if (!tabAttrs[attr.name].Tags) {
							tabAttrs[attr.name].Tags = [];
						}
						tabAttrs[attr.name].Tags.push(node.tagName);
						tabAttrs[attr.name].Tags = [...new Set(tabAttrs[attr.name].Tags)];

						if (attributes.length > 1 && nonClassAttr.length) {
							if (!tabAttrs[attr.name].Attributes) {
								tabAttrs[attr.name].Attributes = (classVal ? nonClassAttr.concat('class') : nonClassAttr)
									.filter(att => att !== attr.name)
									.sort();
							}
						}

						if (classVal) {
							if (!tabAttrs[attr.name].Classes) {
								tabAttrs[attr.name].Classes = [];
							}
							tabAttrs[attr.name].Classes.push(classVal);
							tabAttrs[attr.name].Classes = [...new Set(tabAttrs[attr.name].Classes)];
						}
					}

					if (classVal) {
						if (!tabTags[node.tagName].Classes) {
							tabTags[node.tagName].Classes = [];
						}
						tabTags[node.tagName].Classes.push(classVal);
						tabTags[node.tagName].Classes = [...new Set(tabTags[node.tagName].Classes)];

						for (let i = 0; i < localClassList.length; i++) {

							if (!tabClassList[localClassList[i]]) {
								tabClassList[localClassList[i]] = Object.create(null);
								classListArr[0].push(localClassList[i]);
							}
							if (!tabClassList[localClassList[i]].Tags) {
								tabClassList[localClassList[i]].Tags = [];
							}
							tabClassList[localClassList[i]].Tags.push(node.tagName);
							tabClassList[localClassList[i]].Tags = [...new Set(tabClassList[localClassList[i]].Tags)];
							if (nonClassAttr.length) {
								if (!tabClassList[localClassList[i]].Attributes) {
									tabClassList[localClassList[i]].Attributes = [];
								}
								tabClassList[localClassList[i]].Attributes = [
									...new Set(tabClassList[localClassList[i]].Attributes.concat(nonClassAttr))
								];
							}
						}
					}
				}
				tagStructArr[1].sort();
				selectorArr.push(buildSelector(tagStructArr));
			}
		}

		
		if (options.map) {
			tagArr[1] = tabTags;
			attrsArr[1] = tabAttrs;
			classListArr[1] = tabClassList;

			if (!this.hasOwnProperty('tagMapObj')) {
				this.tagMapObj = Object.create(null);
			}
			const tagMapObj = Object.create(null);

			tagMapObj.Tags = tagArr;
			tagMapObj.Attributes = attrsArr;
			tagMapObj.ClassList = classListArr;

			this.tagMapObj = deepmerge(this.tagMapObj, tagMapObj);
		}

		if (options.selectors || options.entries) {
			if (!this.hasOwnProperty('selectorMapArr')) {
				this.selectorMapArr = [];
			}

			selectorArr = [...new Set(selectorArr)];
			this.selectorMapArr = [...new Set(this.selectorMapArr.concat(selectorArr))];

			if (options.entries) {
				if (!this.hasOwnProperty('entriesMapObj')) {
					this.entriesMapObj = Object.create(null);
				}

				const selectorHashArr = selectorArr.map(sel => hash(sel));
				if (!this.entriesMapObj[selectorArr.length]) {
					this.entriesMapObj[selectorArr.length] = [];
				}

				this.entriesMapObj[selectorArr.length].push([this.count, selectorHashArr]);
			}
		}


	},
	getMap: function(type) {
		function shuffleArray(array) {
			for (let i = array.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
		}

		const options = this.options;
		let result = '';

		if (options.map) {
			if (!this.hasOwnProperty('tagMapObj')) {
				throw new Error('There is no data in object');
			}

			const keysArr = ['Tags', 'Attributes', 'ClassList'];
			const keysArr2 = keysArr.concat('Classes');
			const tagMapObj = this.tagMapObj;

			for (let i = 0; i < keysArr.length; i++) {
				const currentKey = tagMapObj[keysArr[i]];
				const keyArr = currentKey[0].sort();
				const tempObj = Object.create(null);
				for (let j = 0; j < keyArr.length; j++) {
					const currentVal = currentKey[1][keyArr[j]];
					for (let k = 0; k < keysArr2.length; k++) {
						if (
							typeof currentVal === 'object' &&
							Object.prototype.hasOwnProperty.call(currentVal, keysArr2[k])
						) {
							currentVal[keysArr2[k]].sort();
						}
					}
					tempObj[keyArr[j]] = currentVal;
				}
				currentKey[1] = tempObj;
			}

			if (typeof type === 'string' && ~keysArr.indexOf(type.charAt(0).toUpperCase() + type.slice(1))) {
				result += stringifyObject(tagMapObj[type.charAt(0).toUpperCase() + type.slice(1)], { indent: '    ' });
			} else {
				result += stringifyObject(tagMapObj, { indent: '    ' });	
			}

			result += '\n\n/*------------------------------------------------------------*/\n\n';
		}

		const selectorMapArr = this.selectorMapArr;
		if (options.selectors) {
			result +=
				stringifyObject(
					{ Selectors: selectorMapArr.sort(), Total: selectorMapArr.length },
					{ indent: '    ' }
				) + '\n\n/*------------------------------------------------------------*/\n\n';

		}

		if (options.entries) {
			const entriesMapObj = this.entriesMapObj;
			const entriesMap = Object.create(null);

			const objKeys = Object.keys(entriesMapObj).sort((a, b) => b - a);
			const artLinesArr = new Array(objKeys.length);

			objKeys.forEach((key, i) => {
				artLinesArr[i] = options.limit && options.random ? (shuffleArray(entriesMapObj[key]), entriesMapObj[key]) : entriesMapObj[key];
				const lineNrArr = artLinesArr[i].map(val => val[0]);

				const percent = this.count ? Math.round(1e4 * lineNrArr.length / this.count) / 100 : 100;
				const unit = this.mode === 'by_gls_article' ? 'article(s)' : 'line(s)';

				entriesMap[
					key +
						' selector(s) of total ' +
						selectorMapArr.length +
						' - ' +
						lineNrArr.length +
						' ' +
						unit +
						' (≈' +
						percent +
						'% of total ' +
						this.count +
						')'
				] = options.limit ? lineNrArr.slice(0, options.limit).sort((a, b) => a - b) : lineNrArr;
			});

			let selectorHashArr = selectorMapArr.map(sel => hash(sel));
			let duplicates = selectorHashArr.reduce(function(acc, el, i, arr) {
				let dup = arr.lastIndexOf(el);
				if (arr.indexOf(el) !== dup && selectorMapArr[i] !== selectorMapArr[dup]) {
					acc.push([selectorMapArr[i], selectorMapArr[dup]]);
				}
				return acc;
			}, []);

			if (duplicates.length) {
				for (let i = 0; i < duplicates.length; i++) {
					console.warn('\nAttention! ' + duplicates[i][0] + ' collides with ' + duplicates[i][1] + '\n');
				}
			}

			let minSetArr = [];

			throughArticles: for (let i = 0; i < artLinesArr.length; i++) {
				const artLineArr = artLinesArr[i];
				for (let j = 0; j < artLineArr.length; j++) {
					if (selectorHashArr.length) {
						const artCell = artLineArr[j];
						const intersect = selectorHashArr.filter(n => artCell[1].includes(n));
						if (intersect.length) {
							minSetArr.push(artCell[0]);
							const difference = selectorHashArr.filter(n => !intersect.includes(n));
							selectorHashArr = difference;
						}
					} else {
						break throughArticles;
					}
				}
			}

			entriesMap['Minimal test set (ALL selectors)'] = minSetArr.sort((a, b) => a - b);

			result +=
				stringifyObject(entriesMap, { indent: '    ', inlineCharacterLimit: 80 }) +
				'\n\n/*============================================================*/';
		}
		return result;
	}
};
