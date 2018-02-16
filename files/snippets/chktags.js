/*

НАЗНАЧЕНИЕ
Проверка словарных исходников в формате GLS на наличие в статьях определённой номенклатуры тегов.

КОМАНДНАЯ СТРОКА
node nodereplacer.js -chktags tags.txt input.txt output.txt

- Входные файлы (tags.txt и input.txt) должны иметь кодировку UTF-8.
- input.txt должен быть в формате GLS2. 

- Статьи в которых нет всех указанных тегов маркируются меткой $$$
- Регистр тегов учитывается.
- Информация о статьях в которых не были найдены указанные теги пишется в файл result.log
- Запись в result.log состоит из двух строк:
На первой находится номер строки и заголовок.
На второй - ненайденные теги.

ПРИМЕР

tags.txt содержит:

<b>
</b>
<i></i><u>
</u>

input.txt:

заголовок1
<b>dog</b> pig cat

заголовок2
<b>dog</b> pig <u>cat</u>

заголовок3
<b>dog</b> <i>pig</i> <u>cat</u>

Результат отбработки (output.txt):

$$$заголовок1
<b>dog</b> pig cat

$$$заголовок2
<b>dog</b> pig <u>cat</u>

заголовок3
<b>dog</b> <i>pig</i> <u>cat</u>

Содержание result.log:

[1]заголовок1
<i>, </i>, <u>, </u>

[4]заголовок2
<i>, </i>


*/

function onstart()
{

	o.tagList = [];
	fs.writeFileSync('result.log', "", {encoding: 'utf8', flag: "w"});
	read_tagfile();
	o.by_gls_article();

}


function read_tagfile()
{


	let encoding = o.utils.guessEncoding(process.argv[3]);

	let s = fs.readFileSync(process.argv[3], encoding).toString();

	let tab = Object.create(null);

	let list = s.match(/<[^<>\n]+>/g); 

	if (list)
	{

		for (let v of list)
		{


			if (tab[v] === undefined)
			{
				tab[v] = '';
				o.tagList.push(v);
			}


		}

	}


}



let h = o.gls[0];
let tags = '';

let tab = Object.create(null);

let list = s.match(/<[^<>\n]+>/g); 

if (list)
{

	for (let v of list)
		tab[v] = '';

}

for (let v of o.tagList)
{
	
	if (tab[v] === undefined)
	{
		tags += v + ', ';
	}

}

let mark = '';
if (tags !== '')
{
	fs.writeFileSync('result.log', "[" + o.gls[2] + "]" + h + "\n" + tags.replace(/, $/, "") + "\n\n", {encoding: 'utf8', flag: "a"});
	mark = '$$$';
}


s = mark + s;



