// Объединение в словаре статей с одинаковыми заголовками с предварительным удалением дубликатов статей.

function onstart () {
  o.by_dsl_article()
}

function clear_hw (s) {
  let bak = s

  s = o.utils.remove_scb(s)

  s = s.replace(/[\t ]{2,}/g, ' ').trim()

  if (s.length === 0) {
    s = bak
  }

  return s
}

if (o.BigArr === undefined) {
  if (/^-(a|a1|a2|l|l1|l2|r|r1|r2)$/i.test(process.argv[3]) === false) {
    o.stop = 'Invalid command line.'
  }

  console.log('\nReading file:\n')

  o.BigArr = []
  o.DubArr = []
  o.hash = Object.create(null)
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
    hw.push([h1, v])
  }
}

for (let v of hw) {
  let ts = v[0]

  if (/^-(a1|l1|r1)$/i.test(process.argv[3])) {
    ts = clear_hw(ts)
    let ck = o.hash[ts]
    if (ck !== undefined) {
      if (v[0].length < ck.length) {
        o.hash[ts] = v[0]
      }
    } else {
      o.hash[ts] = v[0]
    }
  }

  if (/^-(a2|l2|r2)$/i.test(process.argv[3])) {
    ts = clear_hw(ts)
    let ck = o.hash[ts]
    if (ck !== undefined) {
      if (v[0].length > ck.length) {
        o.hash[ts] = v[0]
      }
    } else {
      o.hash[ts] = v[0]
    }
  }

  o.BigArr.push([
    o.BigArr.length,
    ts,
    o.dsl[1].replace(/\n+$/, ''),
    v[0],
    v[1],
    [o.dsl[3]],
    0
  ])
}

s = null

function romanize (num) {
  if (!+num) return false
  let digits = String(+num).split(''),
    key = [
      '',
      'C',
      'CC',
      'CCC',
      'CD',
      'D',
      'DC',
      'DCC',
      'DCCC',
      'CM',
      '',
      'X',
      'XX',
      'XXX',
      'XL',
      'L',
      'LX',
      'LXX',
      'LXXX',
      'XC',
      '',
      'I',
      'II',
      'III',
      'IV',
      'V',
      'VI',
      'VII',
      'VIII',
      'IX'
    ],
    roman = '',
    i = 3
  while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman
  return Array(+digits.join('') + 1).join('M') + roman
}

function sortFunction1 (a, b) {
  if (a[1] === b[1]) {
    if (a[2] === b[2]) {
      return a[0] < b[0] ? -1 : 1
    } else {
      return a[2] < b[2] ? -1 : 1
    }
  } else {
    return a[1] < b[1] ? -1 : 1
  }
}

function sortFunction2 (a, b) {
  return a[0] < b[0] ? -1 : 1
}

function sortFunction3 (a, b) {
  if (a[1] === b[1]) {
    return a[0] < b[0] ? -1 : 1
  } else {
    return a[1] < b[1] ? -1 : 1
  }
}

function mark_dubs () {
  o.BigArr.sort(sortFunction1)

  for (let i = 0; i < o.BigArr.length - 1; i++) {
    if (
      o.BigArr[i][1] === o.BigArr[i + 1][1] &&
      o.BigArr[i][2] === o.BigArr[i + 1][2]
    ) {
      o.BigArr[i + 1][6] = 1
    }
  }
}

function separate_dubs_and_merge () {
  let tmparr = []

  o.BigArr.sort(sortFunction3)

  while (o.BigArr.length) {
    const element = o.BigArr.shift()

    if (element[6] === 1) {
      o.DubArr.push(element)
      continue
    }

    if (tmparr.length === 0) {
      tmparr.push(element)
    } else {
      if (element[1] === tmparr[tmparr.length - 1][1]) {
        tmparr[tmparr.length - 1][5].push(element[5][0])
      } else {
        tmparr.push(element)
      }
    }
  }

  o.BigArr = tmparr.slice(0)
  tmparr.length = 0
}

