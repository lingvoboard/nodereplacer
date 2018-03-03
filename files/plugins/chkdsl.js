// Выявление ошибок в словарях в формате DSL.
// Код плагина синхронизирован с chkdsl.js v1.1.5

function onstart () {
  o.byteCount = 0

  o.fileSize = 0

  o.getByteLength = Buffer.byteLength

  o.HeadWords1 = Object.create(null)

  o.HeadWords2 = Object.create(null)

  o.SubEntriesErrors = Object.create(null)

  o.ArticleCountGlobal = 0

  o.Colors = Object.create(null)

  o.trs = false
  o.cyr = false

  o.Colors['aliceblue'] = ''
  o.Colors['antiquewhite'] = ''
  o.Colors['aquamarine'] = ''
  o.Colors['aqua'] = ''
  o.Colors['azure'] = ''
  o.Colors['beige'] = ''
  o.Colors['bisque'] = ''
  o.Colors['blanchedalmond'] = ''
  o.Colors['blueviolet'] = ''
  o.Colors['blue'] = ''
  o.Colors['brown'] = ''
  o.Colors['burlywood'] = ''
  o.Colors['cadetblue'] = ''
  o.Colors['chartreuse'] = ''
  o.Colors['chocolate'] = ''
  o.Colors['coral'] = ''
  o.Colors['cornflower'] = ''
  o.Colors['cornsilk'] = ''
  o.Colors['crimson'] = ''
  o.Colors['cyan'] = ''
  o.Colors['darkblue'] = ''
  o.Colors['darkcyan'] = ''
  o.Colors['darkgoldenrod'] = ''
  o.Colors['darkgray'] = ''
  o.Colors['darkgreen'] = ''
  o.Colors['darkkhaki'] = ''
  o.Colors['darkmagenta'] = ''
  o.Colors['darkolivegreen'] = ''
  o.Colors['darkorange'] = ''
  o.Colors['darkorchid'] = ''
  o.Colors['darkred'] = ''
  o.Colors['darksalmon'] = ''
  o.Colors['darkseagreen'] = ''
  o.Colors['darkslateblue'] = ''
  o.Colors['darkslategray'] = ''
  o.Colors['darkturquoise'] = ''
  o.Colors['darkviolet'] = ''
  o.Colors['deeppink'] = ''
  o.Colors['deepskyblue'] = ''
  o.Colors['dimgray'] = ''
  o.Colors['dodgerblue'] = ''
  o.Colors['firebrick'] = ''
  o.Colors['floralwhite'] = ''
  o.Colors['forestgreen'] = ''
  o.Colors['fuchsia'] = ''
  o.Colors['gainsboro'] = ''
  o.Colors['ghostwhite'] = ''
  o.Colors['goldenrod'] = ''
  o.Colors['gold'] = ''
  o.Colors['gray'] = ''
  o.Colors['greenyellow'] = ''
  o.Colors['green'] = ''
  o.Colors['honeydew'] = ''
  o.Colors['hotpink'] = ''
  o.Colors['indianred'] = ''
  o.Colors['indigo'] = ''
  o.Colors['ivory'] = ''
  o.Colors['khaki'] = ''
  o.Colors['lavenderblush'] = ''
  o.Colors['lavender'] = ''
  o.Colors['lawngreen'] = ''
  o.Colors['lemonchiffon'] = ''
  o.Colors['lightblue'] = ''
  o.Colors['lightcoral'] = ''
  o.Colors['lightcyan'] = ''
  o.Colors['lightgoldenrodyellow'] = ''
  o.Colors['lightgray'] = ''
  o.Colors['lightgreen'] = ''
  o.Colors['lightpink'] = ''
  o.Colors['lightsalmon'] = ''
  o.Colors['lightseagreen'] = ''
  o.Colors['lightskyblue'] = ''
  o.Colors['lightslategray'] = ''
  o.Colors['lightsteelblue'] = ''
  o.Colors['lightyellow'] = ''
  o.Colors['limegreen'] = ''
  o.Colors['lime'] = ''
  o.Colors['linen'] = ''
  o.Colors['magenta'] = ''
  o.Colors['maroon'] = ''
  o.Colors['mediumaquamarine'] = ''
  o.Colors['mediumblue'] = ''
  o.Colors['mediumorchid'] = ''
  o.Colors['mediumpurple'] = ''
  o.Colors['mediumseagreen'] = ''
  o.Colors['mediumslateblue'] = ''
  o.Colors['mediumspringgreen'] = ''
  o.Colors['mediumturquoise'] = ''
  o.Colors['mediumvioletred'] = ''
  o.Colors['midnightblue'] = ''
  o.Colors['mintcream'] = ''
  o.Colors['mistyrose'] = ''
  o.Colors['moccasin'] = ''
  o.Colors['navajowhite'] = ''
  o.Colors['navy'] = ''
  o.Colors['oldlace'] = ''
  o.Colors['olivedrab'] = ''
  o.Colors['olive'] = ''
  o.Colors['orangered'] = ''
  o.Colors['orange'] = ''
  o.Colors['orchid'] = ''
  o.Colors['palegoldenrod'] = ''
  o.Colors['palegreen'] = ''
  o.Colors['paleturquoise'] = ''
  o.Colors['palevioletred'] = ''
  o.Colors['papayawhip'] = ''
  o.Colors['peachpuff'] = ''
  o.Colors['peru'] = ''
  o.Colors['pink'] = ''
  o.Colors['plum'] = ''
  o.Colors['powderblue'] = ''
  o.Colors['purple'] = ''
  o.Colors['red'] = ''
  o.Colors['rosybrown'] = ''
  o.Colors['royalblue'] = ''
  o.Colors['saddlebrown'] = ''
  o.Colors['salmon'] = ''
  o.Colors['sandybrown'] = ''
  o.Colors['seagreen'] = ''
  o.Colors['seashell'] = ''
  o.Colors['sienna'] = ''
  o.Colors['silver'] = ''
  o.Colors['skyblue'] = ''
  o.Colors['slateblue'] = ''
  o.Colors['slategray'] = ''
  o.Colors['snow'] = ''
  o.Colors['springgreen'] = ''
  o.Colors['steelblue'] = ''
  o.Colors['tan'] = ''
  o.Colors['teal'] = ''
  o.Colors['thistle'] = ''
  o.Colors['tomato'] = ''
  o.Colors['turquoise'] = ''
  o.Colors['violet'] = ''
  o.Colors['wheat'] = ''
  o.Colors['whitesmoke'] = ''
  o.Colors['white'] = ''
  o.Colors['yellowgreen'] = ''
  o.Colors['yellow'] = ''

  o.Languages = Object.create(null)

  o.Languages['Afrikaans'] = ''
  o.Languages['Arabic'] = ''
  o.Languages['ArmenianWestern'] = ''
  o.Languages['Armenian'] = ''
  o.Languages['AzeriLatin'] = ''
  o.Languages['Bashkir'] = ''
  o.Languages['Basque'] = ''
  o.Languages['Belarusian'] = ''
  o.Languages['Bulgarian'] = ''
  o.Languages['ChinesePRC'] = ''
  o.Languages['Chinese'] = ''
  o.Languages['Czech'] = ''
  o.Languages['Danish'] = ''
  o.Languages['Dutch'] = ''
  o.Languages['English'] = ''
  o.Languages['Estonian'] = ''
  o.Languages['Finnish'] = ''
  o.Languages['French'] = ''
  o.Languages['Georgian'] = ''
  o.Languages['GermanNewSpelling'] = ''
  o.Languages['German'] = ''
  o.Languages['Greek'] = ''
  o.Languages['Hungarian'] = ''
  o.Languages['Icelandic'] = ''
  o.Languages['Indonesian'] = ''
  o.Languages['Italian'] = ''
  o.Languages['Kazakh'] = ''
  o.Languages['Kirgiz'] = ''
  o.Languages['Latin'] = ''
  o.Languages['Latvian'] = ''
  o.Languages['Lithuanian'] = ''
  o.Languages['Malay'] = ''
  o.Languages['NorwegianBokmal'] = ''
  o.Languages['NorwegianNynorsk'] = ''
  o.Languages['Polish'] = ''
  o.Languages['PortugueseStandard'] = ''
  o.Languages['Romanian'] = ''
  o.Languages['Russian'] = ''
  o.Languages['SerbianCyrillic'] = ''
  o.Languages['Slovak'] = ''
  o.Languages['Slovenian'] = ''
  o.Languages['SpanishModernSort'] = ''
  o.Languages['SpanishTraditionalSort'] = ''
  o.Languages['Swahili'] = ''
  o.Languages['Swedish'] = ''
  o.Languages['Tajik'] = ''
  o.Languages['Tatar'] = ''
  o.Languages['Turkish'] = ''
  o.Languages['Turkmen'] = ''
  o.Languages['Ukrainian'] = ''
  o.Languages['UzbekLatin'] = ''

  o.LanId = Object.create(null)

  o.LanId['1025'] = ''
  o.LanId['1026'] = ''
  o.LanId['1028'] = ''
  o.LanId['1029'] = ''
  o.LanId['1030'] = ''
  o.LanId['1031'] = ''
  o.LanId['1032'] = ''
  o.LanId['1033'] = ''
  o.LanId['1034'] = ''
  o.LanId['1035'] = ''
  o.LanId['1036'] = ''
  o.LanId['1038'] = ''
  o.LanId['1039'] = ''
  o.LanId['1040'] = ''
  o.LanId['1043'] = ''
  o.LanId['1044'] = ''
  o.LanId['1045'] = ''
  o.LanId['1048'] = ''
  o.LanId['1049'] = ''
  o.LanId['1051'] = ''
  o.LanId['1053'] = ''
  o.LanId['1055'] = ''
  o.LanId['1057'] = ''
  o.LanId['1058'] = ''
  o.LanId['1059'] = ''
  o.LanId['1060'] = ''
  o.LanId['1061'] = ''
  o.LanId['1062'] = ''
  o.LanId['1063'] = ''
  o.LanId['1064'] = ''
  o.LanId['1067'] = ''
  o.LanId['1068'] = ''
  o.LanId['1069'] = ''
  o.LanId['1078'] = ''
  o.LanId['1079'] = ''
  o.LanId['1086'] = ''
  o.LanId['1087'] = ''
  o.LanId['1089'] = ''
  o.LanId['1090'] = ''
  o.LanId['1091'] = ''
  o.LanId['1092'] = ''
  o.LanId['1133'] = ''
  o.LanId['1142'] = ''
  o.LanId['1595'] = ''
  o.LanId['2052'] = ''
  o.LanId['2068'] = ''
  o.LanId['2070'] = ''
  o.LanId['3082'] = ''
  o.LanId['3098'] = ''
  o.LanId['32775'] = ''
  o.LanId['32811'] = ''

  // Old ID
  o.LanId['1'] = ''
  o.LanId['2'] = ''
  o.LanId['3'] = ''
  o.LanId['4'] = ''
  o.LanId['5'] = ''
  o.LanId['6'] = ''
  o.LanId['7'] = ''
  o.LanId['8'] = ''
  o.LanId['9'] = ''
  o.LanId['10'] = ''
  o.LanId['11'] = ''
  o.LanId['12'] = ''
  o.LanId['13'] = ''
  o.LanId['14'] = ''
  o.LanId['15'] = ''
  o.LanId['16'] = ''
  o.LanId['17'] = ''
  o.LanId['18'] = ''
  o.LanId['19'] = ''
  o.LanId['20'] = ''
  o.LanId['21'] = ''
  o.LanId['22'] = ''
  o.LanId['23'] = ''
  o.LanId['24'] = ''
  o.LanId['25'] = ''
  o.LanId['26'] = ''
  o.LanId['27'] = ''
  o.LanId['28'] = ''
  o.LanId['29'] = ''
  o.LanId['30'] = ''

  o.Latin = Object.create(null)

  o.Latin['Afrikaans'] = ''
  o.Latin['Czech'] = ''
  o.Latin['Danish'] = ''
  o.Latin['Dutch'] = ''
  o.Latin['English'] = ''
  o.Latin['Estonian'] = ''
  o.Latin['Finnish'] = ''
  o.Latin['French'] = ''
  o.Latin['GermanNewSpelling'] = ''
  o.Latin['German'] = ''
  o.Latin['Hungarian'] = ''
  o.Latin['Icelandic'] = ''
  o.Latin['Italian'] = ''
  o.Latin['Latin'] = ''
  o.Latin['Latvian'] = ''
  o.Latin['Lithuanian'] = ''
  o.Latin['NorwegianBokmal'] = ''
  o.Latin['NorwegianNynorsk'] = ''
  o.Latin['Polish'] = ''
  o.Latin['PortugueseStandard'] = ''
  o.Latin['Romanian'] = ''
  o.Latin['Slovak'] = ''
  o.Latin['Slovenian'] = ''
  o.Latin['SpanishModernSort'] = ''
  o.Latin['SpanishTraditionalSort'] = ''
  o.Latin['Swedish'] = ''
  o.Latin['Turkish'] = ''

  o.isLatin = false
  o.isRussian = false

  o.Messages = Object.create(null)

  o.Messages['1'] = [
    'Предупреждение',
    'В заголовке присутствуют символы, не поддерживаемые в данном языке.',
    0
  ]
  o.Messages['2'] = [
    'Предупреждение',
    'Изображение для значка словаря имеет неправильные размеры.',
    0
  ]
  o.Messages['3'] = [
    'Предупреждение',
    'Правильные размеры изображения: 14 х 21 пикселов.',
    0
  ]
  o.Messages['4'] = [
    'Предупреждение',
    'Подвешенная ссылка "%s".',
    0,
    'Подвешенных ссылок'
  ]
  o.Messages['5'] = [
    'Предупреждение',
    'Символ "" в конце строки не имеет силы и игнорируется.',
    0
  ]

  o.Messages['6'] = ['Ошибка', 'Повторный открывающий тег.', 0]
  o.Messages['7'] = ['Ошибка', 'Отсутствует закрывающий тег.', 0]
  o.Messages['8'] = [
    'Ошибка',
    'Закрывающий тег при отсутствии открывающего.',
    0
  ]
  o.Messages['9'] = [
    'Ошибка',
    'Использование тегов внутри ссылки на карточку запрещено.',
    0,
    'Использование тегов внутри ссылки на карточку'
  ]
  o.Messages['10'] = [
    'Ошибка',
    'Использование тегов внутри зоны мультимедиа запрещено.',
    0,
    'Использование тегов внутри зоны мультимедиа'
  ]
  o.Messages['11'] = [
    'Ошибка',
    'Использование тегов внутри URL запрещено.',
    0,
    'Использование тегов внутри URL'
  ]
  o.Messages['12'] = ['Ошибка', 'Неизвестное имя тега.', 0]
  o.Messages['13'] = ['Ошибка', 'Отсутствует символ конца имени тега "]".', 0]
  o.Messages['14'] = ['Ошибка', 'Отсутствует символ начала имени тега "[".', 0]
  o.Messages['15'] = [
    'Ошибка',
    'Отсутствуют открывающие комментарий скобки.',
    0
  ]
  o.Messages['16'] = [
    'Ошибка',
    'Отсутствуют закрывающие комментарий скобки.',
    0
  ]
  o.Messages['17'] = [
    'Ошибка',
    'Тег "[!trs]" может находиться только внутри одной из зон индексации.',
    0
  ]
  o.Messages['18'] = [
    'Ошибка',
    'Язык "%s" не поддерживается.',
    0,
    'Неподдерживаемый язык'
  ]
  o.Messages['19'] = [
    'Ошибка',
    'Идентификатор языка "%s" не поддерживается.',
    0,
    'Неподдерживаемый идентификатор языка'
  ]
  o.Messages['20'] = [
    'Ошибка',
    'Неизвестное имя цвета: "%s".',
    0,
    'Неизвестное имя цвета'
  ]
  o.Messages['21'] = ['Ошибка', 'Отсутствуют параметры тега: "[lang]".', 0]
  o.Messages['22'] = ['Ошибка', 'Имя языка без кавычек.', 0]
  o.Messages['23'] = [
    'Ошибка',
    'Отсутствует символ закрытия альтернативной части заголовка ")".',
    0
  ]
  o.Messages['24'] = [
    'Ошибка',
    'Отсутствует символ открытия альтернативной части заголовка "(".',
    0
  ]
  o.Messages['25'] = [
    'Ошибка',
    'Отсутствует символ закрытия несортируемой части заголовка "}".',
    0
  ]
  o.Messages['26'] = [
    'Ошибка',
    'Отсутствует символ открытия несортируемой части заголовка "{".',
    0
  ]
  o.Messages['27'] = [
    'Ошибка',
    'В заголовке слишком много альтернативных частей, максимально - 6.',
    0
  ]
  o.Messages['28'] = [
    'Ошибка',
    'Заголовок "%s" уже обработан.',
    0,
    'Заголовок уже обработан'
  ]
  o.Messages['29'] = ['Ошибка', 'Не указан язык перевода.', 0]
  o.Messages['30'] = ['Ошибка', 'Не указан исходный язык.', 0]
  o.Messages['31'] = ['Ошибка', 'Не указано имя словаря.', 0]
  o.Messages['32'] = ['Ошибка', 'Пустая строка препроцессора.', 0]
  o.Messages['33'] = [
    'Ошибка',
    'Неизвестная директива препроцессора: "%s".',
    0,
    'Неизвестная директива препроцессора'
  ]
  o.Messages['34'] = [
    'Ошибка',
    'Параметр для директивы препроцессора "%s" должен быть заключен в кавычки.',
    0,
    'Параметр для директивы препроцессора без кавычек'
  ]
  o.Messages['35'] = ['Ошибка', 'Пустая статья.', 0]
  o.Messages['36'] = ['Ошибка', 'Пустой заголовок карточки.', 0]
  o.Messages['37'] = [
    'Ошибка',
    'Повторное использование директивы %s.',
    0,
    'Повторное использование директивы'
  ]
  o.Messages['38'] = [
    'Ошибка',
    'Неэкранированный символ # в начале строки за пределами блока директив.',
    0
  ]
  o.Messages['39'] = [
    'Ошибка',
    'Имя словаря "%s" содержит символы, не входящие в набор ASCII.',
    0,
    'Имя словаря содержит символы, не входящие в набор ASCII'
  ]
  o.Messages['40'] = [
    'Ошибка',
    'Значение параметра dict должно быть заключено в кавычки.',
    0
  ]
  o.Messages['41'] = [
    'Ошибка',
    'Значение параметра dict содержит недопустимый символ.',
    0
  ]
  o.Messages['42'] = ['Ошибка', 'Не задано значение параметра тега.', 0]
  o.Messages['43'] = [
    'Ошибка',
    'Директива препроцессора должна начинаться с новой строки.',
    0
  ]
  o.Messages['44'] = [
    'Ошибка',
    'Неправильное использование символа начала подкарточки "@".',
    0
  ]
  o.Messages['45'] = ['Ошибка', 'Подкарточка не окончена.', 0]
  o.Messages['46'] = [
    'Ошибка',
    'Использование тегов внутри зоны транскрипции запрещено.',
    0
  ]
  o.Messages['47'] = ['Ошибка', 'Пустая подкарточка.', 0]
  o.Messages['48'] = ['Ошибка', 'Пустой подзаголовок.', 0]
  o.Messages['49'] = [
    'Ошибка',
    'Использование подкарточки внутри ссылки на карточку запрещено.',
    0,
    'Использование тегов внутри ссылки на карточку'
  ]
  o.Messages['50'] = [
    'Ошибка',
    'Использование подкарточки внутри зоны мультимедиа запрещено.',
    0,
    'Использование тегов внутри зоны мультимедиа'
  ]
  o.Messages['51'] = [
    'Ошибка',
    'Использование подкарточки внутри URL запрещено.',
    0,
    'Использование тегов внутри URL'
  ]
  o.Messages['52'] = [
    'Ошибка',
    'Использование подкарточки внутри зоны транскрипции запрещено.',
    0
  ]
  o.Messages['53'] = ['Ошибка', 'Слишком длинное слово.', 0]
  o.Messages['54'] = ['Ошибка', 'Слишком длинный заголовок.', 0]
  o.Messages['55'] = [
    'Ошибка',
    'Тег "[sup]" не может находиться внутри зоны действия тега "[sub]".',
    0
  ]
  o.Messages['56'] = [
    'Ошибка',
    'Тег "[sub]" не может находиться внутри зоны действия тега "[sup]".',
    0
  ]
  o.Messages['57'] = [
    'Ошибка',
    'Заголовок целиком состоит из альтернативной части.',
    0
  ]
  o.Messages['58'] = [
    'Ошибка',
    'Использование символа начала имени тега "[" недопустимо внутри ссылки.',
    0
  ]
  o.Messages['59'] = ['Ошибка', 'Отсутствует тег открытия ссылки "<<".', 0]
  o.Messages['60'] = [
    'Предупреждение',
    'В заголовке присутствуют символы, не поддерживаемые в данном языке.',
    0
  ]

  o.CommentMap = Object.create(null)
  // Для обычных записей
  // [[номер строки, смещение], [номер строки, смещение]]
  // [0] - начало комментария, [1] - закрытие

  o.CommentMap.o = [false, []]
  // [0] - наличие незакрытого тега
  // [1] - массив который содержит номер строки [0] и [1] смещение относительно начала строки незакрытого тега {{

  o.CommentMap.count = 0

  // node script list -c in out

  if (process.argv.length === 5 && o.utils.fileExists(process.argv[3])) {
    process.stdout.write('\nMapping multiline comments...')
    makeCommentMap()
  } else if (
    process.argv.length === 6 &&
    process.argv[3] === '-t' &&
    o.utils.fileExists(process.argv[4])
  ) {
    o.trs = true

    process.stdout.write('\nMapping multiline comments...')
    makeCommentMap()
  } else if (
    process.argv.length === 6 &&
    process.argv[3] === '-c' &&
    o.utils.fileExists(process.argv[4])
  ) {
    o.cyr = true

    process.stdout.write('\nMapping multiline comments...')
    makeCommentMap()
  } else if (
    process.argv.length === 6 &&
    /^-[tc]{2}$/.test(process.argv[3]) &&
    o.utils.fileExists(process.argv[4])
  ) {
    o.trs = true
    o.cyr = true

    process.stdout.write('\nMapping multiline comments...')
    makeCommentMap()
  } else {
    console.log('Invalid command line.')
    process.exit()
  }
}

