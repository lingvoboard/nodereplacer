'use strict';
const fs = require('fs');
const readline = require('readline');

const _init_cheerio = function(html, options, isDocument) {
	function checkDocument(string) {
		return /^\s*<(!doctype|html|head|body)\b/i.test(string);
	}

	const cheerio = require('cheerio');
	let $;

	if (typeof html === 'string') {
		let dom;
		if (typeof isDocument === 'undefined') {
			const htmlparser = require('htmlparser2');
			dom = htmlparser.parseDOM(html, options);
			$ = cheerio.load(dom, options);
		} else {
			const parse5 = require('parse5');
			let parse;

			if (typeof isDocument === 'boolean') {
				parse = isDocument ? parse5.parse : parse5.parseFragment;
			} else {
				parse = checkDocument(html) ? parse5.parse : parse5.parseFragment;
			}
			let root = parse(html, {
				treeAdapter: parse5.treeAdapters.htmlparser2
			});
			dom = root.children;
			$ = cheerio.load(dom, options);
		}
	} else if (typeof html === 'object') $ = cheerio.load(html, options);

	$.prototype.unwrap = function() {
		this.parent()
			.not('body')
			.each(function() {
				$(this).replaceWith(this.children);
			});
		return this;
	};

	$.prototype.reptag = function(a, b) {
		this.each(function() {
			$(this)
				.prepend(a)
				.append(b)
				.contents()
				.unwrap();
		});
	};

	$.prototype.wrapAll = function(wrapper) {
		if (this[0]) {
			const wrapperDom = this.first()
				.before(wrapper)
				.prev();
			let elInsertLocation = wrapperDom[0],
				j = 0;

			while (elInsertLocation && elInsertLocation.children) {
				if (j >= elInsertLocation.children.length) break;
				if (elInsertLocation.children[j].type === 'tag') {
					elInsertLocation = elInsertLocation.children[j];
					j = 0;
				} else j++;
			}

			$(elInsertLocation).append(this);
		}

		return this;
	};

	$.prototype.wrapInner = function(structure) {
		var func = typeof structure === 'function';
		return this.each(function(index) {
			const self = $(this);
			const contents = self.contents();
			const dom = func ? structure.call(this, index) : structure;
			contents.length ? contents.wrapAll(dom) : self.append(dom);
		});
	};

	// простая смена названия тега с сохранением атрибутов и контента
	// i.e. $('<div class="tospan">test</div>').changeTag('span')
	// ==> '<span class="tospan">test</span>'
	$.prototype.changeTag = function(tag) {
		for (let i = this.length - 1; i >= 0; i--) this[i].type === 'tag' && (this[i].name = tag);
		return this;
	};

	return $;
};

const _flatten_options = function(options) {
	let opts = {
		decodeEntities: false,
		normalizeWhitespace: true
	};

	options = options && typeof options == 'object' ? Object.assign({}, opts, options) : opts;

	return options;
};

class utils_class {
	constructor() {}

	init_cheerio_old(html, options) {
		options = _flatten_options(options);
		if (options.normalizeWhitespace && typeof html === 'string') {
			html = this.utils.normalizeHTML(html);
			options.normalizeWhitespace = false;
		}

		return _init_cheerio(html, options);
	}

	init_cheerio_new(html, options, isDocument) {
		options = _flatten_options(options);
		if (options.normalizeWhitespace && typeof html === 'string') {
			html = this.utils.normalizeHTML(html);
			options.normalizeWhitespace = false;
		}

		return _init_cheerio(html, options, typeof isDocument === 'boolean' ? isDocument : null);
	}

	init_cheerio(html, options) {
		return this.utils.init_cheerio_old(html, options);
	}

	normalizeHTML(str) {
		const pattern1 = /[\t\n\v\f\r\x20]+/g;
		return str.replace(pattern1, ' ');
	}

	decodeHTML(str) {
		return require('entities').decodeHTML(str);
	}

	encodeHTML(str) {
		return require('entities').encodeHTML(str);
	}

	decode(str, charset) {
		return require('iconv-lite').decode(str, charset);
	}