function write (cmd) {
  o.BigArr.sort(sortFunction2)

  const output = fs.openSync(o.outputfile, 'a')

  for (let i = 0; i < o.BigArr.length; i++) {
    if (
      /^-(a1|a2|l1|l2|r1|r2)$/i.test(process.argv[3]) &&
      o.hash[o.BigArr[i][1]] !== undefined
    ) {
      fs.writeSync(output, o.hash[o.BigArr[i][1]] + '\n', null, o.out_encoding)
    } else {
      fs.writeSync(output, o.BigArr[i][4] + '\n', null, o.out_encoding)
    }

    for (let j = 0; j < o.BigArr[i][5].length; j++) {
      if (o.BigArr[i][5].length > 1 && /^-(a|a1|a2)$/i.test(cmd)) {
        const n = j + 1

        for (let l = 0; l < o.BigArr[i][5][j].length; l++) {
          if (o.utils.remove_comments(o.BigArr[i][5][j][l]).length === 0) {
            o.BigArr[i][5][j][l] = '\t' + o.BigArr[i][5][j][l]
          }
        }

        fs.writeSync(
          output,
          '\t' +
            '{{Arabic}}' +
            n +
            '{{/Arabic}}' +
            '\n' +
            o.BigArr[i][5][j].join('\n') +
            '\n',
          null,
          o.out_encoding
        )
      } else if (o.BigArr[i][5].length > 1 && /^-(l|l1|l2)$/i.test(cmd)) {
        for (let l = 0; l < o.BigArr[i][5][j].length; l++) {
          if (o.utils.remove_comments(o.BigArr[i][5][j][l]).length === 0) {
            o.BigArr[i][5][j][l] = '\t' + o.BigArr[i][5][j][l]
          }
        }

        if (j === 0) {
          fs.writeSync(
            output,
            o.BigArr[i][5][j].join('\n') + '\n',
            null,
            o.out_encoding
          )
        } else {
          fs.writeSync(
            output,
            '\t' + '————————' + '\n' + o.BigArr[i][5][j].join('\n') + '\n',
            null,
            o.out_encoding
          )
        }
      } else if (o.BigArr[i][5].length > 1 && /^-(r|r1|r2)$/i.test(cmd)) {
        const n = j + 1

        for (let l = 0; l < o.BigArr[i][5][j].length; l++) {
          if (o.utils.remove_comments(o.BigArr[i][5][j][l]).length === 0) {
            o.BigArr[i][5][j][l] = '\t' + o.BigArr[i][5][j][l]
          }
        }

        fs.writeSync(
          output,
          '\t' +
            '{{Roman}}' +
            romanize(n) +
            '{{/Roman}}' +
            '\n' +
            o.BigArr[i][5][j].join('\n') +
            '\n',
          null,
          o.out_encoding
        )
      } else {
        fs.writeSync(
          output,
          o.BigArr[i][5][j].join('\n') + '\n',
          null,
          o.out_encoding
        )
      }
    }
  }

  fs.closeSync(output)

  {
    const output = fs.openSync('dub.txt', 'w')

    for (let i = 0; i < o.DubArr.length; i++) {
      fs.writeSync(
        output,
        o.DubArr[i][4] + '\n' + o.DubArr[i][2] + '\n',
        null,
        o.out_encoding
      )
    }

    fs.closeSync(output)
  }

  o.BigArr.length = 0
  o.DubArr.length = 0

  return true
}

function onexit () {
  process.stdout.write('\n\nProcessing...')

  mark_dubs()

  separate_dubs_and_merge()

  readline.cursorTo(process.stdout, 0)
  readline.clearLine(process.stdout, 0)

  process.stdout.write('Processing... Done')

  process.stdout.write('\n\nWriting...')

  write(process.argv[3])

  readline.cursorTo(process.stdout, 0)
  readline.clearLine(process.stdout, 0)

  process.stdout.write('Writing... Done')
}