function updateProgressBar () {
  if (!o.fileSize || !o.byteCount) return

  const readPercent = Math.ceil(o.byteCount / o.fileSize * 100)

  if (readPercent > 100) readPercent = 100

  const barsNumber = Math.floor(readPercent / 2)
  const padsNumber = 50 - barsNumber

  readline.cursorTo(process.stdout, 0)
  readline.clearLine(process.stdout, 0)
  process.stdout.write(
    `${'█'.repeat(barsNumber)}${' '.repeat(padsNumber)} ${readPercent}%`
  )
}

function parseLine (line) {
  let m
  let re = /([^]*?)(\\*)(\{\{|\}\})/y
  let e
  let l

  while ((m = re.exec(line))) {
    if (m[2].length % 2 === 1) {
      continue
    }

    if (m[3] === '}}') {
      l = [false, re.lastIndex]
      if (!e) {
        e = [true, re.lastIndex]
      }
    } else {
      l = [true, re.lastIndex]
      if (!e) {
        e = [false, re.lastIndex]
      }
    }
  }

  let r = [[false, undefined, undefined], [false, undefined]]

  if (e) {
    r[0][0] = true
    r[0][1] = e[0]
    r[0][2] = e[1]
  }

  if (l && l[0]) {
    r[1][0] = l[0]
    r[1][1] = l[1]
  }

  // Описание ответа:
  // r[0][0] - информация о наличие закрытие тега {{
  // r[0][1] - если true, то тег закрылся нормально. Нет - значит через {{
  // r[0][2] - позиция закрывающего относительно начала строки

  // r[1][0] - закончилась ли строка открывающим тегом
  // r[1][1] - если да, то передаётся и позиция этого тега

  return r
}

