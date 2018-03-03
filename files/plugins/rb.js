// Раскрытие круглых скобок в заголовках словарных исходников.

function onstart () {
  if (/^-(dsl1|dsl2|dslm1|dslm2)$/i.test(process.argv[3])) {
    o.eol = ''
    o.by_dsl_article()
  } else if (/^-(gls|glsm)$/i.test(process.argv[3])) {
    o.by_gls_article()
  } else {
    o.stop = 'Invalid command line.'
  }
}

let mark = ''
if (/^-(dslm1|dslm2)$/.test(process.argv[3]) || process.argv[3] === '-glsm') { mark = '$$$' }

if (/^-(dsl1|dsl2|dslm1|dslm2)$/i.test(process.argv[3])) {
  let hw = []

  for (let v of o.dsl[0]) {
    let h1 = o.utils
      .remove_comments(v)
      .replace(/[\t ]{2, }/g, ' ')
      .trim()
    if (h1 === '') {
      if (hw.length > 0) hw[hw.length - 1][2] += '\n' + v
    } else {
      hw.push([h1, v, ''])
    }
  }

  s = ''

  for (let v of hw) {
    let arr

    if (/^-(dsl2|dslm2)$/i.test(process.argv[3])) {
      arr = o.utils.openroundbrackets(v[0], true)[0]
    } else {
      arr = o.utils.openroundbrackets(v[0])[0]
    }

    if (arr.length > 1) {
      let first = arr.shift()
      arr.push(first)
    }

    if (arr.length === 1) {
      s += v[1] + v[2] + '\n' + o.dsl[1] + '\n'
    } else {
      if (!/^-(dsl2|dslm2)$/i.test(process.argv[3])) {
        s += mark + arr.join('\n') + v[2] + '\n' + o.dsl[1] + '\n'
      } else {
        for (let b = 0; b < arr.length; b++) {
          if (b === 0) {
            if (o.count === 1) {
              s += mark + arr[b] + '\n' + o.dsl[1] + '\n'
            } else {
              s += mark + arr[b] + '\n' + o.dsl[1] + '\n'
            }
          } else {
            if (b + 1 === arr.length) {
              s += arr[b] + v[2] + '\n' + o.dsl[1] + '\n'
            } else {
              s += arr[b] + '\n' + o.dsl[1] + '\n'
            }
          }
        }
      }
    }
  }
} else {
  s = ''

  let hw1 = o.gls[0].split(/\|/)

  let hw2 = []

  for (let v of hw1) {
    let arr = o.utils.openroundbrackets(v)[0]
    hw2.push(...arr)
  }

  let h = o.utils.filter_gls_hw_list(hw2.join('|'))

  if (h === o.gls[0]) {
    s = h + '\n' + o.gls[1]
  } else {
    s = mark + h + '\n' + o.gls[1]
  }
}
