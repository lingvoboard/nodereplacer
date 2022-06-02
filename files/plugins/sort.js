//Расширенная сортировка статей в DSL файле.
//И сортировка обычного списка.

// node nodereplacer.js -sort -(b|o|txt) input.txt output.txt
// node nodereplacer.js -sort -(b|o|txt) list.txt input.txt output.txt

function onstart () {
  o.sortRulesTab = Object.create(null)
  o.sortRulesLength = 0
  o.bigArr = []

  if (
    process.argv.length === 6 &&
    /^-(o|b|txt)$/.test(process.argv[3]) &&
    o.utils.fileExists(process.argv[4])
  ) {
    o.inputfile = process.argv[4]
    o.outputfile = process.argv[5]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    read_sort_rules()

    if (process.argv[3] === '-txt') {
      o.byline()
    } else {
      o.by_dsl_article()
    }
  } else if (
    process.argv.length === 7 &&
    /^-(o|b|txt)$/.test(process.argv[3]) &&
    o.utils.fileExists(process.argv[4]) &&
    o.utils.fileExists(process.argv[5])
  ) {
    o.inputfile = process.argv[5]
    o.outputfile = process.argv[6]

    buildfunction(process.argv[4], 'sort_list.js')

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    read_sort_rules()

    if (process.argv[3] === '-txt') {
      o.byline()
    } else {
      o.by_dsl_article()
    }
  } else {
    console.log('Invalid command line.')
    process.exit()
  }
}

