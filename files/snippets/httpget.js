/*

КОМАНДНАЯ СТРОКА
rep -rt httpget.js links.txt output.txt

httpget.js - этот файл (список замен)
links.txt - файл со ссылками

НАЗНАЧЕНИЕ
Пакетное скачивание веб-страниц, обработка их налету и запись результата в выходной файл

ПРИМЕР
Имеется список ссылок:
http://ordnet.dk/ddo/ordbog?aselect=a,4&query=a&first_id=282&last_id=321#udtryk-1
http://ordnet.dk/ddo/ordbog?aselect=a,4&query=a&first_id=281&last_id=320#udtryk-1
http://ordnet.dk/ddo/ordbog?aselect=à&query=a&first_id=321&last_id=361#udtryk-1
http://ordnet.dk/ddo/ordbog?aselect=à&query=a&first_id=322&last_id=362#udtryk-1
http://ordnet.dk/ddo/ordbog?aselect=af,1&query=a&first_id=769&last_id=808#udtryk-6
http://ordnet.dk/ddo/ordbog?aselect=af,1&query=a&first_id=769&last_id=808#udtryk-8

Результат:
a,4 — Den Danske Ordbog
a,4 — Den Danske Ordbog
à — Den Danske Ordbog
à — Den Danske Ordbog
af,1 — Den Danske Ordbog
af,1 — Den Danske Ordbog
af,1 — Den Danske Ordbog


*/

s = null;


async function onexit_async()
{
	
	try
	{
		//Настройки по умолчанию, начать с первой ссылки и до последней
		const settings = {start:0, count: o.idata.getlength()};
		
		
		//Читаются настройки из settings.json. Пример содержания этого файла: {"start": 10, "count": 5}
		if (o.utils.fileExists('settings.json'))
		{
			let json = JSON.parse(fs.readFileSync('settings.json', 'utf8').toString());

			if (json)
			{
				settings.start = (json.start && typeof json.start  === 'number' && json.start < o.idata.getlength()) ? json.start : settings.start;
				settings.count = (json.count && typeof json.count  === 'number') ? json.count : settings.count;
			}
			
		}

		//Инициализируется и запускается универсальный индикатор прогресса
		console.log("\n\nDownloding and Pocessing...")
		const pb = require(o.utilspath).progressbar(settings.count);
		pb.start();

		//Для скачивания веб-страницы будет использована функция из модуля additionalTools.js
		const httpget = require(o.utilspath + 'additionalTools.js').httpget;

		while (o.idata.next())
		{

			//Операция пропускается пока не будет достигнута точка старта
			if (o.idata.getindex() < settings.start) continue;

			//Операция прерывается при достижении ограничения
			if (o.idata.getindex() >= (settings.start + settings.count)) break;
			
			//Если аргумент true, то метод get возвращает объект типа {str: "aaaaa", eol: "\n"}
			let v = o.idata.get(true);

			try
			{
				//Это делается на случай если в ссылке останется, к примеру, %20, чтобы после последующего использования encodeURI она не была испорчена.
				let url = decodeURIComponent(v.str.trim());

				/*
				//Для демонстрации"
				const options = {
					charset: 'windows-1251',
					headers:{
					'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0',
					'Cookie':'...amembernamecookie=XXXXXX; apasswordcookie=XXXXX;...'
					}
				};

				*/

				//Получение веб-страницы (если случиться ошибка, то ответ придёт в catch)
				let page = await httpget(encodeURI(url)/*, options*/);

				//Используется htmlparser2
				let $ = o.utils.init_cheerio_old(page);

				//Из HTML-кода страницы берётся только титул
				let title = $('title').eq(0).html();

				//Титул пишется выходной файл с предварительным декодированием HTML-сущностей
				o.idata.write(o.utils.decodeHTML(title) + v.eol);

			}
			catch(e)
			{
				//Скрипт не останавливается, а сообщение об ошибке пишется в выходной файл вместо стальи или фрагмента из неё
				o.idata.write('Error: ' + e.message + "\n");
			}
			
			
			pb.stat++;
			//Логируется индекс последней ссылки
			fs.writeFileSync('log.json', JSON.stringify({last: o.idata.getindex()}), {encoding: 'utf8', flag: "w"});


		}
		
		//Индикатор прогресса останавливается и выводится время работы скрипта
		pb.end();
		o.et_show();

	}
	catch(e)
	{
		console.log(e);
		process.exit();
	}

	
}

