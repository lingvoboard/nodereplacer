/*

Командная строка:
rep -rt htmldump.js input.html output.txt

Предназначение:

Имеется большой файл в несколько гигабайт, который содержит статьи какого-то словаря в формате HTML.

1) Нужно слить строки статей, т.е. убрать \n, так чтобы в исходном файле на одной строке размещалась одна страница со статьёй.

2) Нужно очистить исходник от мусора (или вычленить из мусора нужный контент).

Пример:

ДО)

<html>
<title></title>
</head>
	<body>
	<div id=article>1234</div>
	<div>foo</div>
</body>
</html>

<html>
<title></title>
</head>
	<body>
	<div id=article>5678</div>
	<div>foo</div>
</body>
</html>

ПОСЛЕ)

<div id=article>1234</div>
<div id=article>5678</div>

*/


function onstart()
{
	o.s = '';
	o.byline();
}

//Если HTML файл не содержит </html> в конце каждой статьи, то этот скрипт лучше не запускать :)

let m;

if (m = /^(.*?<\/html\s*>)(.*)$/i.exec(s)) {
	o.s += m[1] + ' ';
	s = o.s;
	//s теперь содержит целую статью без \n
	o.s = m[2];

	//Обработка

	let $ = o.utils.init_cheerio(s);

	//Опции по умолчанию: {decodeEntities: false, normalizeWhitespace: true}

	//Изменить можно так:
	//let $ = init_cheerio(s, {decodeEntities: true, normalizeWhitespace: true});
	//let $ = init_cheerio(s, {lowerCaseTags: false});
	//let $ = init_cheerio(s, {lowerCaseTags: false, lowerCaseAttributeNames: true});

	let targetContent = $('#portal-column-content');

	//Делаем так, к примеру, если весь ценный контент находится между <div id=portal-column-content></div>

	if (targetContent.length > 0) {
		s = targetContent.eq(0).html().trim();
	} else {
		//Выводим сообщение об ошибке и останавливаем работу скрипта
		o.stop = 'Error!';
	}
} else {
	o.s += s + ' ';
	s = null;
}