function escapeRegExp (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

function escapeDQ (str) {
  return str.replace(/"/g, '\\"')
}

function escapeSlash (str) {
  str = str.replace(/^\//g, '\\/')

  while (/[^\\]\//.test(str)) {
    str = str.replace(/([^\\])\//g, '$1\\/')
  }

  return str
}

function read_sort_rules () {
  let f = o.path + '/files/sortRules.txt'
  if (o.utils.fileExists(f)) {
    let encoding = o.utils.guessEncoding(f)
    let arr = fs
      .readFileSync(f, encoding)
      .toString()
      .replace(/^\uFEFF/, '')
      .split('\n')
    let sortRulesStr = arr.join('').replace(/\s/g, '')
    let sortRulesArr = [...sortRulesStr]
    for (let i = 0; i < sortRulesArr.length; i++) {
      if (o.sortRulesTab[sortRulesArr[i]] === undefined) {
        o.sortRulesTab[sortRulesArr[i]] = i
        o.sortRulesLength++
      }
    }

    console.log(
      `\nsortRules.txt contains ${o.sortRulesLength} acceptable symbol(s)\n`
    )
  } else {
    console.log('\nsortRules.txt not found\n')
  }
}

function escape_odd_slash (s) {
  s = s.replace(/(\\*)/g, function (a, m1) {
    if (m1.length % 2 === 1) m1 = m1 + '\x5c'
    return m1
  })

  return s
}

function buildfunction (list, mod) {
  if (o.utils.fileExists(list)) {
    let encoding = o.utils.guessEncoding(list)

    let arr = fs
      .readFileSync(list, encoding)
      .replace(/^\uFEFF/, '')
      .toString()
      .split('\n')

    if (arr.length > 0) {
      let m
      let code = `'use strict'\nmodule.exports = {\nProcessString: function(s) {\n`
      for (let i = 0; i < arr.length; i++) {
        if (/^\/\//.test(arr[i]) === true) {
          code += arr[i] + '\n'
        } else if ((m = /^(.+?)\t\|\t(.*)$/.exec(arr[i]))) {
          code += 's = s.replace('
          code +=
            '/' +
            escapeRegExp(m[1]) +
            '/g, ' +
            'String.raw`' +
            escape_odd_slash(m[2]) +
            '`'
          code += ');\n'
        } else if ((m = /^(.+?)\t\|(i?)\|\t(.*)$/.exec(arr[i]))) {
          code += 's = s.replace('
          code +=
            '/' +
            escapeSlash(m[1]) +
            '/umg' +
            m[2] +
            ', ' +
            '"' +
            escapeDQ(m[3]) +
            '"'
          code += ');\n'
        } else {
          code += arr[i] + '\n'
        }
      }

      code += `\nreturn s\n}\n}\n`

      let Output

      let dir = __dirname + '/' + mod
      Output = fs.openSync(dir, 'w')
      fs.writeSync(Output, code, null, 'utf8')
      o.RepListMod = require(dir)
    }
  }
}

function DSLcustomSORT (art1, art2) {
  let word1 = art1[0]
  let word2 = art2[0]

  if (o.RepListMod) {
    let word1_bak = word1
    let word2_bak = word2
    word1 = o.RepListMod.ProcessString(word1)
    word2 = o.RepListMod.ProcessString(word2)

    if (word1.length === 0) word1 = word1_bak
    if (word2.length === 0) word2 = word2_bak
  }

  let body1 = art1[1]
  let body2 = art2[1]

  let index1 = art1[2]
  let index2 = art2[2]

  let arr1 = [...word1]
  let arr2 = [...word2]

  // Массивы для создания бинарных чисел.
  let bin1 = []
  let bin2 = []

  // Массивы с символами выравниваются по длине.
  // После обрезки, к примеру, ["d", "o", "g", "s"] и ["d", "o", "g"] превратятся в ["d", "o", "g"] и ["d", "o", "g"]
  // Если содержание массивов окажется идентичным, то будет учитываться длина слов.
  if (arr1.length > arr2.length) arr1.splice(arr2.length)

  if (arr2.length > arr2.length) arr2.splice(arr1.length)

  function compare_symb (a, b) {
    // Если положение символов относительно друг друга задано в правилах (sortRulesStr)
    if (o.sortRulesTab[a] !== undefined && o.sortRulesTab[b] !== undefined) {
      a = o.sortRulesTab[a]
      b = o.sortRulesTab[b]

      if (a > b) {
        bin1.push(1)
        bin2.push(0)
      } else if (b > a) {
        bin1.push(0)
        bin2.push(1)
      } else {
        bin1.push(0)
        bin2.push(0)
      }
      //Далее обрабатываются символы положение которых относительно друг друга не задано в правилах (sortRulesStr)
    } else {
      if (a.codePointAt(0) > b.codePointAt(0)) {
        bin1.push(1)
        bin2.push(0)
      } else if (b.codePointAt(0) > a.codePointAt(0)) {
        bin1.push(0)
        bin2.push(1)
      } else {
        bin1.push(0)
        bin2.push(0)
      }
    }
  }

  // Здесь происходит последовательное сравнение элементов из двух массивов имеющих одинаковый индекс.
  // И на основе этого сравнения создаются два бинарных числа.
  // К примеру, по умолчанию pig и dog дадут 100 и 010
  for (let i = 0; i < arr1.length; i++) {
    compare_symb(arr1[i], arr2[i])
  }

  // Бинарные числа конвертируются в десятичные.
  let int1 = parseInt(bin1.join(''), 2)
  let int2 = parseInt(bin2.join(''), 2)

  // Если числа одинаковые, то сравнивается длина слов.
  if (int1 === int2) {
    // Если и длина одинаковая
    if (word1.length === word2.length) {
      //И использован ключ -o, то в блоке статей имеющих одинаковый заголовок сохраненяется оригинальный порядок .
      if (process.argv[3] === '-o') {
        return index1 < index2 ? -1 : 1
      } else {
        //Если -b, то статьи сортируются  по заголовкам с учетом содержимого тела карточки.

        return body1 < body2 ? -1 : 1
      }
    } else {
      return word1.length < word2.length ? -1 : 1
    }
  } else {
    return int1 < int2 ? -1 : 1
  }
}

function TXTcustomSORT (line1, line2) {
  if (o.RepListMod) {
    let line1_bak = line1
    let line2_bak = line2
    line1 = o.RepListMod.ProcessString(line1)
    line2 = o.RepListMod.ProcessString(line2)

    if (line1.length === 0) line1 = line1_bak
    if (line2.length === 0) line2 = line2_bak
  }

  let arr1 = [...line1]
  let arr2 = [...line2]

  // Массивы для создания бинарных чисел.
  let bin1 = []
  let bin2 = []

  // Массивы с символами выравниваются по длине.
  // После обрезки, к примеру, ["d", "o", "g", "s"] и ["d", "o", "g"] превратятся в ["d", "o", "g"] и ["d", "o", "g"]
  // Если содержание массивов окажется идентичным, то будет учитываться длина слов.
  if (arr1.length > arr2.length) arr1.splice(arr2.length)

  if (arr2.length > arr2.length) arr2.splice(arr1.length)

  function compare_symb (a, b) {
    // Если положение символов относительно друг друга задано в правилах (sortRulesStr)
    if (o.sortRulesTab[a] !== undefined && o.sortRulesTab[b] !== undefined) {
      a = o.sortRulesTab[a]
      b = o.sortRulesTab[b]

      if (a > b) {
        bin1.push(1)
        bin2.push(0)
      } else if (b > a) {
        bin1.push(0)
        bin2.push(1)
      } else {
        bin1.push(0)
        bin2.push(0)
      }
      //Далее обрабатываются символы положение которых относительно друг друга не задано в правилах (sortRulesStr)
    } else {
      if (a.codePointAt(0) > b.codePointAt(0)) {
        bin1.push(1)
        bin2.push(0)
      } else if (b.codePointAt(0) > a.codePointAt(0)) {
        bin1.push(0)
        bin2.push(1)
      } else {
        bin1.push(0)
        bin2.push(0)
      }
    }
  }

  // Здесь происходит последовательное сравнение элементов из двух массивов имеющих одинаковый индекс.
  // И на основе этого сравнения создаются два бинарных числа.
  // К примеру, по умолчанию pig и dog дадут 100 и 010
  for (let i = 0; i < arr1.length; i++) {
    compare_symb(arr1[i], arr2[i])
  }

  // Бинарные числа конвертируются в десятичные.
  let int1 = parseInt(bin1.join(''), 2)
  let int2 = parseInt(bin2.join(''), 2)

  return int1 - int2
}

function sort_and_write () {
  if (process.argv[3] === '-txt') {
    o.bigArr.sort(TXTcustomSORT)

    for (let v of o.bigArr) {
      fs.writeFileSync(o.outputfile, v + '\n', {
        encoding: o.out_encoding,
        flag: 'a'
      })
    }
  } else {
    o.bigArr.sort(DSLcustomSORT)

    for (let v of o.bigArr) {
      fs.writeFileSync(o.outputfile, v[3] + '\n' + v[1] + '\n', {
        encoding: o.out_encoding,
        flag: 'a'
      })
    }
  }
}

function removeDiacriticsLite (str) {
  return str.replace(/[^A-Za-z0-9\[\] ]/g, function (a) {
    return o.latin_map[a] || a
  })
}

function clearhw (str) {
  let bak = str
  str = o.utils.remove_odd_slash(str)
  str = o.utils.remove_scb(str)
  if (str.length === 0) str = bak
  return str.trim()
}

if (process.argv[3] === '-txt') {
  //TEXT

  o.bigArr.push(s)
} else {
  //DSL
  let hw = []

  for (let v of o.dsl[0]) {
    let h1 = o.utils
      .remove_comments(v)
      .replace(/[\t ]{2, }/g, ' ')
      .trim()

    if (h1 === '') {
      //Обработка многострочного комментария

      if (hw.length > 0) hw[hw.length - 1][1] += '\n' + v
    } else {
      h1 = clearhw(h1)
      //h1 - содержит очищенный заголовок, v - оригинальный заголовок
      hw.push([h1, v])
    }
  }

  for (let v of hw) {
    o.bigArr.push([v[0], o.dsl[1], o.bigArr.length, v[1]])
  }
}

s = null

function onexit () {
  sort_and_write()
}
