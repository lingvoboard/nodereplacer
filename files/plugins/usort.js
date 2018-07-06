// Пользовательская сортировка.

function onstart () {
  if (process.argv.length === 5 && o.utils.fileExists(process.argv[3])) {
    // node nodereplacer.js -usort input.txt output.txt
    o.inputfile = process.argv[3]
    o.outputfile = process.argv[4]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    o.by_dsl_article()
  } else if (
    process.argv.length === 6 &&
    process.argv[3] === '-i' &&
    o.utils.fileExists(process.argv[4])
  ) {
    // node nodereplacer.js -usort -i input.txt output.txt

    o.inputfile = process.argv[4]
    o.outputfile = process.argv[5]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    o.by_dsl_article()
  } else {
    console.log('Invalid command line.')
    process.exit()
  }
}

if (o.sortRulesTab === undefined) {
  o.sortRulesTab = Object.create(null)
  o.bigArr = []
}

function read_sort_rules () {
  if (o.utils.fileExists('sortRules.txt')) {
    let encoding = o.utils.guessEncoding('sortRules.txt')

    let arr = fs
      .readFileSync('sortRules.txt', encoding)
      .toString()
      .split('\n')
    let sortRulesStr = arr.join('').replace(/\s/g, '')
    let sortRulesArr = [...sortRulesStr]

    for (let i = 0; i < sortRulesArr.length; i++) {
      if (o.sortRulesTab[sortRulesArr[i]] === undefined) {
        o.sortRulesTab[sortRulesArr[i]] = i
      }
    }
  }
}

function customSORT (art1, art2) {
  let word1 = art1[0]
  let word2 = art2[0]

  if (process.argv.length === 6 && process.argv[3] === '-i') {
    word1 = word1.toLowerCase()
    word2 = word2.toLowerCase()
  }

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
    // Если и длина одинаковая, то учитывается положение статей в словаре.
    if (word1.length === word2.length) {
      return index1 < index2 ? -1 : 1
    } else {
      return word1.length < word2.length ? -1 : 1
    }
  } else {
    return int1 < int2 ? -1 : 1
  }
}

function sort_and_write () {
  o.bigArr.sort(customSORT)

  for (let v of o.bigArr) {
    fs.writeFileSync(o.outputfile, v[3] + '\n' + v[1] + '\n', {
      encoding: o.out_encoding,
      flag: 'a'
    })
  }
}

let hw = []

for (let v of o.dsl[0]) {
  let h1 = o.utils
    .remove_comments(v)
    .replace(/[\t ]{2, }/g, ' ')
    .trim()
  if (h1 === '') {
    if (hw.length > 0) hw[hw.length - 1][1] += '\n' + v
  } else {
    let h2 = o.utils
      .remove_scb(h1)
      .replace(/[\t ]{2, }/g, ' ')
      .trim()

    if (h2 === '') h2 = h1

    hw.push([h2, v])
  }
}

for (let v of hw) {
  o.bigArr.push([v[0], o.dsl[1], o.bigArr.length, v[1]])
}

s = null

function onexit () {
  read_sort_rules()
  sort_and_write()
}
