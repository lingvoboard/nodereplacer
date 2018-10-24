# ИНСТРУКЦИЯ К СКРИПТУ nodereplacer.js

### Содержание инструкции:

* [Установка](install.md)
* [Общий раздел](index.md)
* [Замены](replacer.md)
* [Дополнительные плагины](plugins.md)
* **Раздел для программистов**


ИСПОЛЬЗОВАНИЕ JAVASCRIPT КОДА В СПИСКЕ ЗАМЕН

![warning.png](./../warning.png)
Чтобы скрипт не испортил javascript код в списке замен:</br>
Не следует использовать логический оператор || с табуляторами до и после, иначе скрипт примет его за часть разделителя в макросе (см. раздел "[Замены](replacer.md)").

## Содержание раздела:

1. [Содержание объекта o](#Содержание-объекта-o)
2. [Использование null](#Использование-null)
3. [Массив o.res, функция onexit и onstart](#Массив-ores-функция-onexit-и-onstart)
4. [Методы объекта o.utils](#Методы-объекта-outils)
5. [Модуль htmlclean](#Модуль-htmlclean)
6. [Плагины](#Плагины)
7. [Тестирование](#Тестирование)
8. [Примеры и сниппеты](#Примеры-и-сниппеты)
9. [Передача дополнительной информации через командную строку](#Передача-дополнительной-информации через-командную-строку)
10. [Разное](#Разное)

**s** - локальная переменная, которая содержит прочитанную скриптом строку или статью.

#### Содержание объекта o

ПОЛНЫЙ СПИСОК СВОЙСТВ

* [o.arr](#oarr)
* [o.art\_start](#oart_start)
* [o.bom](#obom)
* [o.byline](#obyline)
* [o.by\_gls\_article](#obygls)
* [o.by\_dsl\_article](#obydsl)
* [o.count](#ocount)
* [o.dsl](#odsl)
* [o.eol](#oeol)
* [o.eol\_mode](#oeolmode)
* [o.entirefile](#oentire)
* [o.error\_log\_path](#oelog)
* [o.et\_auto](#oeta)
* [o.et\_show](#oetsh)
* [o.gls](#ogls)
* [o.in\_encoding](#oinen)
* [o.inputfile](#oinf)
* [o.log](#olog)
* [o.loop](#oloop)
* [o.mode](#omode)
* [o.outputfile](#ooutf)
* [o.out\_encoding](#oouten)
* [o.progress\_bar](#oprb)
* [o.progress\_bar\_title](#oprbt)
* [o.path](#opath)
* [o.repeat](#orep)
* [o.res](#ores)
* [o.stop](#ostop)
* [o.tab](#otab)
* [o.utils](#outl)
* [o.utilspath](#outlp)

<a href="#oarr" id="user-content-oarr">**o.arr**</a> - пустой массив, может использоваться для любых целей.

<a href="#oart_start" id="user-content-oart_start">**o.art\_start**</a> - в режиме постатейного чтения DSL-файлов содержит номер строки на которой начинается статья.

<a href="#obom" id="user-content-obom">**o.bom**</a> - BOM (изначально эта переменная содержит '`\uFEFF`').

<a href="#obyline" id="user-content-obyline">**o.byline**</a> - функция **_byline_** из nodereplacer.js

<a href="#obygls" id="user-content-obygls">**o.by\_gls\_article**</a> - функция **_by\_gls\_article_** из nodereplacer.js

<a href="#obydsl" id="user-content-obydsl">**o.by\_dsl\_article**</a> - функция **_by\_dsl\_article_** из nodereplacer.js

<a href="#ocount" id="user-content-ocount">**o.count**</a> - содержит номер прочитанной строки или статьи.

<a href="#odsl" id="user-content-odsl">**o.dsl**</a> - в режиме постатейного чтения файлов в формате DSL эта переменная содержит массив со статьёй.</br>
1. Первый элемент (**o.dsl[0]**) - массив с заголовками (вся заголовочная часть статьи).</br>
2. Второй (**o.dsl[1]**) - тело статьи (одной строкой).</br>
3. Третий (**o.dsl[2]**) - отфильтрованный массив с заголовками (без комментариев и пустых строк).</br>
4. Четвёртый (**o.dsl[3]**) - массив со строками тела. Многострочные комментарии одной строкой.

<a href="#oeol" id="user-content-oeol">**o.eol**</a> - управляющие символ(ы), который будут добавляться при записи в конец строки или статьи (по умолчанию `\n`).

<a href="#oeolmode" id="user-content-oeolmode">**o.eol\_mode**</a> - если эта переменная имеет значение **1**, то в построчном режиме чтения входного файла в выходной файл будут писаться оригинальные разделители строк ([подробнее](#СОХРАНЕНИЕ-ОРИГИНАЛЬНЫХ-РАЗДЕЛИТЕЛЕЙ-СТРОК))</br>
Если **2**, то создаётся карта смещений всех строк входного файла. ([подробнее](#ЗАПУСК-АСИНХРОННОГО-КОДА-ПОСЛЕ-ПРОЧТЕНИЯ-ВХОДНОГО-ФАЙЛА))

<a href="#oentire" id="user-content-oentire">**o.entirefile**</a> - функция **_entirefile_** из nodereplacer.js

<a href="#oelog" id="user-content-oelog">**o.error\_log\_path**</a> - cодержит полный путь к файлу **_error.log_**. По умолчанию этот файл создаётся в одной папке с выходным файлом, но **_error.log_** и выходной файл могут оказаться в разных местах если в списке замен или плагине будет изменено значение **_o.outputfile_**.

<a href="#oeta" id="user-content-oeta">**o.et\_auto**</a> - управляющая переменная, в случае если имеет значение **_true_** (значение по умолчание), то время работы скрипта выводится автоматически.

Если **_false_**, то время работы скрипта не выводится.

<a href="#oetsh" id="user-content-oetsh">**o.et\_show**</a> - функция для вывода времени работы скрипта.

<a href="#ogls" id="user-content-ogls">**o.gls**</a> - в режиме постатейного чтения файлов в формате GLS эта переменная содержит массив со статьёй. Первый элемент - строка с заголовком или заголовками разделёнными символом "|". Второй - тело статьи. Третий - номер строки на которой находится заголовок статьи.

<a href="#oinen" id="user-content-oinen">**o.in\_encoding**</a> - кодировка входного файла (по умолчанию utf8).

<a href="#oinf" id="user-content-oinf">**o.inputfile**</a> - имя входного файла.

<a href="#olog" id="user-content-olog">**o.log**</a> - массив для сообщений.

<a href="#oloop" id="user-content-oloop">**o.loop**</a> - счетчик, значение увеличивается на единицу после каждого запуска функций **_byline_**, **_by\_dsl\_article_**, **_entirefile_** или **_by\_gls\_article_**

<a href="#omode" id="user-content-omode">**o.mode**</a> - возможные значения: '**_byline_**', '**_by\_dsl\_article_**', '**_by\_gls\_article_**', '**_entirefile_**'
_Используется в nodereplacer.js (Изменять значения этой переменной в списках замен или плагинах нет смысла.)_

<a href="#ooutf" id="user-content-ooutf">**o.outputfile**</a> - имя выходного файла.

<a href="#oouten" id="user-content-oouten">**o.out\_encoding**</a> - кодировка выходного файла (по умолчанию utf8).

<a href="#oprb" id="user-content-oprb">**o.progress\_bar**</a> - переменная, которая может использоваться для отключения индикации прогресса (progressbar).</br>
По умолчанию имеет значение **_true_**</br>
Отключение: _o.progress\_bar = false_;

<a href="#oprbt" id="user-content-oprbt">**o.progress\_bar\_title**</a> - переменная, которая может использоваться для вывода заголовка над индикатором прогресса.
Пример: `o.progress_bar_title = 'Reading file:\n';`

<a href="#opath" id="user-content-opath">**o.path**</a> - путь к папке в которой находится скрипт.

<a href="#orep" id="user-content-orep">**o.repeat**</a> - переменная, которая может использоваться для перезапуска функций **_byline_**, **_by\_dsl\_article_**, **_entirefile_** или **_by\_gls\_article_**

<a href="#ores" id="user-content-ores">**o.res**</a> - массив, содержимое которого в конце работы скрипта пишется в выходной файл (если не пустой).

<a href="#ostop" id="user-content-ostop">**o.stop**</a> - изначально ничего не содержит, но если в нее что-то поместить, то скрипт немедленно остановит работу и выведет содержимое этой переменной на экран.

<a href="#otab" id="user-content-otab">**o.tab**</a> - пустой объект (_o.tab = Object.create(null)_), может использоваться для любых целей.

<a href="#outl" id="user-content-outl">**o.utils**</a> - объект, который предоставляет для использования ряд полезных методов ([подробнее](#Методы-объекта-outils))

<a href="#outlp" id="user-content-outlp">**o.utilspath**</a> - переменная содержит путь к _/nodereplacer/files/rep\_modules/utils_

Если для работы требуются глобальные переменные (которые будут существовать на протяжении всей работы скрипта), то следует использовать объект **_o_**.

#### Использование null

Если функция создаваемая скриптом из списка замен вернет пустую строку (**s** = ''), то в выходной файл будет добавлено только содержимое переменной **o.eol**.</br>
Если o.eol не пустая (по умолчанию содержит `\n`), то появится пустая строка.</br>
Если пустая строка нежелательна, то следует либо очистить **o.eol** или сделать так чтобы функция replace вернула null (**s** = null).

#### Массив o.res, функция onexit и onstart

В конце работы (после прочтения и обработки всех строк или статей) скрипт записывает содержимое массива **o.res** в выходной файл (если он не пустой).

В конце работы скрипт также вызывает один раз функцию **onexit**, если такая имеется в списке замен.</br>
При этом остальной код списка замен игнорируется.</br>
Эту функцию можно, к примеру, использовать для подготовки данных в массиве o.res перед записью (сортировка и т.п.).

Функция **o.onstart** запускается прежде чем скрипт начнет работать с входным файлом.

#### Методы объекта o.utils

_Код всех методов можно найти в файле_ `/nodereplacer/files/rep_modules/utils/index.js`

ПОЛНЫЙ СПИСОК МЕТОДОВ

1. [init\_cheerio](#cheerio)
2. [normalizeHTML](#normhtml) - _меняет_ `[\f\n\r\t\v ]+` _на пробел_
3. [decodeHTML](#dehtml) - _декодирует HTML сущности_ ([entities](https://www.npmjs.com/package/entities))
4. [encodeHTML](#enhtml) - _кодирует некоторые символы в HTML сущности_ ([entities](https://www.npmjs.com/package/entities))
5. [decode](#decode) - _меняет кодировку текста_ ([iconv-lite](https://github.com/ashtuchkin/iconv-lite))
6. [remove\_odd\_slash](#rmodds) - _удаляет неэкранированные обратные слеши_
7. [remove\_comments](#rmcom) - _удаляет_ `{{комментарий}}`
8. [remove\_scb](#rmscb) - _удаляет_ `{текст} (scb = single curly brackets)`
9. [guessEncoding](#guessen) - _пытается определить кодировку файла (utf8 или utf16le)_
10. [fileExists](#fileex)
11. [dirExists](#direx)
12. [openroundbrackets](#oroundbr) - `кошка(ми) => кошка и кошками`
13. [filter\_gls\_hw\_list](#filter) - `кот|котами|кот => кот|котами (hw = headword)`
14. [spinner\_start](#spinner) 
15. [spinner\_stop](#spinner)

ПОДРОБНОСТИ

<a href="#cheerio" id="user-content-cheerio">**init\_cheerio**</a>

**_init\_cheerio(html, options)_**</br>
**_init\_cheerio\_old(html, options)_**</br>
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
//let $ = o.utils.init_cheerio(s)

/*
  инициализация, идентичная init_cheerio
  при этом передаются опции, отличные от дефлотных:
  { decodeEntities: true,
    normalizeWhitespace: false }
  используется htmlparser2
*/
//let $ = o.utils.init_cheerio_old(s, {decodeEntities: true, normalizeWhitespace: false})

/*
  инициализация с новым парсером parse5
  дефолтные опции прежние
  выполняется проверка на наличие структуры документа
  в зависимости от результатов контент обрабатывается либо как Document, либо как DocumentFragment
*/
//let $ = o.utils.init_cheerio_new(s)

/*
  инициализация с новым парсером parse5
  и отличной от дефолтной опцией
  выполняется проверка на наличие структуры документа
*/
//let $ = o.utils.init_cheerio_new(s, {normalizeWhitespace: false})

/*
  инициализация с новым парсером parse5,
  отличной от дефолтной опцией
  и принудительным включением режима документа.
  в случае передачи третьим параметром false
  включается режим DocumentFragment, независимо от наличия структуры документа
*/
//let $ = o.utils.init_cheerio_new(s, {normalizeWhitespace: false}, true)

/*
  инициализация с новым парсером parse5,
  дефолтными опциями
  и принудительным включением режима DocumentFragment
*/
//let $ = o.utils.init_cheerio_new(s, {}, false)
let $ = o.utils.init_cheerio_new(s, null, false)


//$('.foo').reptag('[test]', '[/test]')
//$('.foo').changeTag('test')
//$('.foo').unwrap()
$('.foo').wrapAll('')
s = $.html()
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

let $ = o.utils.init_cheerio(s)

$('.italic').reptag('[i]', '[/i]')

s = $.html()

//Результат:
//[i]aaa[/i][i]bbb[/i]
```
Метод **_changeTag_** предназначен для быстрой замены имени тега с сохранением атрибутов.

Пример:
```javascript
//Содержание входного файла:
//<span class="italic">aaa</span><span class="italic">bbb</span>
//Командная строка: rep -rt list input.txt output.txt

let $ = o.utils.init_cheerio(s)

$('.italic').changeTag('test')

s = $.html()

//Результат:
//<test class="italic">aaa</test><test class="italic">bbb</test>
```

<a href="#normhtml" id="user-content-normhtml">**normalizeHTML(str)**</a>

Код метода:
```javascript
normalizeHTML(str) {
  const pattern1 = /[\f\n\r\t\v ]+/g
  str = str.replace(pattern1, ' ')
  return str
}
```

<a href="#dehtml" id="user-content-dehtml">**decodeHTML(str)**</a>

Код метода:
```javascript
decodeHTML(str) {
  return require('entities').decodeHTML(str)
}
```

<a href="#enhtml" id="user-content-enhtml">**encodeHTML(str)**</a>

Код метода:
```javascript
encodeHTML(str) {
  return require('entities').encodeHTML(str)
}
```

<a href="#decode" id="user-content-decode">**decode(str, charset)**</a>

Код метода:
```javascript
decode(str, charset) {
  return require('iconv-lite').decode(str, charset)
}
```

<a href="#rmodds" id="user-content-rmodds">**remove\_odd\_slash(str, a)**</a>

Удаление неэкранированных обратных слешей (с проверкой на чётность)

Если второй аргумент "a" имеет значение **_true_**, то:
```javascript
  s = s.replace(/(\\*)/g, function(a, m1) { if ((m1.length % 2) === 1) m1 = m1.slice(0, -1); return m1; })
```
Если второй аргумент отсутствует, то
```javascript
  s = s.replace(/(\\*)([@#\^~\[\]\{\}\(\)])/g,  function(a, m1, m2){if ((m1.length % 2) === 1) m1 = m1.slice(0, -1); return m1 + m2; })
```

<a href="#rmcom" id="user-content-rmcom">**remove\_comments(str)**</a>

Удаляет закомментированные части - `{{комментарий}}`

<a href="#rmscb" id="user-content-rmscb">**remove\_scb(str) - _(scb - сокращение от single curly braces)_**</a>

Удаляет `{текст}`

<a href="#guessen" id="user-content-guessen">**guessEncoding(path)**</a>

Пытается определить кодировку укажанного в **_path_** файла (UTF-16LE или UTF-8).

Метод синхронный.

В случае отсутствия в файле BOM метод вернёт utf8

<a href="#oroundbr" id="user-content-oroundbr">**openroundbrackets(h, cb)**</a>

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

<a href="#filter" id="user-content-filter">**filter\_gls\_hw\_list(str)**</a>

Для фильтрации заголовков в GLS файле.

_Дубликаты из списка заголовков удаляются._

_При этом сохраняются заголовки, которые находятся в начале строки._

Пример:

до)</br>
_кот|котами|кот_

после)</br>
_кот|котами (а не котами|кот)_

<a href="#fileex" id="user-content-fileex">**fileExists(filePath)**</a>

Проверка существования файла.

Метод синхронный.

<a href="#direx" id="user-content-direx">**dirExists(dirPath)**</a>

Проверка существования директории.

Метод синхронный.

<a href="#spinner" id="user-content-spinner">**spinner**</a>

**_spinner\_start(msg, arr, time)_**</br>
**_spinner\_stop(id, msg)_**

Пример использования
```javascript
let spin = o.utils.spinner_start('Processing... %s', ['|', '/', '—', '\\',])
o.utils.spinner_stop(spin, 'Processing... Done\n')

let spin = o.utils.spinner_start('Checking... %s', ['◢', '◣', '◤', '◥',])
o.utils.spinner_stop(spin, 'Checking... OK\n')

o.spin = o.utils.spinner_start('Loading... %s', ['...', '..', '.', '',], 400)
o.utils.spinner_stop(o.spin)

o.spin = o.utils.spinner_start('%s Loading...', ['🌒', '🌓', '🌔', '🌕',])
o.utils.spinner_stop(o.spin, '🌑 Loading...\n')
```

#### Модуль htmlclean

Этот модуль содержит только одну функцию из одноимённого модуля [github.com/anseki/htmlclean](https://github.com/anseki/htmlclean)

**Назначение**: _Удаление излишних пробельных символов в HTML-исходнике_.

_В целях улучшения производительности из модуля был удалён расширенный функционал._</br>
_Для лучших результатов рекомендуется использовать в сочетании с HTML-парсерами **parse5**, **htmlparser2** или другими модулями на их основе._

Тестовый пример:
```javascript
const htmlclean = require(o.utilspath + 'htmlclean.js').htmlclean

const dirtyHtml = String.raw`
    <h1>     
      My First Heading</h1>
    <p>
    My first    paragraph.
        </p>
    <b>болд <i> болд-курсив </i> </b> <i> курсив <u> курсив-подчёркивание </u> </i> <u> подчёркивание </u>

`

let r = htmlclean(dirtyHtml)
console.log(r)

/*

Результат:
<h1> My First Heading</h1><p> My first paragraph.</p> <b>болд <i>болд-курсив</i></b> <i>курсив <u>курсив-подчёркивание</u></i> <u>подчёркивание</u>

*/
```
#### Плагины

Для операций, кроме тех, которые запускаются с ключами _**-rt, -re, -rd, -rg**_ и _**-rs**_ на первой позиции в командной строке, используются файлы с кодом из директории **plugins** (_/nodereplacer/files/plugins_).

Имя первого ключа - это имя плагина без расширения и "-". 


Пример:</br>
node nodereplacer.js **_-pile_** input.txt output.txt - **_pile.js_**</br>
node nodereplacer.js **_-susp_** input.txt output.txt - **_susp.js_**</br>
node nodereplacer.js **_-symb_** input.txt output.txt - **_symb.js_**

Формат командной строки для плагинов:</br>
node nodereplacer.js **_-ключ1_** ...

**nodereplacer.js** проверяет только валидность первого ключа, остальная часть командной строки проверяется уже внутри плагина.

При именовании плагинов недопустимо использовать следующие зарезервированные слова: **_rt, re, rd, rg, rs_**

#### Тестирование

[На отдельной странице](tester.md).

#### Примеры и сниппеты

Можно посмотреть в папке `/nodereplacer/files/snippets`

#### Передача дополнительной информации через командную строку

Для передачи дополнительной информации через командную строку можно использовать ключи вида --ключ_значение.

При этом все ключи, которые начинаются с -- удаляются из process.argv перед обработкой командной строки.

Код с помощью которого реализована эта возможность:

```
process['dev_argv'] = Object.create(null)

process.argv = process.argv.filter(argv => {
  if (/^--.*$/i.test(argv)) {
    let m
    if ((m = /^--(\w+)_([\w\-]+)$/i.exec(argv))) {
      process['dev_argv'][m[1]] = m[2]
    }

    return false
  } else {
    return true
  }
})

```

Пример использования:
```
//rep -rec5m test o --encoding_win1251
if (o.dev_argv.encoding) {
  var html = iconvLite.decode(
    fs.readFileSync(arr[i].path),
    o.dev_argv.encoding
  )
} else {
  var html = fs.readFileSync(arr[i].path)
}

```
#### Разное

##### УНИВЕРСАЛЬНЫЙ ИНДИКАТОР ПРОГРЕССА

Пример использования:
```javascript
const pb = require(o.utilspath).progressbar(o.arr.length, 1)
pb.start()

for (let i = 0; i < arr.length; i++) {
  pb.stat = i
}

pb.end()
```
Второй аргумент в _**progressbar**_ можно опустить, в этом случае будет использовано значение по умолчанию - 0.

Значение этого аргумента влияет на формат индикации, 0 - полная, 1 - более компактная.

##### МОДУЛЬ ДЛЯ ИЗМЕРЕНИЯ ПОТРЕБЛЕНИЯ ПАМЯТИ

Пример использования:
```javascript
function onstart() {
  o.mem = require(o.utilspath + 'memory.js').mem(100)
  o.mem.start()
  o.byline()
}

function onexit() {
  o.mem.stop()
  console.log('\nMemory Usage (max rss): ' + o.mem.get())
}
```
Интервал измерений можно изменить на другой, в примере выше - 100 миллисекунд

Результат - максимальный уровень в мегабайтах, который был достигнут (пойман) до окончания измерения (а не средний уровень).

##### СОХРАНЕНИЕ ОРИГИНАЛЬНЫХ РАЗДЕЛИТЕЛЕЙ СТРОК

**Внимание!** Это работает только в построчном режиме чтения.

Разделители во входном файле могут быть разные: `\n`, `\r`, `\r\n`

Но по умолчанию на **Windows** для записи в выходной файл всегда используется либо только `\r\n` или `\n` на **Linux**.

Чтобы сохранить разделители входного файла:
```javascript
function onstart() {
  o.eol_mode = 1
  o.byline()
}
```

##### ЗАПУСК АСИНХРОННОГО КОДА ПОСЛЕ ПРОЧТЕНИЯ ВХОДНОГО ФАЙЛА

**Внимание!** Это работает только в построчном режиме чтения.

Пример:
```javascript
s = null

async function onexit_async () {
  function processpage () {
    try {
      let title = document.getElementsByTagName('title')
      return title[0].innerHTML
    } catch (e) {
      return e.message
    }
  }

  try {
    const puppeteer = require('puppeteer')
    console.log('\n')
    let spin = o.utils.spinner_start('Processing... %s', ['|', '/', '—', '\\'])
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()

    while (o.idata.next()) {
      let v = o.idata.get()
      await page.setContent(v, { waitUntil: 'domcontentloaded' })
      let str = await page.evaluate(processpage)
      o.idata.write(str)
    }

    browser.close()
    o.utils.spinner_stop(spin, 'Processing... Done\n')
    o.et_show()
  } catch (e) {
    console.log(e.message)
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