function makeCommentMap () {
  let lineCount = 0

  o.in_encoding = o.utils.guessEncoding(o.inputfile)

  let encoding = o.in_encoding

  const reader = readline.createInterface({
    input: fs.createReadStream(o.inputfile, encoding),
    terminal: false,
    historySize: 0,
    output: null,
    crlfDelay: Infinity
  })

  reader
    .on('line', line => {
      lineCount++

      if (lineCount === 1) line = line.replace(/^\uFEFF/, '')

      let r = parseLine(line)

      if (o.CommentMap.o[0]) {
        if (r[0][0] && r[0][1]) {
          let b = o.CommentMap.o[1]
          // [0] - начало (строка/смещение), [1] - конец (строка/смещение)
          o.CommentMap[b[0]] = [b, [lineCount, r[0][2]]]
          o.CommentMap.count++
          o.CommentMap.o = [false, []]
        }
      }

      if (r[1][0]) {
        o.CommentMap.o = [r[1][0], [lineCount, r[1][1]]]
      }
    })
    .on('close', () => {
      readline.cursorTo(process.stdout, 0)
      readline.clearLine(process.stdout, 0)
      process.stdout.write('Mapping multiline comments... Done')

      delete o.CommentMap.o

      console.log('\n\nReading headwords:\n')

      readheadwords()
    })
}