	remove_odd_slash(s, a) {
		if (a) {
			s = s.replace(/(\\*)/g, function(a, m1) {
				if (m1.length % 2 === 1) m1 = m1.slice(0, -1);
				return m1;
			});
		} else {
			s = s.replace(/(\\*)([@#\^~\[\]\{\}\(\)])/g, function(a, m1, m2) {
				if (m1.length % 2 === 1) m1 = m1.slice(0, -1);
				return m1 + m2;
			});
		}

		return s;
	}

	remove_comments(s) {
		s = s.replace(/(\\*)(\{\{[^]*?\}\})/g, function(a, m1, m2) {
			if (m1.length % 2 === 0) m2 = '';
			return m1 + m2;
		});
		return s;
	}

	remove_scb(s) {
		s = s.replace(/\x00/g, ' ').replace(/(\\*)(\{|\})/g, function(a, m1, m2) {
			if (m1.length % 2 === 0 && m2 === '{') {
				m2 = '\x00' + m2;
			} else if (m1.length % 2 === 0 && m2 === '}') {
				m2 = '\x00' + m2;
			}

			return m1 + m2;
		});

		s = s
			.replace(/(\x00\{[^\x00]*?\x00\})/g, function(a, m1) {
				return '';
			})
			.replace(/\x00/g, '');

		return s;
	}

	guessEncoding(path) {
		const BOM_0 = 0xff;
		const BOM_1 = 0xfe;

		try {
			const fs = require('fs');
			const fd = fs.openSync(path, 'r');
			const bf = Buffer.alloc(2);
			fs.readSync(fd, bf, 0, 2, 0);
			fs.closeSync(fd);
			return bf[0] === BOM_0 && bf[1] === BOM_1 ? 'utf16le' : 'utf8';
		} catch (e) {
			console.error(`Error: ${e.message}.`);
			return null;
		}
	}

	fileExists(filePath) {
		try {
			return fs.statSync(filePath).isFile();
		} catch (err) {
			return false;
		}
	}

	openroundbrackets(h, cb) {
		let bak = h;

		let errors = [0, 0, 0, 0, 0, 0, 0, 0, false];

		//[0] - ( без )
		//[1] - ) без (
		//[2] - { без }
		//[3] - } без {
		//[4] - ошибка: альтернативных частей больше 6
		//[5] - неэкранированный @
		//[6] - неэкранированный #
		//[7] - заголовок целиком состоит из альтернативной части
		//[8] - имеются ли ошибки (true/false)

		let m;

		if ((m = /[^]*?(\\*)(@|#)/.exec(h))) {
			if (m[1].length % 2 === 0) {
				errors[8] = true;

				if (m[2] === '@') {
					errors[5] = 1;
				} else {
					errors[6] = 1;
				}

				return [[h], errors];
			}
		}

		let dec2bin = function(dec) {
			return (dec >>> 0).toString(2);
		};

		let sortFunction = function(a, b) {
			return a[1] < b[1] ? -1 : 1;
		};

		let pad = function(n, width, z) {
			z = z || '0';
			n = n + '';
			return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
		};

		let arr1 = [];
		let arr2 = [];
		let arr5 = [];
		let altchk = '';
		let binarr = [];
		let filter = Object.create(null);

		let count = 0;

		let ind = 0;
		let re = /([^]*?)(\\*)(\{|\}|\(|\))/y;

		while ((m = re.exec(h))) {
			ind = re.lastIndex;
			let txt = m[1] + m[2];

			if (m[2].length % 2 === 1) {
				count++;
				arr1.push([txt + m[3], count]);
				altchk += txt + m[3];
				continue;
			}

			if (m[3] === '}') {
				count++;
				arr1.push([txt + m[3], count]);
				altchk += txt + m[3];
				errors[3] = 1;
				errors[8] = true;
				continue;
			} else if (m[3] === ')') {
				count++;
				arr1.push([txt + m[3], count]);
				altchk += txt + m[3];
				errors[1] = 1;
				errors[8] = true;
				continue;
			} else if (m[3] === '{') {
				let rs = h.substr(ind);
				let re2 = /([^\{]*?)(\\*)(\})/y;
				let m2 = re2.exec(rs);

				if (m2 && m2[2].length % 2 === 0) {
					txt += m[3];
					re.lastIndex += re2.lastIndex;
					ind = re.lastIndex;
					txt += m2[1] + m2[2] + m2[3];
					count++;
					arr1.push([txt, count]);
					altchk += txt;
					continue;
				} else {
					count++;
					arr1.push([txt + m[3], count]);
					altchk += txt + m[3];
					errors[2] = 1;
					errors[8] = true;
					continue;
				}
			} else if (m[3] === '(') {
				let rs = h.substr(ind);
				let re2 = /([^\(]*?)(\\*)(\))/y;
				let m2 = re2.exec(rs);

				if (m2 && m2[2].length % 2 === 0) {
					re.lastIndex += re2.lastIndex;

					ind = re.lastIndex;

					count++;
					arr1.push([txt, count]);
					altchk += txt;

					count++;
					arr2.push([m2[1] + m2[2], count]);

					continue;
				} else {
					count++;
					arr1.push([txt + m[3], count]);
					altchk += txt + m[3];
					errors[0] = 1;
					errors[8] = true;
					continue;
				}
			}
		}

		h = h.substr(ind);

		if (h.length > 0) {
			count++;
			arr1.push([h, count]);
			altchk += h;
		}

		if (arr2.length > 6) {
			errors[4] = 1;
			errors[8] = true;
			return [[bak], errors];
		}

		if (altchk.trim() === '') {
			errors[7] = 1;
			errors[8] = true;
			return [[bak], errors];
		}

		let bs1 = '';
		for (let i = 0; i < arr2.length; i++) bs1 += '1';

		if (bs1 !== '') {
			let n = parseInt(bs1, 2);
			for (let i = 0; i <= n; i++) {
				let bs2 = dec2bin(i);
				binarr.push(pad(bs2, bs1.length, '0'));
			}

			for (let i = 0; i < binarr.length; i++) {
				let arr3 = binarr[i].split('');
				let arr4 = [];

				for (let i = 0; i < arr1.length; i++) arr4.push(arr1[i]);

				for (let i = 0; i < arr3.length; i++) {
					if (cb === undefined) {
						if (arr3[i] === '1') {
							arr4.push(arr2[i]);
						}
					} else {
						if (arr3[i] === '1') {
							arr4.push(['{(}' + arr2[i][0] + '{)}', arr2[i][1]]);
						} else {
							arr4.push(['{(' + arr2[i][0] + ')}', arr2[i][1]]);
						}
					}
				}

				arr4.sort(sortFunction);
				let h = '';
				for (let i = 0; i < arr4.length; i++) {
					if (cb === undefined) {
						h += arr4[i][0];
					} else {
						if (/\s+$/.test(h) && /^\{.*\}$/.test(arr4[i][0]) && !/^\{\(\}.*\{\)\}$/.test(arr4[i][0])) {
							h = h.replace(/(\s+)$/g, '') + '{ ' + arr4[i][0].replace(/^\{(.*)$/, '$1');
						} else if (/^\s+/.test(arr4[i][0]) && /^\{.*\}$/.test(h) && !/^\{\(\}.*\{\)\}$/.test(h)) {
							h = h.replace(/^(.*)\}$/, '$1') + ' }' + arr4[i][0].replace(/^(\s+)/g, '');
						} else {
							h += arr4[i][0];
						}
					}
				}

				h = h.trim().replace(/\s{2,}/g, ' ');

				if (h && filter[h] === undefined) {
					filter[h] = '';
					arr5.push(h.trim());
				}
			}
		}

		if (arr5.length === 0) arr5.push(bak);

		return [arr5, errors];
	}

	filter_gls_hw_list(s) {
		let ob = Object.create(null);
		let arr = s.split(/\|/);
		for (let v of arr) {
			if (ob[v] === undefined) {
				ob[v] = 1;
			} else {
				ob[v]++;
			}
		}

		let n = [];

		while (arr.length) {
			let e = arr.pop();
			if (ob[e] > 1) {
				ob[e]--;
			} else {
				n.push(e);
			}
		}

		s = n.reverse().join('|');
		return s;
	}

	spinner_start(msg, arr, time) {
		return setInterval(() => {
			readline.cursorTo(process.stdout, 0);
			readline.clearLine(process.stdout, 0);
			process.stdout.write(msg.replace(/%s/, arr[0]));
			arr.push(arr.shift());
		}, time || 300);
	}

	spinner_stop(id, msg) {
		clearInterval(id);

		readline.cursorTo(process.stdout, 0);
		readline.clearLine(process.stdout, 0);

		if (msg !== undefined) {
			process.stdout.write(msg);
		}
	}
}

module.exports = {
	utils: function() {
		return new utils_class();
	},

	progressbar: function(edge = 0, format = 0) {
		//thanks to https://gist.github.com/vsemozhetbyt/29dc6481e69050c3dded5afa95694b61

		const rl = require('readline');

		const DEFAULT_FREQ = 500;
		const HUNDRED_PERCENT = 100;
		const PB_LENGTH = 50;
		const PB_SCALE = HUNDRED_PERCENT / PB_LENGTH;

		const NANOSECONDS_PER_SECOND = 1e9;

		const hrStart = process.hrtime();

		function clearLine() {
			rl.cursorTo(process.stdout, 0);
			rl.clearLine(process.stdout, 0);
		}

		function getTimePast() {
			const hrEnd = process.hrtime(hrStart);
			return `${((hrEnd[0] * NANOSECONDS_PER_SECOND + hrEnd[1]) / NANOSECONDS_PER_SECOND).toFixed(1)} s`;
		}

		return {
			edge,
			format,
			stat: 0,

			start(freq = DEFAULT_FREQ) {
				this.updater = setInterval(() => {
					this.update();
				}, freq);
			},

			update(stat = this.stat) {
				const statPercent =
					stat === this.edge || stat > this.edge ? HUNDRED_PERCENT : stat / this.edge * HUNDRED_PERCENT;

				const barsNumber = Math.floor(statPercent / PB_SCALE);
				const padsNumber = PB_LENGTH - barsNumber;

				clearLine();

				if (format === 1) {
					process.stdout.write(
						`${'█'.repeat(barsNumber)}${'░'.repeat(padsNumber)} ${statPercent.toFixed()}%`
					);
				} else {
					process.stdout.write(
						`${'█'.repeat(barsNumber)}${'░'.repeat(padsNumber)} ${statPercent.toFixed(
							1
						)}%  ${getTimePast()} (${stat.toLocaleString()} of ${this.edge.toLocaleString()})`
					);
				}
			},

			end() {
				clearInterval(this.updater);
				this.stat = this.edge;
				this.update();
				console.log('\n');
			},

			clear() {
				clearInterval(this.updater);
				clearLine();
			}
		};
	}
};
