//Получение списка всех символов в указанном текстовом файле и некоторой информации об этих символах.
function onstart() {
	if (process.argv.length === 5 && o.utils.fileExists(process.argv[3])) {
		o.byline();
	} else if (process.argv.length === 6 && process.argv[3] === '-f' && o.utils.fileExists(process.argv[4])) {
		o.byline();
	} else {
		console.log('Invalid command line.');
		process.exit();
	}

	//Typed Array
	o.charCodeTypedArr = new Uint32Array(1114112);

}

let c = 0; // charCode
for (let i = 0; i < s.length; i++) {
	// берём charCode, который может подхватить половинку пары
	c = s.charCodeAt(i);
	// тестируем на принадлежность к суррогатной паре
	if ((c & 0xF800) === 0xD800) {
		// если да, то берём её
		c = s.codePointAt(i);
		// проверяем, правильно ли она подхватилась
		if (c > 0xFFFF) {
			// если да, добавляем счётчик, чтоб
			// пропустить следующий char (который входит в пару)
			++i;
		}
	// если не часть пары и char не распознался (�)
	// (вероятно, выходит за диапазон 0xFFFF)
	} else if (c === 0xFFFD){ // наверное не надо...
		// берём его с помощью codePointAt
		c = s.codePointAt(i);
	}

	// считаем вхождения
	o.charCodeTypedArr[c]++;
}

s = null;

//На выходе подготавливаем данные для вывода.
function onexit() {
	function sortByNumber(a, b) {
		return a[0] - b[0];
	}

	//Сортируем по частотности.
	function sortByFrequency(a, b) {
		if (a[4] === b[4]) {
			return a[0] < b[0] ? -1 : 1;
		} else {
			return b[4] < a[4] ? -1 : 1;
		}
	}

	function hexByDec(dec) {
		var hex = dec.toString(16).toUpperCase(),
			len = 5 - hex.length;
		if (len > 1) {
			hex = Array(len).join('0') + hex;
		}
		return hex;
	}

	function getUnicodeCharNames(InputPath) {
		const uniTab = Object.create(null);
		// т.к. массив отсотритрован, берём наибольший номер кода
		const max = charCodeArr[chCount - 1][0];
		// режем файл в массив
		const arr = fs.readFileSync(InputPath, 'utf8').split('\n');
		for (let i = 0, j = 0, k = 0, l, hex, dec, inf, name; k < chCount && i < arr.length; i++) {
			// текущая строка
			l = arr[i];
			// индекс певой ;
			j = l.indexOf(';');
			// получаем hex
			hex = l.substring(0, j);
			// получаем dec
			dec = parseInt(hex, 16);
			// если есть вхождения
			if (o.charCodeTypedArr[dec] > 0) {
				// режем оставшуюся часть строки по ;
				inf = l.slice(j + 1).split(';');
				name = inf.length === 14 ? (inf[0] === '<control>' ? inf[9] : inf[0]) : '';
				// записываем в uniTab готовую нужную нам структуру
				uniTab[dec] = [
					dec <= 0xFFFF ? String.fromCharCode(dec) : String.fromCodePoint(dec),
					hex,
					dec,
					name,
					o.charCodeTypedArr[dec]
				];
				// если найденный код равен максимальному ставим маркер для оставновки цикла
				// иначе добавляем счётчик
				k = dec === max ? chCount : ++k;
			}
		}

		return uniTab;
	}

	// массив, в который будем класть найденные коды и кол-во вхождений
	const charCodeArr = [];

	for (let i = 0; i < o.charCodeTypedArr.length; i++) {
		// если счётчик превышает 0
		if (o.charCodeTypedArr[i] > 0) {
			// помещаем в массив [charCode, count]
			// т.е. i всегда равно charCode
			charCodeArr.push([i, o.charCodeTypedArr[i]]);
		}
	}

	// сортируем по кодам
	charCodeArr.sort(sortByNumber);

	// общее кол-во кодов
	const chCount = charCodeArr.length;

	//Источник UnicodeData.txt: http://ftp.unicode.org/Public/UNIDATA/UnicodeData.txt
	const uniTab = getUnicodeCharNames(o.path + '/files/UnicodeData.txt');

	// финальный массив
	const newArr = new Array(chCount);

	for (let k = 0, c; k < chCount; k++) {
		c = charCodeArr[k][0];
		if (!!uniTab[c]) {
			newArr[k] = uniTab[c];
		//если не в uniTab, то создаём аналогичную структуру и добавляем в массив
		} else {
			newArr[k] = [
				c <= 0xFFFF ? String.fromCharCode(c) : String.fromCodePoint(c),
				hexByDec(c),
				c,
				'',
				o.charCodeTypedArr[c]
			];
		}
	}

	if (process.argv.length === 6) {
		newArr.sort(sortByFrequency);
	}

	for (let i = 0; i < newArr.length; i++) {
		o.res.push(
			newArr[i][0] + '\t' + newArr[i][1] + '\t' + newArr[i][2] + '\t' + newArr[i][3] + '\t' + newArr[i][4]
		);
	}
}