function chk_headword (s) {
  let TSRefUrl

  let InsideIndexZone = []

  let InsideSubSupZone

  let get_Tag_and_Check = function (s) {
    let m
    let res = [false, '', [[12, '']]]

    if (
      /^\[((?:\/?(?:[\*'bcipumts]|com|ref|ex|url|trn1?|!trs|sub|sup|m))|(?:m\d+|\/lang|br))\]$/.test(
        s
      )
    ) {
      res[0] = true
      res[1] = s.replace(/ .*$/, '').replace(/[\[\]\/\d]/g, '')
      res[2] = []
    } else if (/^(?:<<|>>)$/.test(s)) {
      res[0] = true
      res[1] = 'ref'
      res[2] = []
    } else if ((m = /^\[lang id=(.+)\]$/.exec(s))) {
      if (o.LanId[m[1]] === undefined) {
        res[0] = true
        res[1] = 'lang'
        res[2] = [[19, m[1]]]
      } else {
        res[0] = true
        res[1] = 'lang'
        res[2] = []
      }
    } else if ((m = /^\[lang name=\"(.+)\"\]$/.exec(s))) {
      if (o.Languages[m[1]] === undefined) {
        res[0] = true
        res[1] = 'lang'
        res[2] = [[18, m[1]]]
      } else {
        res[0] = true
        res[1] = 'lang'
        res[2] = []
      }
    } else if (/^\[lang name=\"\"\]$/.test(s)) {
      res[0] = true
      res[1] = 'lang'
      res[2] = [[42, '']]
    } else if (/^\[lang name=[^\"].*[^\"]\]$/.test(s)) {
      res[0] = true
      res[1] = 'lang'
      res[2] = [[22, '']]
    } else if (/^\[ref dict=[^\"].*[^\"]\]$/.test(s)) {
      res[0] = true
      res[1] = 'ref'
      res[2] = [[40, '']]
    } else if ((m = /^\[ref dict=\"(.+)\"\]$/.exec(s))) {
      if (/^[^\x00-\x7F]+$/.test(m[1])) {
        res[0] = true
        res[1] = 'ref'
        res[2] = [[39, m[1]]]
      } else {
        if (/^\[ref dict=\".*\".*\"\]$/.test(s)) {
          res[0] = true
          res[1] = 'ref'
          res[2] = [[41, '']]
        } else {
          res[0] = true
          res[1] = 'ref'
          res[2] = []
        }
      }
    } else if (/^\[ref dict=\"\"\]$/.test(s)) {
      res[0] = true
      res[1] = 'ref'
      res[2] = [[42, '']]
    } else if ((m = /^\[c (.+)\]$/.exec(s))) {
      if (o.Colors[m[1]] === undefined) {
        res[0] = true
        res[1] = 'c'
        res[2] = [[20, m[1]]]
      } else {
        res[0] = true
        res[1] = 'c'
        res[2] = []
      }
    } else if (s === '[lang]') {
      res[0] = true
      res[1] = 'lang'
      res[2] = [[21, '']]
    }

    return res
  }

  let GeneralFunction = function (name, tag, k) {
    let res = [false, undefined]

    if (TSRefUrl) {
      if (TSRefUrl === 'ref') {
        res[0] = true
        res[1] = 9
      } else if (TSRefUrl === 's') {
        res[0] = true
        res[1] = 10
      } else if (TSRefUrl === 'url') {
        res[0] = true
        res[1] = 11
      } else if (TSRefUrl === 't') {
        res[0] = true
        res[1] = 46
      }

      TSRefUrl = undefined
    }

    if (name === '!trs' && o.trs && InsideIndexZone.length === 0) {
      res[0] = true
      res[1] = 17
    }

    if (/\//.test(tag)) {
      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 1) {
          if (name !== 'm') {
            res[0] = true
            res[1] = 8
          }
        }
      } else {
        if (name !== 'm') {
          res[0] = true
          res[1] = 8
        }
      }

      tags[name][0].push([k, 1])
    } else {
      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 0) {
          if (name !== 'm') {
            res[0] = true
            res[1] = 6
          }
        }
      }

      tags[name][0].push([k, 0])
    }

    return res
  }

  let IndexZoneFunction = function (name, tag, k) {
    let res = [false, undefined]

    if (TSRefUrl) {
      if (TSRefUrl === 'ref') {
        res[0] = true
        res[1] = 9
      } else if (TSRefUrl === 's') {
        res[0] = true
        res[1] = 10
      } else if (TSRefUrl === 'url') {
        res[0] = true
        res[1] = 11
      } else if (TSRefUrl === 't') {
        res[0] = true
        res[1] = 46
      }

      TSRefUrl = undefined
    }

    if (/\//.test(tag)) {
      InsideIndexZone.pop()

      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 1) {
          res[0] = true
          res[1] = 8
        }
      } else {
        res[0] = true
        res[1] = 8
      }

      tags[name][0].push([k, 1])
    } else {
      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 0) {
          res[0] = true
          res[1] = 6
        }
      }

      tags[name][0].push([k, 0])
      InsideIndexZone.push(name)
    }

    return res
  }

  let BrFunction = function (name, tag, k) {
    let res = [false, undefined]

    if (TSRefUrl) {
      if (TSRefUrl === 'ref') {
        res[0] = true
        res[1] = 9
      } else if (TSRefUrl === 's') {
        res[0] = true
        res[1] = 10
      } else if (TSRefUrl === 'url') {
        res[0] = true
        res[1] = 11
      } else if (TSRefUrl === 't') {
        res[0] = true
        res[1] = 46
      }

      TSRefUrl = undefined
    }

    return res
  }

  let SubSupZoneFunction = function (name, tag, k) {
    let res = [false, undefined]

    if (TSRefUrl) {
      if (TSRefUrl === 'ref') {
        res[0] = true
        res[1] = 9
      } else if (TSRefUrl === 's') {
        res[0] = true
        res[1] = 10
      } else if (TSRefUrl === 'url') {
        res[0] = true
        res[1] = 11
      } else if (TSRefUrl === 't') {
        res[0] = true
        res[1] = 46
      }

      TSRefUrl = undefined
    }

    if (/\//.test(tag)) {
      InsideSubSupZone = undefined

      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 1) {
          res[0] = true
          res[1] = 8
        }
      } else {
        res[0] = true
        res[1] = 8
      }

      tags[name][0].push([k, 1])
    } else {
      if (InsideSubSupZone === 'sup' && name === 'sub') {
        res[0] = true
        res[1] = 56
      } else if (InsideSubSupZone === 'sub' && name === 'sup') {
        res[0] = true
        res[1] = 55
      } else {
        if (tags[name][0].length > 0) {
          if (tags[name][0][tags[name][0].length - 1][1] === 0) {
            res[0] = true
            res[1] = 6
          }
        }
      }

      tags[name][0].push([k, 0])
      InsideSubSupZone = name
    }

    return res
  }

  let TSRefUrlFunction = function (name, tag, k) {
    let res = [false, undefined]

    if (/(\/|^>>$)/.test(tag)) {
      TSRefUrl = undefined

      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 1) {
          res[0] = true
          res[1] = 8
        } else {
        }
      } else {
        res[0] = true
        res[1] = 8
      }

      tags[name][0].push([k, 1])
    } else {
      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 0) {
          res[0] = true
          res[1] = 6
        }
      }

      tags[name][0].push([k, 0])
      TSRefUrl = name
    }

    return res
  }

  let tags = Object.create(null)

  tags['lang'] = [[], GeneralFunction]
  tags['!trs'] = [[], GeneralFunction]
  tags['sup'] = [[], SubSupZoneFunction]
  tags['sub'] = [[], SubSupZoneFunction]
  tags['com'] = [[], IndexZoneFunction]
  tags['trn'] = [[], IndexZoneFunction]
  tags['ex'] = [[], IndexZoneFunction]
  tags['b'] = [[], GeneralFunction]
  tags['i'] = [[], GeneralFunction]
  tags['u'] = [[], GeneralFunction]
  tags['p'] = [[], GeneralFunction]
  tags["'"] = [[], GeneralFunction]
  tags['*'] = [[], GeneralFunction]
  tags['c'] = [[], GeneralFunction]
  tags['m'] = [[], GeneralFunction]
  tags['t'] = [[], TSRefUrlFunction]
  tags['s'] = [[], TSRefUrlFunction]
  tags['ref'] = [[], TSRefUrlFunction]
  tags['url'] = [[], TSRefUrlFunction]
  tags['br'] = [[], BrFunction]

  let m
  let ind = 0
  let re = /([^]*?)(\\*)(\[|\]|<<|>>)/y
  let pos = 0

  while ((m = re.exec(s))) {
    ind = re.lastIndex

    if (m[2].length % 2 === 1) {
      continue
    }

    let tag

    if (m[3] === '[' || m[3] === ']') {
      if (m[3] === '[') {
        let rs = s.substr(ind)

        let re2 = /([^]*?)(\\*)(\]|\[)/y
        let m2 = re2.exec(rs)
        if (m2 && m2[2].length % 2 === 0 && m2[3] === ']') {
          re.lastIndex += re2.lastIndex
          ind = re.lastIndex
          tag = m[3] + m2[1] + m2[2] + m2[3]
        } else {
          return [true, 13]
        }
      } else {
        return [true, 14]
      }
    }

    if (m[3] === '<<' || m[3] === '>>') {
      tag = m[3]
    }

    let res = get_Tag_and_Check(tag)

    if (!res[0] || tags[res[1]] === undefined) {
      return [true, 12]
    }

    let name = res[1]

    let last = res[2].pop()

    if (last && last.length > 0) {
      return [true, last[0]]
    }

    let funcres = tags[name][1](name, tag, pos - 1)
    if (funcres[0]) {
      return funcres
    }
  }

  for (let k in tags) {
    if (tags[k][0].length > 0) {
      let info = tags[k][0][tags[k][0].length - 1]

      if (info[1] === 0) {
        if (k !== 'm') {
          return [true, 7]
        }
      }
    }
  }

  return [false, undefined]
}

function CheckDslArtBody (body0, art_num) {
  let err = o.SubEntriesErrors[art_num]

  if (err !== undefined) {
    let errcode = err[0]
    let line = err[1]

    if (err[2] === undefined) {
      body0[line] +=
        '{{=' + o.Messages[errcode][0] + ': ' + o.Messages[errcode][1] + '}}'
    } else {
      body0[line] += err[2]
    }

    o.Messages[errcode][2]++
    return body0.join('\n')
  } else {
    return chk_normal(body0.join('\n'), false)
  }
}

function process_escaped_at (s, b) {
  if (b) {
    s = s.replace(/\x00/g, ' ')
    s = s.replace(/(\\*)@/g, function (a, m1) {
      if (m1.length % 2 === 0) {
        m1 += '@'
      } else {
        m1 += '\x00'
      }

      return m1
    })
  } else {
    s = s.replace(/\x00/g, '@')
  }

  return s
}

function chk_subentry_body (s) {
  s = process_escaped_at(s, true)

  let m
  let txt = ''
  while ((m = /^([^]*?\n)([\t ]+?[^@]*)(\n[\t ]+?@[^]*|$)$/.exec(s))) {
    let h = m[1]
      .trim()
      .replace(/^@(.*)$/, '$1')
      .trim()
    h = process_escaped_at(h)
    let hs = o.utils.openroundbrackets(h)

    if (!hs[1][8]) {
      for (let v of hs[0]) {
        v = o.utils.remove_scb(v).replace(/[\t ]{2,}/g, ' ')

        if (v.trim().length > 0) {
          if (!chk_headword(v.trim())[0]) {
            o.HeadWords2[v.trim()] = ''
          }
        }
      }
    }

    s = m[3]
    txt += m[1]
    txt += chk_normal(m[2], true)
  }

  txt += s
  txt = process_escaped_at(txt)
  return txt
}

function check_long_word (s) {
  let m

  let re = /[^]*?(\S{256,})/y

  while ((m = re.exec(s))) {
    let w = m[1]
    w = w.replace(/\x5c(.)/g, '$1')

    if (w.length > 255) {
      s =
        s.substr(0, re.lastIndex) +
        '{{=' +
        o.Messages[53][0] +
        ': ' +
        o.Messages[53][1] +
        '}}' +
        s.substr(re.lastIndex)
      o.Messages[53][2]++
      break
    }
  }

  return s
}

function chk_normal (s, isThisSubEntry) {
  o.ArticleCountGlobal++

  let TSRefUrl

  let InsideIndexZone = []

  let InsideSubSupZone

  let Article = Object.create(null)

  let NotEmptyCard = false

  let get_Tag_and_Check = function (s) {
    let m
    let res = [false, '', [[12, '']]]

    if (
      /^\[((?:\/?(?:[\*'bcipumts]|com|ref|ex|url|trn1?|!trs|sub|sup|m))|(?:m\d+|\/lang|br))\]$/.test(
        s
      )
    ) {
      res[0] = true
      res[1] = s.replace(/ .*$/, '').replace(/[\[\]\/\d]/g, '')
      res[2] = []
    } else if (/^(?:<<|>>)$/.test(s)) {
      res[0] = true
      res[1] = 'ref'
      res[2] = []
    } else if ((m = /^\[lang id=(.+)\]$/.exec(s))) {
      if (o.LanId[m[1]] === undefined) {
        res[0] = true
        res[1] = 'lang'
        res[2] = [[19, m[1]]]
      } else {
        res[0] = true
        res[1] = 'lang'
        res[2] = []
      }
    } else if ((m = /^\[lang name=\"(.+)\"\]$/.exec(s))) {
      if (o.Languages[m[1]] === undefined) {
        res[0] = true
        res[1] = 'lang'
        res[2] = [[18, m[1]]]
      } else {
        res[0] = true
        res[1] = 'lang'
        res[2] = []
      }
    } else if (/^\[lang name=\"\"\]$/.test(s)) {
      res[0] = true
      res[1] = 'lang'
      res[2] = [[42, '']]
    } else if (/^\[lang name=[^\"].*[^\"]\]$/.test(s)) {
      res[0] = true
      res[1] = 'lang'
      res[2] = [[22, '']]
    } else if (/^\[ref dict=[^\"].*[^\"]\]$/.test(s)) {
      res[0] = true
      res[1] = 'ref'
      res[2] = [[40, '']]
    } else if ((m = /^\[ref dict=\"(.+)\"\]$/.exec(s))) {
      if (/^[^\x00-\x7F]+$/.test(m[1])) {
        res[0] = true
        res[1] = 'ref'
        res[2] = [[39, m[1]]]
      } else {
        if (/^\[ref dict=\".*\".*\"\]$/.test(s)) {
          res[0] = true
          res[1] = 'ref'
          res[2] = [[41, '']]
        } else {
          res[0] = true
          res[1] = 'ref'
          res[2] = []
        }
      }
    } else if (/^\[ref dict=\"\"\]$/.test(s)) {
      res[0] = true
      res[1] = 'ref'
      res[2] = [[42, '']]
    } else if ((m = /^\[c (.+)\]$/.exec(s))) {
      if (o.Colors[m[1]] === undefined) {
        res[0] = true
        res[1] = 'c'
        res[2] = [[20, m[1]]]
      } else {
        res[0] = true
        res[1] = 'c'
        res[2] = []
      }
    } else if (s === '[lang]') {
      res[0] = true
      res[1] = 'lang'
      res[2] = [[21, '']]
    }

    return res
  }

  let GeneralFunction = function (name, tag, k) {
    if (TSRefUrl) {
      if (TSRefUrl === 'ref') {
        Article[k][2].push([9, tag])
      } else if (TSRefUrl === 's') {
        Article[k][2].push([10, tag])
      } else if (TSRefUrl === 'url') {
        Article[k][2].push([11, tag])
      } else if (TSRefUrl === 't') {
        Article[k][2].push([46, tag])
      }

      TSRefUrl = undefined
    }

    if (name === '!trs' && o.trs && InsideIndexZone.length === 0) {
      Article[k][2].push([17, tag])
    }

    if (/\//.test(tag)) {
      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 1) {
          if (name !== 'm') Article[k][2].push([8, tag])
        }
      } else {
        if (name !== 'm') Article[k][2].push([8, tag])
      }

      tags[name][0].push([k, 1])
    } else {
      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 0) {
          if (name !== 'm') Article[k][2].push([6, tag])
        }
      }

      tags[name][0].push([k, 0])
    }
  }

  let SubEntryFunction = function (name, tag, k) {
    if (TSRefUrl) {
      if (TSRefUrl === 'ref') {
        Article[k][2].push([49, tag])
      } else if (TSRefUrl === 's') {
        Article[k][2].push([50, tag])
      } else if (TSRefUrl === 'url') {
        Article[k][2].push([51, tag])
      } else if (TSRefUrl === 't') {
        Article[k][2].push([52, tag])
      }

      TSRefUrl = undefined
    }
  }

  let BrFunction = function (name, tag, k) {
    if (TSRefUrl) {
      if (TSRefUrl === 'ref') {
        Article[k][2].push([9, tag])
      } else if (TSRefUrl === 's') {
        Article[k][2].push([10, tag])
      } else if (TSRefUrl === 'url') {
        Article[k][2].push([11, tag])
      } else if (TSRefUrl === 't') {
        Article[k][2].push([46, tag])
      }

      TSRefUrl = undefined
    }
  }

  let IndexZoneFunction = function (name, tag, k) {
    if (TSRefUrl) {
      if (TSRefUrl === 'ref') {
        Article[k][2].push([9, tag])
      } else if (TSRefUrl === 's') {
        Article[k][2].push([10, tag])
      } else if (TSRefUrl === 'url') {
        Article[k][2].push([11, tag])
      } else if (TSRefUrl === 't') {
        Article[k][2].push([46, tag])
      }

      TSRefUrl = undefined
    }

    if (/\//.test(tag)) {
      InsideIndexZone.pop()

      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 1) {
          Article[k][2].push([8, tag])
        }
      } else {
        Article[k][2].push([8, tag])
      }

      tags[name][0].push([k, 1])
    } else {
      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 0) {
          Article[k][2].push([6, tag])
        }
      }

      tags[name][0].push([k, 0])
      InsideIndexZone.push(name)
    }
  }

  let SubSupZoneFunction = function (name, tag, k) {
    if (TSRefUrl) {
      if (TSRefUrl === 'ref') {
        Article[k][2].push([9, tag])
      } else if (TSRefUrl === 's') {
        Article[k][2].push([10, tag])
      } else if (TSRefUrl === 'url') {
        Article[k][2].push([11, tag])
      } else if (TSRefUrl === 't') {
        Article[k][2].push([46, tag])
      }

      TSRefUrl = undefined
    }

    if (/\//.test(tag)) {
      InsideSubSupZone = undefined

      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 1) {
          Article[k][2].push([8, tag])
        }
      } else {
        Article[k][2].push([8, tag])
      }

      tags[name][0].push([k, 1])
    } else {
      if (InsideSubSupZone === 'sup' && name === 'sub') {
        Article[k][2].push([56, tag])
      } else if (InsideSubSupZone === 'sub' && name === 'sup') {
        Article[k][2].push([55, tag])
      } else {
        if (tags[name][0].length > 0) {
          if (tags[name][0][tags[name][0].length - 1][1] === 0) {
            Article[k][2].push([6, tag])
          }
        }
      }

      tags[name][0].push([k, 0])
      InsideSubSupZone = name
    }
  }

  let TSRefUrlFunction = function (name, tag, k) {
    if (/(\/|^>>$)/.test(tag)) {
      TSRefUrl = undefined

      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 1) {
          Article[k][2].push([8, tag])
        } else {
          if (
            tag === '>>' &&
            tags[name][0][tags[name][0].length - 1][2] !== '<<'
          ) {
            Article[k][2].push([59, tag])
          } else if (
            tag === '[/ref]' &&
            tags[name][0][tags[name][0].length - 1][2] === '<<'
          ) {
            Article[k][2].push([58, tag])
          } else if (
            name === 'ref' &&
            k > 1 &&
            Article[k - 1][0] === 0 &&
            Article[k - 2][0] === 1 &&
            (Article[k - 2][1] === '[ref]' || Article[k - 2][1] === '<<') &&
            Article[k - 1][1].trim().length > 0
          ) {
            let lnk = o.utils
              .remove_comments(Article[k - 1][1])
              .replace(/[\t ]{2,}/g, ' ')
              .trim()

            lnk = o.utils.remove_odd_slash(lnk, true)

            if (lnk.length === 0 || o.HeadWords1[lnk] === undefined) {
              Article[k][2].push([4, Article[k - 1][1].trim()])
            }
          }
        }
      } else {
        Article[k][2].push([8, tag])
      }

      tags[name][0].push([k, 1, tag])
    } else {
      if (tags[name][0].length > 0) {
        if (tags[name][0][tags[name][0].length - 1][1] === 0) {
          Article[k][2].push([6, tag])
        }
      }

      tags[name][0].push([k, 0, tag])
      TSRefUrl = name
    }
  }

  let tags = Object.create(null)

  tags['lang'] = [[], GeneralFunction]
  tags['!trs'] = [[], GeneralFunction]
  tags['sup'] = [[], SubSupZoneFunction]
  tags['sub'] = [[], SubSupZoneFunction]
  tags['com'] = [[], IndexZoneFunction]
  tags['trn'] = [[], IndexZoneFunction]
  tags['ex'] = [[], IndexZoneFunction]
  tags['b'] = [[], GeneralFunction]
  tags['i'] = [[], GeneralFunction]
  tags['u'] = [[], GeneralFunction]
  tags['p'] = [[], GeneralFunction]
  tags["'"] = [[], GeneralFunction]
  tags['*'] = [[], GeneralFunction]
  tags['c'] = [[], GeneralFunction]
  tags['m'] = [[], GeneralFunction]
  tags['t'] = [[], TSRefUrlFunction]
  tags['s'] = [[], TSRefUrlFunction]
  tags['ref'] = [[], TSRefUrlFunction]
  tags['url'] = [[], TSRefUrlFunction]
  tags['subentry'] = [[], SubEntryFunction]
  tags['br'] = [[], BrFunction]

  let m
  let ind = 0
  let re = /([^]*?)(\\*)(\[|\]|\{\{|\}\}|<<|>>|#|@)/y
  let pos = 0

  while ((m = re.exec(s))) {
    ind = re.lastIndex
    let txt = m[1] + m[2]

    if (m[2].length % 2 === 1 && m[3] !== '}}') {
      NotEmptyCard = true
      txt += m[3]

      if (txt !== '') {
        txt = check_long_word(txt)

        if (
          Article[pos - 1] &&
          Article[pos - 1][0] === 0 &&
          Article[pos - 1][2].length === 0
        ) {
          Article[pos - 1][1] += txt
        } else {
          Article[pos++] = [0, txt, []]
        }
      }

      continue
    }

    if (m[3] === '#') {
      NotEmptyCard = true

      if (
        Article[pos - 1] &&
        Article[pos - 1][0] === 0 &&
        Article[pos - 1][2].length === 0
      ) {
        if (txt.length > 0 && txt[txt.length - 1] !== '\n') {
          txt += m[3]
          Article[pos - 1][1] += txt
          Article[pos - 1][2].push([43, ''])
        } else {
          txt += m[3]
          txt = check_long_word(txt)
          Article[pos - 1][1] += txt
        }
      } else {
        if (txt.length > 0 && txt[txt.length - 1] !== '\n') {
          txt += m[3]
          Article[pos++] = [0, txt, [[43, '']]]
        } else {
          txt += m[3]
          txt = check_long_word(txt)
          Article[pos++] = [0, txt, []]
        }
      }

      continue
    }

    if (m[3] === '@') {
      NotEmptyCard = true

      let rs = s.substr(ind)
      let re2 = /^([^]*?\n[\t ]+?)(@[\t ]*)(\n|$)/y
      let m2 = re2.exec(rs)
      if (m2) {
        re.lastIndex += re2.lastIndex
        ind = re.lastIndex
        txt += m[3] + chk_subentry_body(m2[1]) + m2[2] + m2[3]

        Article[pos++] = [2, txt, []]
        tags['subentry'][1](undefined, '[subentry]', pos - 1)

        continue
      } else {
        txt += m[3]

        if (txt !== '') {
          txt = check_long_word(txt)

          if (
            Article[pos - 1] &&
            Article[pos - 1][0] === 0 &&
            Article[pos - 1][2].length === 0
          ) {
            Article[pos - 1][1] += txt
          } else {
            Article[pos++] = [0, txt, []]
          }
        }
      }

      continue
    }

    let tag

    if (m[3] === '{{' || m[3] === '}}') {
      if (m[3] === '{{') {
        let rs = s.substr(ind)

        let re2 = /([^]*?)(\\*)(\}\}|\{\{)/y
        let m2 = re2.exec(rs)
        if (m2 && m2[3] === '}}') {
          if (!NotEmptyCard && /\S/.test(txt)) NotEmptyCard = true

          txt += m[3]
          re.lastIndex += re2.lastIndex
          ind = re.lastIndex
          txt += m2[1] + m2[2] + m2[3]

          if (txt !== '') {
            if (
              Article[pos - 1] &&
              Article[pos - 1][0] === 0 &&
              Article[pos - 1][2].length === 0
            ) {
              Article[pos - 1][1] += txt
            } else {
              Article[pos++] = [0, txt, []]
            }
          }

          continue
        } else {
          txt += m[3]
          Article[pos++] = [0, txt, [[16, '']]]
          NotEmptyCard = true
          continue
        }
      } else {
        txt += m[3]
        Article[pos++] = [0, txt, [[15, '']]]
        NotEmptyCard = true
        continue
      }
    }

    if (m[3] === '[' || m[3] === ']') {
      if (m[3] === '[') {
        let rs = s.substr(ind)

        let re2 = /([^]*?)(\\*)(\]|\[)/y
        let m2 = re2.exec(rs)
        if (m2 && m2[2].length % 2 === 0 && m2[3] === ']') {
          re.lastIndex += re2.lastIndex
          ind = re.lastIndex
          tag = m[3] + m2[1] + m2[2] + m2[3]
        } else {
          txt += m[3]
          Article[pos++] = [0, txt, [[13, '']]]
          NotEmptyCard = true
          continue
        }
      } else {
        txt += m[3]
        Article[pos++] = [0, txt, [[14, '']]]
        NotEmptyCard = true
        continue
      }
    }

    if (m[3] === '<<' || m[3] === '>>') {
      tag = m[3]
    }

    let res = get_Tag_and_Check(tag)

    if (!res[0] || tags[res[1]] === undefined) {
      txt += tag
      Article[pos++] = [0, txt, res[2]]
      NotEmptyCard = true
      continue
    }

    if (txt !== '') {
      txt = check_long_word(txt)

      if (!NotEmptyCard && /\S/.test(txt)) NotEmptyCard = true

      if (
        Article[pos - 1] &&
        Article[pos - 1][0] === 0 &&
        Article[pos - 1][2].length === 0
      ) {
        Article[pos - 1][1] += txt
      } else {
        Article[pos++] = [0, txt, []]
      }
    }

    let name = res[1]

    Article[pos++] = [1, tag, res[2]]

    tags[name][1](name, tag, pos - 1)
  }

  let stxt = s.substr(ind)

  if (stxt !== '') {
    stxt = check_long_word(stxt)

    if (!NotEmptyCard && /\S/.test(stxt)) NotEmptyCard = true

    if (
      Article[pos - 1] &&
      Article[pos - 1][0] === 0 &&
      Article[pos - 1][2].length === 0
    ) {
      Article[pos - 1][1] += stxt
    } else {
      Article[pos++] = [0, stxt, []]
    }
  }

  for (let k in tags) {
    if (tags[k][0].length > 0) {
      let info = tags[k][0][tags[k][0].length - 1]

      if (info[1] === 0) {
        if (k !== 'm') Article[info[0]][2].push([7, ''])
      }
    }
  }

  let keys = Object.keys(Article)

  s = ''

  for (let k of keys) {
    let el = Article[k]

    s += el[1]

    for (let e of el[2]) {
      s +=
        '{{=' +
        o.Messages[e[0]][0] +
        ': ' +
        o.Messages[e[0]][1].replace(/%s/, e[1]) +
        '}}'
      o.Messages[e[0]][2]++
    }
  }

  if (!NotEmptyCard) {
    let i = 35
    if (isThisSubEntry) i = 47
    s += '{{=' + o.Messages[i][0] + ': ' + o.Messages[i][1] + '}}'
    o.Messages[i][2]++
  }

  return s
}

function ProcessDSLArticle (art0, art1, art_num) {
  let res = ''
  let err = []

  let hw0 = []
  let body0 = []

  // [0] - счётчик заголовков, [1] - счётчик непустых строк в теле статьи, [2] - начало первой непустой строки в теле статьи.
  // [3] - счётчик ошибки №38
  let info = [0, 0, 0, 0]

  for (let i = 0; i < art1.length; i++) {
    if (/^#/.test(art1[i])) {
      info[3]++
      art0[i] += '{{=' + o.Messages[38][0] + ': ' + o.Messages[38][1] + '}}'
      o.Messages[38][2]++
    } else if (/^[^\t\x20]/.test(art1[i])) {
      info[0]++
    } else if (/^[\t\x20]+[^\t\x20\n]/.test(art1[i])) {
      // нужен только номер первой строки из тела статьи
      if (info[1] === 0) info[2] = i

      info[1]++
    }
  }

  if (info[3] === 0) {
    // Заголовков нет
    if (info[0] === 0) {
      art0[0] =
        '{{=' + o.Messages[36][0] + ': ' + o.Messages[36][1] + '}}\n' + art0[0]
      o.Messages[36][2]++
    }

    // Тела нет
    if (info[1] === 0) {
      art0[1] += '{{=' + o.Messages[35][0] + ': ' + o.Messages[35][1] + '}}'
      o.Messages[35][2]++
    }
  }

  if (info[3] === 0 && info[0] > 0 && info[1] > 0) {
    hw0 = art0.slice(0, info[2])
    body0 = art0.slice(info[2])
  }

  if (hw0.length > 0 && body0.length > 0) {
    for (let i = 0; i < art1.length; i++) {
      if (/^[^\t\x20].*$/.test(art1[i])) {
        if (/^@/.test(art1[i])) {
          hw0[i] =
            hw0[i] + '{{=' + o.Messages[44][0] + ': ' + o.Messages[44][1] + '}}'
          o.Messages[44][2]++
        } else {
          let h = art1[i]

          let tagchkres = chk_headword(h)

          if (h.length > 246) {
            hw0[i] =
              hw0[i] +
              '{{=' +
              o.Messages[54][0] +
              ': ' +
              o.Messages[54][1] +
              '}}'
            o.Messages[54][2]++
          } else if (tagchkres[0]) {
            hw0[i] =
              hw0[i] +
              '{{=' +
              o.Messages[tagchkres[1]][0] +
              ': ' +
              o.Messages[tagchkres[1]][1] +
              '}}'
            o.Messages[tagchkres[1]][2]++
          } else {
            let hs = o.utils.openroundbrackets(h)

            if (!hs[1][8]) {
              for (let v of hs[0]) {
                let h = o.utils.remove_scb(v).trim()

                if (h === '') {
                  err.push(
                    '{{=' +
                      o.Messages[57][0] +
                      ': ' +
                      o.Messages[57][1].replace(/%s/, h) +
                      '}}'
                  )
                  o.Messages[57][2]++
                } else {
                  if (o.HeadWords2[h] !== undefined) {
                    err.push(
                      '{{=' +
                        o.Messages[28][0] +
                        ': ' +
                        o.Messages[28][1].replace(/%s/, h) +
                        '}}'
                    )
                    o.Messages[28][2]++
                  }

                  // Предупреждение ###60###
                  // В заголовке присутствуют символы, не поддерживаемые в данном языке.

                  if (
                    o.isLatin &&
                    !/^[\u0000-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F]+$/u.test(
                      h
                    )
                  ) {
                    err.push(
                      '{{=' +
                        o.Messages[60][0] +
                        ': ' +
                        o.Messages[60][1] +
                        '}}'
                    )
                    o.Messages[60][2]++
                  } else if (
                    o.isRussian &&
                    o.cyr &&
                    !/^[а-яёα-ωίϊΐόάέύϋΰήώ\u0020-\u0040\u005B-\u0060\u007B-\u007E\u00A2-\u00BE\u00D7\u00F7]+$/iu.test(
                      h
                    )
                  ) {
                    err.push(
                      '{{=' +
                        o.Messages[60][0] +
                        ': ' +
                        o.Messages[60][1] +
                        '}}'
                    )
                    o.Messages[60][2]++
                  }

                  o.HeadWords2[h] = ''
                }
              }
            } else {
              if (hs[1][0] === 1) {
                err.push(
                  '{{=' + o.Messages[23][0] + ': ' + o.Messages[23][1] + '}}'
                )
                o.Messages[23][2]++
              }

              if (hs[1][1] === 1) {
                err.push(
                  '{{=' + o.Messages[24][0] + ': ' + o.Messages[24][1] + '}}'
                )
                o.Messages[24][2]++
              }

              if (hs[1][2] === 1) {
                err.push(
                  '{{=' + o.Messages[25][0] + ': ' + o.Messages[25][1] + '}}'
                )
                o.Messages[25][2]++
              }

              if (hs[1][3] === 1) {
                err.push(
                  '{{=' + o.Messages[26][0] + ': ' + o.Messages[26][1] + '}}'
                )
                o.Messages[26][2]++
              }

              if (hs[1][4] === 1) {
                err.push(
                  '{{=' + o.Messages[27][0] + ': ' + o.Messages[27][1] + '}}'
                )
                o.Messages[27][2]++
              }

              if (hs[1][5] === 1) {
                err.push(
                  '{{=' + o.Messages[44][0] + ': ' + o.Messages[44][1] + '}}'
                )
                o.Messages[44][2]++
              }

              if (hs[1][6] === 1) {
                err.push(
                  '{{=' + o.Messages[43][0] + ': ' + o.Messages[43][1] + '}}'
                )
                o.Messages[43][2]++
              }

              if (hs[1][7] === 1) {
                err.push(
                  '{{=' + o.Messages[57][0] + ': ' + o.Messages[57][1] + '}}'
                )
                o.Messages[57][2]++
              }
            }
          }
        }
      }
    }

    if (err.length > 0) err[0] = '\n' + err[0]

    res =
      hw0.join('\n') + err.join('\n') + '\n' + CheckDslArtBody(body0, art_num)
  } else {
    res = art0.join('\n')
  }

  return res
}

function by_dls_article () {
  let DirBlock = Object.create(null)

  let encoding = o.in_encoding

  let lineCount = 0

  o.byteCount = 0

  let articleCount = 0

  o.fileSize = fs.statSync(o.inputfile)['size']

  const reader = readline.createInterface({
    input: fs.createReadStream(o.inputfile, encoding),
    terminal: false,
    historySize: 0,
    output: null,
    crlfDelay: Infinity
  })

  const output = fs.openSync(o.outputfile, 'w')

  let flag = 0

  let m

  let art0 = []
  let art1 = []

  fs.writeSync(output, '\uFEFF', null, encoding)

  const updater = setInterval(updateProgressBar, 100)

  fs.writeFileSync(o.error_log_path, '', { encoding: 'utf8', flag: 'w' })

  // [0] - имеется ли открытый комментарий, [1] - где закрытие (строка/смещение), [2] - строка куда временно скрадываются строки многостраничного комментария
  let openComment = [false, [], '']

  reader
    .on('line', line => {
      lineCount++

      let lines = []

      o.byteCount += o.getByteLength(line, encoding) + 1

      if (lineCount === 1) line = line.replace(/^\uFEFF/, '')

      if (o.CommentMap.count > 0) {
        if (openComment[0]) {
          if (openComment[1][0] === lineCount) {
            if (o.CommentMap[lineCount] !== undefined) {
              openComment = [
                true,
                o.CommentMap[lineCount][1],
                (openComment[2] += '\n' + line)
              ]
              line = undefined
            } else {
              lines.push(openComment[2] + '\n' + line)
              line = undefined
              openComment = [false, [], '']
            }
          } else {
            openComment[2] += '\n' + line
            line = undefined
          }
        }

        if (!openComment[0]) {
          if (o.CommentMap[lineCount] !== undefined) {
            openComment = [true, o.CommentMap[lineCount][1], '']
            if (line !== undefined) openComment[2] += line
          } else {
            if (line !== undefined) lines.push(line)
          }
        }
      } else {
        lines.push(line)
      }

      while (lines.length) {
        let s = []

        s[0] = lines.shift()
        s[1] = o.utils.remove_comments(s[0])

        if (/^#/.test(s[1]) && flag === 0) {
          fs.writeSync(output, `${s[0]}\n`, null, encoding)

          if (
            (m = /^#(NAME|INDEX_LANGUAGE|CONTENTS_LANGUAGE|ICON_FILE|INCLUDE|SOURCE_CODE_PAGE)[ \t]+([^\s])(.*)([^\s])$/.exec(
              s[1]
            ))
          ) {
            if (m[2] !== '"' && m[4] !== '"') {
              let msg = o.Messages[34][1].replace(/%s/, m[1])
              o.Messages[34][2]++
              fs.writeSync(
                output,
                `{{=${o.Messages[34][0]}: ${msg}}}\n`,
                null,
                encoding
              )
            } else if (DirBlock[m[1]] !== undefined) {
              let msg = o.Messages[37][1].replace(/%s/, m[1])
              o.Messages[37][2]++
              fs.writeSync(
                output,
                `{{=${o.Messages[37][0]}: ${msg}}}\n`,
                null,
                encoding
              )
            } else if (
              (m[1] === 'INDEX_LANGUAGE' || m[1] === 'CONTENTS_LANGUAGE') &&
              o.Languages[m[3]] === undefined
            ) {
              let msg = o.Messages[18][1].replace(/%s/, m[3])
              o.Messages[18][2]++
              fs.writeSync(
                output,
                `{{=${o.Messages[18][0]}: ${msg}}}\n`,
                null,
                encoding
              )
            } else if (
              (m[1] === 'INDEX_LANGUAGE' || m[1] === 'CONTENTS_LANGUAGE') &&
              o.Languages[m[3]] !== undefined
            ) {
              DirBlock[m[1]] = m[3]

              if (m[1] === 'INDEX_LANGUAGE') {
                if (o.Latin[m[3]] !== undefined) {
                  o.isLatin = true
                } else if (m[3] === 'Russian') {
                  o.isRussian = true
                }
              }
            } else if (m[1] === 'NAME' && m[3].trim().length > 0) {
              DirBlock[m[1]] = m[3].trim()
            }
          } else if (/^#\s*$/.test(s[1])) {
            fs.writeSync(
              output,
              `{{=${o.Messages[32][0]}: ${o.Messages[32][1]}}}\n`,
              null,
              encoding
            )
            o.Messages[32][2]++
          } else if (
            (m = /^#((?!NAME|INDEX_LANGUAGE|CONTENTS_LANGUAGE|ICON_FILE|INCLUDE|SOURCE_CODE_PAGE).*)$/.exec(
              s[1]
            ))
          ) {
            let dir = m[1].replace(/^([^\s]+)\s.*$/, '$1')
            let msg = o.Messages[33][1].replace(/%s/, dir)
            o.Messages[33][2]++
            fs.writeSync(
              output,
              `{{=${o.Messages[33][0]}: ${msg}}}\n`,
              null,
              encoding
            )
          }
        } else if (/^\s*$/.test(s[1]) && flag === 0) {
          fs.writeSync(output, `${s[0]}\n`, null, encoding)
        } else if (s[1] === '' && flag !== 0) {
          art0.push(s[0])
          art1.push(s[1])
          if (flag === 2) flag++
        } else if (
          (/^[^\t ].*$/.test(s[1]) && flag !== 1) ||
          (/^[\t ].*[^\t ].*$/.test(s[1]) && (art1.length === 0 || flag === 3))
        ) {
          if (art0.length > 0) {
            if (articleCount === 0) {
              if (DirBlock['NAME'] === undefined) {
                fs.writeSync(
                  output,
                  `{{=${o.Messages[31][0]}: ${o.Messages[31][1]}}}\n`,
                  null,
                  encoding
                )
                o.Messages[31][2]++
              }

              if (DirBlock['INDEX_LANGUAGE'] === undefined) {
                fs.writeSync(
                  output,
                  `{{=${o.Messages[30][0]}: ${o.Messages[30][1]}}}\n`,
                  null,
                  encoding
                )
                o.Messages[30][2]++
              }

              if (DirBlock['CONTENTS_LANGUAGE'] === undefined) {
                fs.writeSync(
                  output,
                  `{{=${o.Messages[29][0]}: ${o.Messages[29][1]}}}\n`,
                  null,
                  encoding
                )
                o.Messages[29][2]++
              }
            }

            articleCount++

            const res = ProcessDSLArticle(art0, art1, articleCount)

            if (res !== null) {
              fs.writeSync(output, `${res}\n`, null, encoding)
            }
          }

          art0.length = 0
          art1.length = 0

          art0.push(s[0])
          art1.push(s[1])

          if (/^[^\t ].*$/.test(s[1])) {
            flag = 1
          } else {
            flag = 2
          }
        } else {
          art0.push(s[0])
          art1.push(s[1])

          if (/^[^\t ].*$/.test(s[1])) {
            flag = 1
          } else {
            flag = 2
          }
        }
      }
    })
    .on('close', () => {
      if (art0.length > 0) {
        if (articleCount === 0) {
          if (DirBlock['NAME'] === undefined) {
            fs.writeSync(
              output,
              `{{=${o.Messages[31][0]}: ${o.Messages[31][1]}}}\n`,
              null,
              encoding
            )
            o.Messages[31][2]++
          }

          if (DirBlock['INDEX_LANGUAGE'] === undefined) {
            fs.writeSync(
              output,
              `{{=${o.Messages[30][0]}: ${o.Messages[30][1]}}}\n`,
              null,
              encoding
            )
            o.Messages[30][2]++
          }

          if (DirBlock['CONTENTS_LANGUAGE'] === undefined) {
            fs.writeSync(
              output,
              `{{=${o.Messages[29][0]}: ${o.Messages[29][1]}}}\n`,
              null,
              encoding
            )
            o.Messages[29][2]++
          }
        }

        articleCount++
        const res = ProcessDSLArticle(art0, art1, articleCount)

        if (res !== null) {
          fs.writeSync(output, `${res}\n`, null, encoding)
        }

        art0.length = 0
        art1.length = 0
      }

      clearInterval(updater)

      o.byteCount = o.fileSize

      updateProgressBar()

      process.stdout.write('\n\nLogging...')

      let keys = Object.keys(o.Messages)
      let errors = 0
      let warnings = 0

      for (let k in o.Messages) {
        if (o.Messages[k][2] > 0) {
          if (o.Messages[k][0] === 'Ошибка') errors += o.Messages[k][2]

          if (o.Messages[k][0] === 'Предупреждение') { warnings += o.Messages[k][2] }
        }
      }

      if (errors > 0) {
        fs.writeFileSync(
          o.error_log_path,
          '\n' + ' {{Ошибки: ' + errors + '}}' + '\n\n',
          { encoding: 'utf8', flag: 'a' }
        )

        for (let k in o.Messages) {
          if (o.Messages[k][2] > 0) {
            if (o.Messages[k][0] === 'Ошибка') {
              let ind = 1
              if (o.Messages[k].length === 4) ind = 3
              fs.writeFileSync(
                o.error_log_path,
                ' ' +
                  o.Messages[k][ind].replace(/\.$/, '').replace(/%s/, 'x') +
                  ': ' +
                  o.Messages[k][2] +
                  '\n',
                { encoding: 'utf8', flag: 'a' }
              )
            }
          }
        }
      }

      if (warnings > 0) {
        fs.writeFileSync(
          o.error_log_path,
          '\n' + ' {{Предупреждения: ' + warnings + '}}' + '\n\n',
          { encoding: 'utf8', flag: 'a' }
        )

        for (let k in o.Messages) {
          if (o.Messages[k][2] > 0) {
            if (o.Messages[k][0] === 'Предупреждение') {
              let ind = 1
              if (o.Messages[k].length === 4) ind = 3
              fs.writeFileSync(
                o.error_log_path,
                ' ' +
                  o.Messages[k][ind].replace(/\.$/, '').replace(/%s/, 'x') +
                  ': ' +
                  o.Messages[k][2] +
                  '\n',
                { encoding: 'utf8', flag: 'a' }
              )
            }
          }
        }
      }

      if (errors === 0) {
        fs.writeFileSync(
          o.error_log_path,
          '\n {{Number of headwords: ' +
            Object.keys(o.HeadWords1).length +
            '. Number of entries: ' +
            o.ArticleCountGlobal +
            '.}}\n',
          { encoding: 'utf8', flag: 'a' }
        )
      }

      readline.cursorTo(process.stdout, 0)
      readline.clearLine(process.stdout, 0)
      process.stdout.write('\nLogging... Done')

      let total = errors + warnings

      if (total > 0) {
        console.log(
          '\n\nNumber of Errors/Warnings: ' + total + ' (Check error.log)'
        )
      } else {
        console.log('\n\nNumber of Errors/Warnings: ' + total)
      }

      o.et_show()
    })
}

function NotEscapeDogCount (s) {
  let m
  let res = [0, 0]
  let re = /[^]*?(\\*)@/y
  let ind = 0
  while ((m = re.exec(s))) {
    if (m[1].length % 2 === 0) {
      res[0]++
      ind = re.lastIndex
    }
  }

  res[1] = ind

  return res
}

function ExtractHeadwords (art) {
  let hw = []
  let body = []

  // [0] - счётчик заголовков, [1] - счётчик непустых строк в теле статьи, [2] - начало первой непустой строки в теле статьи.
  // [3] - счётчик ошибки №38
  // [4] - счётчик @ в теле
  let info = [0, 0, 0, 0, 0]

  for (let i = 0; i < art.length; i++) {
    if (/^#/.test(art[i])) {
      info[3]++
    } else if (/^[^\t\x20]/.test(art[i])) {
      info[0]++
    } else if (/^[\t\x20]+[^\t\x20\n]/.test(art[i])) {
      // нужен только номер первой строки из тела статьи
      if (info[1] === 0) info[2] = i

      info[1]++

      if (/@/.test(art[i])) info[4]++
    }
  }

  if (info[3] === 0 && info[0] > 0 && info[1] > 0) {
    hw = art.slice(0, info[2])
    body = art.slice(info[2])
  }

  if (hw.length > 0 && body.length > 0) {
    for (let i = 0; i < hw.length; i++) {
      if (/^[^\t\x20].*$/.test(hw[i])) {
        if (!/^@/.test(hw[i])) {
          let h = hw[i]
          let hs = o.utils.openroundbrackets(h)

          if (!hs[1][8]) {
            for (let v of hs[0]) {
              v = o.utils
                .remove_scb(v)
                .replace(/[\t ]{2,}/g, ' ')
                .trim()

              if (v.length > 0) {
                if (!chk_headword(v)[0]) {
                  v = o.utils.remove_odd_slash(v, true).trim()

                  if (v.length > 0) {
                    o.HeadWords1[v] = ''
                  }
                }
              }
            }
          }
        }
      }
    }

    if (info[4] > 0) {
      let subs = []
      // [0] - это подкарточка или разделитель; подкарточка - true, разделитель - false
      // [1] - массив с заголовками
      // [2] - счётчик непустых строк в теле подкарточки
      // [3] - закрыта ли подкарточка

      for (let i = 0; i < body.length; i++) {
        let dogs = NotEscapeDogCount(body[i])

        if (dogs[0] === 1) {
          if (o.utils.remove_comments(body[i].substr(dogs[1])).trim() === '') {
            if (
              subs.length > 0 &&
              subs[subs.length - 1][0] &&
              subs[subs.length - 1][3] === 0 &&
              subs[subs.length - 1][2] === 0
            ) {
              // незакрытая подкарточка с пустым телом, выходим
              return [true, 47, i - 1]
            } else if (
              subs.length > 0 &&
              subs[subs.length - 1][0] &&
              subs[subs.length - 1][3] === 0 &&
              subs[subs.length - 1][2] > 0
            ) {
              // незакрытая подкарточка с не пустым телом, закрываем и вставляем разделитель - конец блока подкарточек
              subs[subs.length - 1][3] = 1
              subs.push([false])
            } else if (
              subs.length === 0 ||
              (subs.length > 0 && !subs[subs.length - 1][0])
            ) {
              // пустой подзаголовок, выходим
              return [true, 48, i]
            } else {
              // остальные случаи, выходим
              return [true, 44, i]
            }
          } else {
            let h = body[i].substr(dogs[1])

            if (h.length > 246) {
              return [true, 54, i]
            }

            if (o.utils.remove_scb(h).trim() === '') {
              return [true, 57, i]
            }

            let tagchkres = chk_headword(h)
            if (tagchkres[0]) {
              return [true, tagchkres[1], i]
            }

            let arr = o.utils.openroundbrackets(h)

            if (arr[1][8]) {
              // [0] - ( без )
              // [1] - ) без (
              // [2] - { без }
              // [3] - } без {
              // [4] - ошибка: альтернативных частей больше 6
              // [5] - неэкранированный @
              // [6] - неэкранированный #
              // [7] - Заголовок целиком состоит из альтернативной части
              // [8] - имеются ли ошибки (true/false)

              let ret = [true, undefined, i]

              if (arr[1][0] === 1) {
                ret[1] = 23
              } else if (arr[1][1] === 1) {
                ret[1] = 24
              } else if (arr[1][2] === 1) {
                ret[1] = 25
              } else if (arr[1][3] === 1) {
                ret[1] = 26
              } else if (arr[1][4] === 1) {
                ret[1] = 27
              } else if (arr[1][5] === 1) {
                ret[1] = 44
              } else if (arr[1][6] === 1) {
                ret[1] = 43
              } else if (arr[1][7] === 1) {
                ret[1] = 57
              }

              return ret
            } else {
              let hw2 = []

              for (let v of arr[0]) {
                v = o.utils.remove_scb(v).replace(/[\t ]{2,}/g, ' ')
                if (v.trim().length > 0) hw2.push(v.trim())
              }

              if (hw2.length === 0) {
                return [true, 48, i]
              } else {
                // [0] - это подкарточка или разделитель; подкарточка - true, разделитель - false
                // [1] - массив с заголовками
                // [2] - массив со строками тела подкарточки
                // [3] - закрыта ли подкарточка

                if (
                  subs.length > 0 &&
                  subs[subs.length - 1][0] &&
                  subs[subs.length - 1][1].length > 0 &&
                  subs[subs.length - 1][2] === 0 &&
                  subs[subs.length - 1][3] === 0
                ) {
                  subs[subs.length - 1][1].push(...hw2)
                } else {
                  if (
                    subs.length > 0 &&
                    subs[subs.length - 1][0] &&
                    subs[subs.length - 1][3] === 0
                  ) { subs[subs.length - 1][3] = 1 }

                  subs.push([true, hw2, 0, 0, i])
                }
              }
            }
          }
        } else if (dogs[0] === 0) {
          if (
            subs.length > 0 &&
            subs[subs.length - 1][0] &&
            subs[subs.length - 1][3] === 0 &&
            body[i].trim().length > 0
          ) {
            subs[subs.length - 1][2]++
          }
        } else {
          return [true, 44, i]
        }
      }

      let hw3 = []

      for (let v of subs) {
        if (v[0] && v[1].length > 0 && v[2] > 0 && v[3] === 1) {
          for (let b of v[1]) hw3.push([b, v[4]])
        } else {
          if (v[0]) {
            if (v[3] === 1 && v[1].length === 0) {
              return [true, 48, v[4]]
            } else if (v[3] === 1 && v[2].length === 0) {
              return [true, 47, v[4]]
            } else if (v[1].length > 0 && v[3] === 0) {
              return [true, 45, v[4]]
            }
          }
        }
      }

      for (let v of hw3) {
        let b = v[0]

        v[0] = o.utils.remove_odd_slash(v[0], true).trim()

        if (v[0].length > 0) {
          if (o.HeadWords1[v[0]] === undefined) {
            o.HeadWords1[v[0]] = ''
          } else {
            return [
              true,
              28,
              v[1],
              '{{=Ошибка: Заголовок "' + b.trim() + '" уже обработан.}}'
            ]
          }
        }
      }
    }
  }

  return [false, undefined, undefined]
}

function readheadwords () {
  let encoding = o.in_encoding

  let lineCount = 0

  o.byteCount = 0

  let articleCount = 0

  o.fileSize = fs.statSync(o.inputfile)['size']

  const reader = readline.createInterface({
    input: fs.createReadStream(o.inputfile, encoding),
    terminal: false,
    historySize: 0,
    output: null,
    crlfDelay: Infinity
  })

  let flag = 0

  let m

  let art = []

  const updater = setInterval(updateProgressBar, 100)

  // [0] - имеется ли открытый комментарий, [1] - где закрытие (строка/смещение), [2] - строка куда временно скрадываются строки многостраничного комментария
  let openComment = [false, [], '']

  reader
    .on('line', line => {
      lineCount++

      let lines = []

      o.byteCount += o.getByteLength(line, encoding) + 1

      if (lineCount === 1) line = line.replace(/^\uFEFF/, '')

      if (o.CommentMap.count > 0) {
        if (openComment[0]) {
          if (openComment[1][0] === lineCount) {
            if (o.CommentMap[lineCount] !== undefined) {
              openComment = [
                true,
                o.CommentMap[lineCount][1],
                (openComment[2] += '\n' + line)
              ]
              line = undefined
            } else {
              lines.push(openComment[2] + '\n' + line)
              line = undefined
              openComment = [false, [], '']
            }
          } else {
            // openComment[2] += "\n" + line;
            line = undefined
          }
        }

        if (!openComment[0]) {
          if (o.CommentMap[lineCount] !== undefined) {
            openComment = [true, o.CommentMap[lineCount][1], '']
            if (line !== undefined) openComment[2] += line
          } else {
            if (line !== undefined) lines.push(line)
          }
        }
      } else {
        lines.push(line)
      }

      while (lines.length) {
        let s = lines.shift()
        let s_with_comm = s
        s = o.utils.remove_comments(s)

        if (/^#/.test(s) && flag === 0) {
        } else if (/^\s*$/.test(s) && flag === 0) {
        } else if (s === '' && flag !== 0) {
          art.push(s)
          if (flag === 2) flag++
        } else if (
          (/^[^\t ].*$/.test(s) && flag !== 1) ||
          (/^[\t ].*[^\t ].*$/.test(s) && (art.length === 0 || flag === 3))
        ) {
          if (art.length > 0) {
            articleCount++
            let res = ExtractHeadwords(art)
            if (res[0]) {
              o.SubEntriesErrors[articleCount] = [res[1], res[2], res[3]]
            }
          }

          art.length = 0

          art.push(s)

          if (/^[^\t ].*$/.test(s)) {
            flag = 1
          } else {
            flag = 2
          }
        } else {
          art.push(s)

          if (/^[^\t ].*$/.test(s)) {
            flag = 1
          } else {
            flag = 2
          }
        }
      }
    })
    .on('close', () => {
      if (art.length > 0) {
        articleCount++
        let res = ExtractHeadwords(art)
        if (res[0]) {
          o.SubEntriesErrors[articleCount] = [res[1], res[2], res[3]]
        }

        art.length = 0
      }

      clearInterval(updater)

      o.byteCount = o.fileSize

      updateProgressBar()

      console.log('\n\nProcessing file:\n')

      by_dls_article()
    })
}

/*

НЕДОКУМЕНТИРОВАННЫЕ ФИЧИ

Использование ключа -c

Предупреждение "В заголовке присутствуют символы, не поддерживаемые в данном языке" также генерируется если:

а)Директива #INDEX_LANGUAGE имеет значение Russian.

б)В командной строке присутствует ключ -c
Возможные варианты командной строки:
node nodereplacer.js -chkdsl -c input.txt output.txt
node nodereplacer.js -chkdsl -ct input.txt output.txt
node nodereplacer.js -chkdsl -tc input.txt output.txt

в)И при этом проверка заголовков с помощью регулярного выражения
/^[а-яёα-ωίϊΐόάέύϋΰήώ\u0020-\u0040\u005B-\u0060\u007B-\u007E\u00A2-\u00BE\u00D7\u00F7]+$/iu
даёт false

Для составления этого регулярного выражения использовались все русские буквы, все греческие
и часть символов из "Basic Latin" и "Latin-1 Supplement".

Ссылки:
https://ru.wikipedia.org/wiki/Кириллица_в_Юникоде
https://en.wikipedia.org/wiki/C0_Controls_and_Basic_Latin
https://en.wikipedia.org/wiki/C1_Controls_and_Latin-1_Supplement

*/
