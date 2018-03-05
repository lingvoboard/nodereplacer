# ИНСТРУКЦИЯ К СКРИПТУ nodereplacer.js

### Содержание инструкции:

* [Общий раздел](index.md)
* [Замены](replacer.md)
* [Дополнительные плагины](plugins.md)
* **Раздел для программистов**


ИСПОЛЬЗОВАНИЕ JAVASCRIPT КОДА В СПИСКЕ ЗАМЕН

![warning.png](./../warning.png)
Чтобы скрипт не испортил javascript код в списке замен:</br>
Не следует использовать логический оператор || с табуляторами до и после, иначе скрипт примет его за часть разделителя в макросе (см. раздел "[Замены](replacer.md)").

## Содержание раздела:

1. [Содержание объекта o](#link)
2. [Использование null](#link)
3. [Массив o.res, функция onexit и onstart](#link)
4. [Методы объекта o.utils](#link)
5. [Модуль htmlclean](#link)
6. [Плагины](#link)
7. [Тестирование](#link)
8. [Примеры и сниппеты](#link)
9. [Разное](#link)

**s** - локальная переменная, которая содержит прочитанную скриптом строку или статью.

###### Содержание объекта o

ПОЛНЫЙ СПИСОК СВОЙСТВ

* [o.arr](#oarr)
* o.art\_start
* o.bom
* o.byline
* o.by\_gls\_article
* o.by\_dsl\_article
* o.count
* o.dsl
* o.eol
* o.eol\_mode
* o.entirefile
* o.error\_log\_path
* o.et\_auto
* o.et\_show
* o.gls
* o.in\_encoding
* o.inputfile
* o.log
* o.loop
* o.mode
* o.outputfile
* o.out\_encoding
* o.progress\_bar
* o.progress\_bar\_title
* o.path
* o.repeat
* o.res
* o.stop
* o.tab
* o.utils
* o.utilspath

<span id="oarr" style="color:#a52a2a;font-weight:bold">o.arr</span> - пустой массив, может использоваться для любых целей.

<span style="color:#a52a2a;font-weight:bold">oart\_start</span> - в режиме постатейного чтения DSL-файлов содержит номер строки на которой начинается статья.

<span style="color:#a52a2a;font-weight:bold">o.bom</span> - BOM (изначально эта переменная содержит '`\uFEFF`').

<span style="color:#a52a2a;font-weight:bold">o.byline</span> - функция **_byline_** из nodereplacer.js

<span style="color:#a52a2a;font-weight:bold">o.by\_gls\_article</span> - функция **_by\_gls\_article_** из nodereplacer.js

<span style="color:#a52a2a;font-weight:bold">o.by\_dsl\_article</span> - функция **_by\_dsl\_article_** из nodereplacer.js

<span style="color:#a52a2a;font-weight:bold">o.count</span> - содержит номер прочитанной строки или статьи.

<span style="color:#a52a2a;font-weight:bold">o.dsl</span> - в режиме постатейного чтения файлов в формате DSL эта переменная содержит массив со статьёй.</br>
1. Первый элемент (**o.dsl[0]**) - массив с заголовками (вся заголовочная часть статьи).</br>
2. Второй (**o.dsl[1]**) - тело статьи (одной строкой).</br>
3. Третий (**o.dsl[2]**) - отфильтрованный массив с заголовками (без комментариев и пустых строк).</br>
4. Четвёртый (**o.dsl[3]**) - массив со строками тела. Многострочные комментарии одной строкой.

<span style="color:#a52a2a;font-weight:bold">o.eol</span> - управляющие символ(ы), который будут добавляться при записи в конец строки или статьи (по умолчанию `\n`).

<span style="color:#a52a2a;font-weight:bold">o.eol\_mode</span> - если эта переменная имеет значение **1**, то в построчном режиме чтения входного файла в выходной файл будут писаться оригинальные разделители строк ([подробнее](#link))</br>
Если **2**, то создаётся карта смещений всех строк входного файла. ([подробнее](#link))

<span style="color:#a52a2a;font-weight:bold">o.entirefile</span> - функция **_entirefile_** из nodereplacer.js

<span style="color:#a52a2a;font-weight:bold">o.error\_log\_path</span> - cодержит полный путь к файлу **_error.log_**. По умолчанию этот файл создаётся в одной папке с выходным файлом, но **_error.log_** и выходной файл могут оказаться в разных местах если в списке замен или плагине будет изменено значение **_o.outputfile_**.

<span style="color:#a52a2a;font-weight:bold">o.et\_auto</span> - управляющая переменная, в случае если имеет значение **_true_** (значение по умолчание), то время работы скрипта выводится автоматически.

Если **_false_**, то время работы скрипта не выводится.

<span style="color:#a52a2a;font-weight:bold">o.et\_show</span> - функция для вывода времени работы скрипта.

<span style="color:#a52a2a;font-weight:bold">o.gls</span> - в режиме постатейного чтения файлов в формате GLS эта переменная содержит массив со статьёй. Первый элемент - строка с заголовком или заголовками разделёнными символом "|". Второй - тело статьи. Третий - номер строки на которой находится заголовок статьи.

<span style="color:#a52a2a;font-weight:bold">o.in\_encoding</span> - кодировка входного файла (по умолчанию utf8).

<span style="color:#a52a2a;font-weight:bold">o.inputfile</span> - имя входного файла.

<span style="color:#a52a2a;font-weight:bold">o.log</span> - массив для сообщений.

<span style="color:#a52a2a;font-weight:bold">o.loop</span> - счетчик, значение увеличивается на единицу после каждого запуска функций **_byline_**, **_by\_dsl\_article_**, **_entirefile_** или **_by\_gls\_article_**

<span style="color:#a52a2a;font-weight:bold">o.mode</span> - возможные значения: '**_byline_**', '**_by\_dsl\_article_**', '**_by\_gls\_article_**', '**_entirefile_**'
_Используется в nodereplacer.js (Изменять значения этой переменной в списках замен или плагинах нет смысла.)_

<span style="color:#a52a2a;font-weight:bold">o.outputfile</span> - имя выходного файла.

<span style="color:#a52a2a;font-weight:bold">o.out\_encoding</span> - кодировка выходного файла (по умолчанию utf8).

<span style="color:#a52a2a;font-weight:bold">o.progress\_bar</span> - переменная, которая может использоваться для отключения индикации прогресса (progressbar).</br>
По умолчанию имеет значение **_true_**</br>
Отключение: _o.progress\_bar = false_;

<span style="color:#a52a2a;font-weight:bold">o.progress\_bar\_title</span> - переменная, которая может использоваться для вывода заголовка над индикатором прогресса.
Пример: `o.progress_bar_title = 'Reading file:\n';`

<span style="color:#a52a2a;font-weight:bold">o.path</span> - путь к папке в которой находится скрипт.

<span style="color:#a52a2a;font-weight:bold">o.repeat</span> - переменная, которая может использоваться для перезапуска функций **_byline_**, **_by\_dsl\_article_**, **_entirefile_** или **_by\_gls\_article_**

<span style="color:#a52a2a;font-weight:bold">o.res</span> - массив, содержимое которого в конце работы скрипта пишется в выходной файл (если не пустой).

<span style="color:#a52a2a;font-weight:bold">o.stop</span> - изначально ничего не содержит, но если в нее что-то поместить, то скрипт немедленно остановит работу и выведет содержимое этой переменной на экран.

<span style="color:#a52a2a;font-weight:bold">o.tab</span> - пустой объект (_o.tab = Object.create(null)_), может использоваться для любых целей.

<span style="color:#a52a2a;font-weight:bold">o.utils</span> - объект, который предоставляет для использования ряд полезных методов ([подробнее](#link))

<span style="color:#a52a2a;font-weight:bold">o.utilspath</span> - переменная содержит путь к _/nodereplacer/files/rep\_modules/utils_

Если для работы требуются глобальные переменные (которые будут существовать на протяжении всей работы скрипта), то следует использовать объект **_o_**.

###### Использование null

Если функция создаваемая скриптом из списка замен вернет пустую строку (<span style="color:#a52a2a;font-weight:bold">s</span> = ''), то в выходной файл будет добавлено только содержимое переменной <span style="color:#a52a2a;font-weight:bold">o.eol</span>.</br>
Если o.eol не пустая (по умолчанию содержит `\n`), то появится пустая строка.</br>
Если пустая строка нежелательна, то следует либо очистить <span style="color:#a52a2a;font-weight:bold">o.eol</span> или сделать так чтобы функция replace вернула null (<span style="color:#a52a2a;font-weight:bold">s</span> = null).

###### Массив o.res, функция onexit и onstart

В конце работы (после прочтения и обработки всех строк или статей) скрипт записывает содержимое массива <span style="color:#a52a2a;font-weight:bold">o.res</span> в выходной файл (если он не пустой).

В конце работы скрипт также вызывает один раз функцию <span style="color:#a52a2a;font-weight:bold">onexit</span>, если такая имеется в списке замен.</br>
При этом остальной код списка замен игнорируется.</br>
Эту функцию можно, к примеру, использовать для подготовки данных в массиве o.res перед записью (сортировка и т.п.).

Функция <span style="color:#a52a2a;font-weight:bold">o.onstart</span> запускается прежде чем скрипт начнет работать с входным файлом.

###### Методы объекта o.utils

_Код всех методов можно найти в файле_ `/nodereplacer/files/rep_modules/utils/index.js`

ПОЛНЫЙ СПИСОК МЕТОДОВ

1. init\_cheerio
2. normalizeHTML - меняет [\f\n\r\t\v ]+ на пробел
3. decodeHTML - декодирует HTML сущности (entities)
4. encodeHTML - кодирует некоторые символы в HTML сущности (entities)
5. decode - меняет кодировку текста (iconv-lite)
6. remove\_odd\_slash - удаляет неэкранированные обратные слеши
7. remove\_comments - удаляет {{комментарий}}
8. remove\_scb - удаляет {текст} (scb = single curly brackets)
9. guessEncoding - пытается определить кодировку файла (utf8 или utf16le)
10. fileExists
11. openroundbrackets - кошка(ми) => кошка и кошками
12. filter\_gls\_hw\_list - кот|котами|кот => кот|котами (hw = headword)
13. spinner\_start
14. spinner\_stop

ПОДРОБНОСТИ

**_init\_cheerio(html, options)_**
**_init\_cheerio\_old(html, options)_**
**_init\_cheerio\_new(html, options, isDocument)_**

С недавних пор оригинальный модуль [cheerio](https://github.com/cheeriojs/cheerio) притерпел [существенные изменения](https://github.com/cheeriojs/cheerio/blob/1.0.0-rc.2/History.md#100-rc2--2017-07-02), повлекшие за собой частичную обратную **не**совместимость.</br>
В частности это заключается в использовании нового парсера [parse5](https://github.com/inikulin/parse5) и, в связи с этим, непониманием некоторых опций ранее испольуемого парсера [htmlparser2](https://github.com/fb55/htmlparser2).</br>
Указанные выше методы инициализации решают проблему этой несовместимости и позволяют контролировать как используемый парсер, так и соответствующие опции.

Использование:
```javascript
/*
  стандартная инициализация, соответствующая старой версии cheerio
  при этом опции по умолчанию принимают следующие значения:
  { decodeEntities: false,
    normalizeWhitespace: true,
    withDomLvl1: true,
    xml: false }
  используемый парсер - htmlparser2
*/
//let $ = o.utils.init_cheerio(s);

/*
  инициализация, идентичная init_cheerio
  при этом передаются опции, отличные от дефлотных:
  { decodeEntities: true,
    normalizeWhitespace: false }
  используется htmlparser2
*/
//let $ = o.utils.init_cheerio_old(s, {decodeEntities: true, normalizeWhitespace: false});

/*
  инициализация с новым парсером parse5
  дефолтные опции прежние
  выполняется проверка на наличие структуры документа
  в зависимости от результатов контент обрабатывается либо как Document, либо как DocumentFragment
*/
//let $ = o.utils.init_cheerio_new(s);

/*
  инициализация с новым парсером parse5
  и отличной от дефолтной опцией
  выполняется проверка на наличие структуры документа
*/
//let $ = o.utils.init_cheerio_new(s, {normalizeWhitespace: false});

/*
  инициализация с новым парсером parse5,
  отличной от дефолтной опцией
  и принудительным включением режима документа.
  в случае передачи третьим параметром false
  включается режим DocumentFragment, независимо от наличия структуры документа
*/
//let $ = o.utils.init_cheerio_new(s, {normalizeWhitespace: false}, true);

/*
  инициализация с новым парсером parse5,
  дефолтными опциями
  и принудительным включением режима DocumentFragment
*/
//let $ = o.utils.init_cheerio_new(s, {}, false);
let $ = o.utils.init_cheerio_new(s, null, false);


//$('.foo').reptag('[test]', '[/test]');
//$('.foo').changeTag('test');
//$('.foo').unwrap();
$('.foo').wrapAll('');
s = $.html();
```
Инициализатор, также, добавляет четыре метода, которых нет в cheerio:

**unwrap**,</br>
**wrapAll**,</br>
**reptag**,</br>
**changeTag**

Первые два метода делают то же, что и одноимённые методы JQuery.</br>
Третий (**_reptag_**) аналогов в JQuery не имеет и может быть использован для замены тегов.

Пример:
```javascript
//Содержание входного файла:
//<span class="italic">aaa</span><span class="italic">bbb</span>
//Командная строка: rep -rt list input.txt output.txt

let $ = o.utils.init_cheerio(s);

$('.italic').reptag('[i]', '[/i]');

s = $.html();

//Результат:
//[i]aaa[/i][i]bbb[/i]
```
Метод **_changeTag_** предназначен для быстрой замены имени тега с сохранением атрибутов.

Пример:
```javascript
//Содержание входного файла:
//<span class="italic">aaa</span><span class="italic">bbb</span>
//Командная строка: rep -rt list input.txt output.txt

let $ = o.utils.init_cheerio(s);

$('.italic').changeTag('test');

s = $.html();

//Результат:
//<test class="italic">aaa</test><test class="italic">bbb</test>
```
**_normalizeHTML(str)_**

Код метода:
```javascript
normalizeHTML(str) {
        const pattern1 = /[\f\n\r\t\v ]+/g;
        str = str.replace(pattern1, ' ');
        return str;
}
```
**_decodeHTML(str)_**

Код метода:
```javascript
decodeHTML(str) {
        return require('entities').decodeHTML(str);
}
```
**_encodeHTML(str)_**

Код метода:
```javascript
encodeHTML(str) {
        return require('entities').encodeHTML(str);
}
```
**_decode(str, charset)_**

Код метода:
```javascript
decode(str, charset) {
        return require('iconv-lite').decode(str, charset);
}
```
**_remove\_odd\_slash(str, a)_**

Удаление неэкранированных обратных слешей (с проверкой на чётность)

Если второй аргумент "a" имеет значение **_true_**, то:
```javascript
  s = s.replace(/(\\*)/g, function(a, m1) { if ((m1.length % 2) === 1) m1 = m1.slice(0, -1); return m1; });
```
Если второй аргумент отсутствует, то
```javascript
  s = s.replace(/(\\*)([@#\^~\[\]\{\}\(\)])/g,  function(a, m1, m2){if ((m1.length % 2) === 1) m1 = m1.slice(0, -1); return m1 + m2; });
```
**_remove\_comments(str)_**

Удаляет закомментированные части - {{комментарий}}

**_remove\_scb(str)_** _(scb - сокращение от single curly braces)_

Удаляет {текст}

**_guessEncoding(path)_**

Пытается определить кодировку укажанного в **_path_** файла (UTF-16LE или UTF-8).

В случае отсутствия в файле BOM метод вернёт utf8

**_openroundbrackets(h, cb)_**

Раскрывает крыглые скобоки в заголовках.

_Второй аргумент опциональный, используется плагином_ -rb, _когда он запускается с ключом -**dsl2** или -**dslm2**_

Формат возвращаемых данных:</br>
`[[массив с заголовками], [массив с информацией об ошибках]]`

Массив с информацией об ошибках:</br>
```
[0] - ( без )
[1] - ) без (
[2] - { без }
[3] - } без {
[4] - ошибка: альтернативных частей больше 6
[5] - неэкранированный @
[6] - неэкранированный #
[7] - заголовок целиком состоит из альтернативной части
[8] - имеются ли ошибки (true/false)
```

**_filter\_gls\_hw\_list(str)_**

Для фильтрации заголовков в GLS файле.

_Дубликаты из списка заголовков удаляются._

_При этом сохраняются заголовки, которые находятся в начале строки._

Пример:

до)
_кот|котами|кот_

после)
_кот|котами (а не котами|кот)_

**_fileExists(filePath)_**

Проверка существования файла.

**_spinner\_start(msg, arr, time)_**</br>
**_spinner\_stop(id, msg)_**

Пример использования
```javascript
let spin = o.utils.spinner_start('Processing... %s', ['|', '/', '—', '\\',]);
o.utils.spinner_stop(spin, 'Processing... Done\n');

let spin = o.utils.spinner_start('Checking... %s', ['◢', '◣', '◤', '◥',]);
o.utils.spinner_stop(spin, 'Checking... OK\n');

o.spin = o.utils.spinner_start('Loading... %s', ['...', '..', '.', '',], 400);
o.utils.spinner_stop(o.spin);

o.spin = o.utils.spinner_start('%s Loading...', ['🌒', '🌓', '🌔', '🌕',]);
o.utils.spinner_stop(o.spin, '🌑 Loading...\n');
```

###### Модуль htmlclean

Этот модуль содержит только одну функцию из одноимённого модуля [github.com/anseki/htmlclean](https://github.com/anseki/htmlclean)

**Назначение**: _Удаление излишних пробельных символов в HTML-исходнике_.

_В целях улучшения производительности из модуля был удалён расширенный функционал._</br>
_Для лучших результатов рекомендуется использовать в сочетании с HTML-парсерами **parse5**, **htmlparser2** или другими модулями на их основе._

Тестовый пример:
```javascript
const htmlclean = require(o.utilspath + 'htmlclean.js').htmlclean;

const dirtyHtml = String.raw`
    <h1>     
      My First Heading</h1>
    <p>
    My first    paragraph.
        </p>
    <b>болд <i> болд-курсив </i> </b> <i> курсив <u> курсив-подчёркивание </u> </i> <u> подчёркивание </u>

`;

let r = htmlclean(dirtyHtml);
console.log(r);

/*

Результат:
<h1> My First Heading</h1><p> My first paragraph.</p> <b>болд <i>болд-курсив</i></b> <i>курсив <u>курсив-подчёркивание</u></i> <u>подчёркивание</u>

*/
```

###### Плагины

Для операций, кроме тех, которые запускаются с ключами _**-rt, -re, -rd, -rg**_ и _**-rs**_ используются отдельные файлы с javascript кодом.

Эти файлы находятся в папке "_**files/plugins_**" и их имена совпадают с используемыми в командной строке ключами без символа "-".

Например:</br>
node nodereplacer.js **_-pile_** input.txt output.txt - files/plugins/**_pile.js_**</br>
node nodereplacer.js **_-susp_** input.txt output.txt - files/plugins/**_susp.js_**</br>
node nodereplacer.js **_-symb_** input.txt output.txt - files/plugins/**_symb.js_**

При создании плагинов необходимо исходя из потребностей выбрать один из трёх форматов командной строки, которые допустимы при их использовании:

1) node nodereplacer.js **_-ключ1_** **_-ключ2_** input.txt output.txt</br>
2) node nodereplacer.js **_-ключ1_** input.txt output.txt</br>
3) node nodereplacer.js **_-ключ1_** **_-ключ2_** output.txt</br>
4) node nodereplacer.js **_-ключ1_** input.txt</br>
5) node nodereplacer.js **_-ключ1_** output.txt

Первый ключ - имя файла с плагином без "-" и расширения.
При именовании файлов недопустимо использовать следующие имена: **_rt, re, rd, rg, rs_**

Второй ключ используется для передачи дополнительной информации.

При использовании плагинов по умолчанию входной файл читается постатейно (режим _**by\_dsl\_article_**).

Выбор режима чтения (построчный, постатейный...) через командную строку невозможен.

Чтобы переключиться на построчный режим (например при обработке файла, который не имеет словарной структуры) надо добавить в начале плагина следующий код:
```javascript
function onstart()
{
  o.byline();
}
```
Пример простенького плагина:

**Назначение**: _Получение списка символов_.

**Название файла**: _slist.js_

Этот файл должен находиться в папке "_**files/plugins_**"

Командная строка:</br>
_**node nodereplacer.js -slist input.txt output.txt_**

Код:
```javascript
//Обработка построчная.
function onstart()
{
        o.byline();
}

//Режем строку на символы.
let arr = [...s];

//фильтруем.
while (arr !== null && arr.length !== 0)
{
        const c = arr.shift();
        if (/^[^\s]$/.test(c))
                o.tab[c] = '';
}


//Чтобы прочитанная строка не была записана в выходной файл.
s = null;

//Переносим данные в массив o.res и сортируем.
function onexit()
{
        for (let key in o.tab)
        {
                o.res.push(key);
        }

        o.res.sort();
}
```
Возможный результат:
```
b
d
g
i
o
p
r
И т. д.
```
###### Тестирование

[На отдельной странице](tester.md).

###### Примеры и сниппеты

Можно посмотреть в папке `/nodereplacer/files/snippets`

###### Разное

УНИВЕРСАЛЬНЫЙ ИНДИКАТОР ПРОГРЕССА

Пример использования:
```javascript
const pb = require(o.utilspath).progressbar(o.arr.length, 1);
pb.start();

for (let i = 0; i < arr.length; i++)
{
        pb.stat = i;
}

pb.end();
```
Второй аргумент в _**progressbar**_ можно опустить, в этом случае будет использовано значение по умолчанию - 0.

Значение этого аргумента влияет на формат индикации, 0 - полная, 1 - более компактная.

МОДУЛЬ ДЛЯ ИЗМЕРЕНИЯ ПОТРЕБЛЕНИЯ ПАМЯТИ

Пример использования:
```javascript
function onstart()
{

        o.mem = require(o.utilspath + 'memory.js').mem(100);
        o.mem.start();
        o.byline();

}

function onexit()
{
        o.mem.stop();
        console.log('\nMemory Usage (max rss): ' + o.mem.get());

}
```
Интервал измерений можно изменить на другой, в примере выше - 100 миллисекунд

Результат - максимальный уровень в мегабайтах, который был достигнут (пойман) до окончания измерения (а не средний уровень).

СОХРАНЕНИЕ ОРИГИНАЛЬНЫХ РАЗДЕЛИТЕЛЕЙ СТРОК

**Внимание!** Это работает только в построчном режиме чтения.

Разделители во входном файле могут быть разные: `\n`, `\r`, `\r\n`

Но по умолчанию на **Windows** для записи в выходной файл всегда используется либо только `\r\n` или `\n` на **Linux**.

Чтобы сохранить разделители входного файла:
```javascript
function onstart()
{
        o.eol_mode = 1;
        o.byline();
}
```

ЗАПУСК АСИНХРОННОГО КОДА ПОСЛЕ ПРОЧТЕНИЯ ВХОДНОГО ФАЙЛА

**Внимание!** Это работает только в построчном режиме чтения.

Пример:
```javascript
s = null;


async function onexit_async()
{

        function processpage()
        {

                try
                {

                        let title = document.getElementsByTagName('title');
                        return  title[0].innerHTML;  

                }
                catch(e)
                {
                        return e.message;
                }

        }

        try
        {

                const puppeteer = require('puppeteer');
                console.log('\n');
                let spin = o.utils.spinner_start('Processing... %s', ['|', '/', '—', '\\',]);
                const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
                const page = await browser.newPage();

                while (o.idata.next())
                {
                  let v = o.idata.get();
                  await page.setContent(v, { waitUntil: 'domcontentloaded' });
                  let str = await page.evaluate(processpage);
                  o.idata.write(str);

                }

                browser.close();  
                o.utils.spinner_stop(spin, 'Processing... Done\n');
                o.et_show();

        }
        catch(e)
        {
                console.log(e.message);
        }

}
```
Пояснение к коду:

Перед началом чтения входного файла проверяется наличие в списке замен или плагине функции с именем **_onexit_async_**

Если функция с таким именем обнаруживается, то происходит следующее:

* Переменная **_o.eol\_mode_** получает значение **2**
* Переменная **_o.et\_auto_** - **false**
* В самом конце, после выполнения всего кода, который содержит список замен или плагин, функция onexit\_async автоматически запускается.

Автоматическое переназначение переменных **_o.eol\_mode_** и **_o.et\_auto_** происходит до запуска функции **_onstart_**

Поэтому значение их можно ещё изменить вручную, если это нужно в этой функции (смотрите пример в файле _nodereplacer/files/snippets/examples/pupperteer2.js_)

Если **_o.eol\_mode_** сохранит значение **2**, как в этом примере, то будет сознана карта смещений входного файла, которая будет записана в объект **_o.idata_**

После завершения чтения входного файла, не раньше, можно будет пролистать все строки входного файла используя метод **_next_** этого объекта.

Для получения более детальной информации смотрите код класса **_offset\_eol_** в файле _nodereplacer.js_

Функция **_onexit\_async_** игнорируется, если перезапускается чтение входного файла через **_o.repeat_** в функции **_onexit_**

<hr>
