// Маркировка подвешенных ссылок в DSL файле.

function onstart () {
  o.headwords = Object.create(null)
  o.by_dsl_article()
}

function clearhw (h) {
  let bak = h
  h = o.utils
    .remove_comments(h)
    .replace(/[\t ]{2, }/g, ' ')
    .trim()
  h = o.utils
    .remove_scb(h)
    .replace(/[\t ]{2, }/g, ' ')
    .trim()

  if (h === '') h = bak

  return h
}

if (o.loop === 1) {
  for (let v of o.dsl[2]) {
    let h1 = clearhw(v)
    let arr = o.utils.openroundbrackets(h1)[0]
    for (let h2 of arr) {
      h2 = o.utils.remove_odd_slash(h2)
      if (h2 !== '') {
        o.headwords[h2] = ''
      }
    }
  }
}

if (o.loop === 2) {
  let txt = ''
  let ind = 0
  let m
  let re = /([^]*?)(\\*)(<<|\[ref\])([^]*?)(\\*)(\[[^\[\]\\]*?\]|>>)/y
  while ((m = re.exec(s))) {
    ind = re.lastIndex
    txt += m[1] + m[2]
    if (m[2].length % 2 === 1 || m[5].length % 2 === 1) {
      txt += m[3] + m[4] + m[5] + m[6]
      continue
    }

    if (m[3] === '<<' && m[6] === '>>') {
      txt += m[3]
    } else if (m[3] === '[ref]' && m[6] === '[/ref]') {
      txt += m[3]
    } else {
      txt += m[3] + m[4] + m[5] + m[6]
      continue
    }

    let lnk = m[4] + m[5]
    let bak = lnk
    lnk = o.utils.remove_comments(lnk)
    lnk = o.utils
      .remove_odd_slash(lnk)
      .replace(/[\t ]{2, }/g, ' ')
      .trim()
    if (lnk === '') lnk = bak

    if (o.headwords[lnk] === undefined) {
      txt += '$$$' + m[4] + m[5] + '$$$' + m[6]
    } else {
      txt += m[4] + m[5] + m[6]
    }
  }

  txt += s.substr(ind)
  s = txt
}

function onexit () {
  if (o.loop === 1) {
    o.repeat = 'by_dsl_article'
  }
}
