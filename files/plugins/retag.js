// Плагин исправляет неправильные сочетания DSL тегов.

function onstart () {
  // - - - для -rt
  o.parse5Utils = require('parse5-utils')
  const parse5Utils = o.parse5Utils
  o.fragment = parse5Utils.parseFragment('')
  o.htmlclean = require(o.utilspath + 'htmlclean.js').htmlclean
  // - - - - - -

  o.parse5 = require('parse5')

  o.entities = require('entities')

  o.retagged = 0

  if (process.argv.length === 5) {
    const r = String.raw
    o.startOfString = '^'
    o.notEscapeSymbol = r`[^\x5c]`
    o.escapedEscapeSymbols = r`(?:${o.startOfString}|${
      o.notEscapeSymbol
    })(?:\x5c{2})+`

    o.DSLTag = r`\x5b([^\x5d]+?)(?: ([^\x5d]+))*\x5d`

    o.notEscapedDSLTagRE = new RegExp(
      `(?<=${o.startOfString}|${o.notEscapeSymbol}|${o.escapedEscapeSymbols})${
        o.DSLTag
      }`,
      'g'
    )

    o.HTMLTagRE = /<([^>]+?)(?: title="([^\x22]+)")*>/g

    /* eslint-disable array-bracket-spacing */
    o.DSLtoHTMLmap = new Map([
      ['b', 'b'],
      ['i', 'i'],
      ['u', 'u'],
      ['sub', 'small'],
      ['sup', 'big'],
      ['p', 'a'],
      ['!trs', 'strike'],
      ['ex', 'tt'],
      ['com', 'code'],
      ['trn', 'strong'],
      ["'", 'nobr'],
      ['*', 's'],
      ['c', 'em'],
      ['lang', 'font']
    ])
    /* eslint-enable array-bracket-spacing */

    ;[...o.DSLtoHTMLmap.entries()].forEach(pair => {
      o.DSLtoHTMLmap.set(`/${pair[0]}`, `/${pair[1]}`)
    })

    o.HTMLtoDSLmap = new Map(
      [...o.DSLtoHTMLmap.entries()].map(pair => pair.reverse())
    )

    o.by_dsl_article()
  } else if (process.argv.length === 6 && process.argv[3] === '-gls') {
    o.by_gls_article()
  } else if (process.argv.length === 6 && process.argv[3] === '-e') {
    o.entirefile()
  } else if (process.argv.length === 6 && process.argv[3] === '-rt') {
    o.byline()
  } else {
    console.log('Invalid command line.')
  }
}

function dsl2html2dsl (str) {
  const backup = str.trim()
  const [, startSpaces, endSpaces] = str.match(/^(\s*)[^]*?(\s*)$/)

  let doc = o.parse5.parse(
    '<!DOCTYPE html><html><head></head><body></body></html>',
    {
      treeAdapter: o.parse5.treeAdapters.default
    }
  )

  let treeAdapter = o.parse5.treeAdapters.default

  treeAdapter.insertText(doc.childNodes[1].childNodes[1], str)

  let escapedStr = o.parse5.serialize(doc.childNodes[1].childNodes[1])

  let html = escapedStr.replace(o.notEscapedDSLTagRE, (match, tag, attr) => {
    if (o.DSLtoHTMLmap.has(tag)) {
      return `<${o.DSLtoHTMLmap.get(tag)}${attr ? ` title='${attr}'` : ''}>`
    }
    return match
  })

  doc = o.parse5.parse(html)

  html = o.parse5.serialize(doc.childNodes[0].childNodes[1])

  str = html.replace(o.HTMLTagRE, (match, tag, attr) => {
    if (o.HTMLtoDSLmap.has(tag)) {
      return `[${o.HTMLtoDSLmap.get(tag)}${attr ? ` ${attr}` : ''}]`
    }
    return match
  })

  str = o.entities.decodeHTML(str).trim()

  if (str !== backup) o.retagged++

  return `${startSpaces}${str}${endSpaces}`
}

function processLine (str) {
  const parse5Utils = o.parse5Utils
  const html = parse5Utils.parse(str, true)
  const htmlclean = o.htmlclean
  return htmlclean(parse5Utils.serialize(html))
}

if (process.argv.length === 6 && process.argv[3] === '-gls') {
  const backup = o.gls[1]
  let doc = o.parse5.parse(
    '<!DOCTYPE html><html><head></head><body>' + o.gls[1] + '</body></html>'
  )
  let str = o.parse5.serialize(doc.childNodes[1].childNodes[1])
  if (str.trim() !== backup.trim()) o.retagged++
  s = o.gls[0] + '\n' + str
} else if (process.argv.length === 6 && process.argv[3] === '-rt') {
  const backup = s
  let str = processLine(s)
  if (str.trim() !== backup.trim()) o.retagged++
  s = str
} else if (process.argv.length === 6 && process.argv[3] === '-e') {
  let doc = o.parse5.parse(s)
  let str = o.parse5.serialize(doc)
  s = str
} else {
  s = o.dsl[1].replace(/(\\*)([\[\]])/g, function (u, m1, m2) {
    if (m1.length % 2 === 1) {
      m2 = '&#' + m2.codePointAt(0) + ';'
    }

    return m1 + m2
  })

  s = dsl2html2dsl(s)

  s =
    o.dsl[0].join('\n').trim() +
    '\n' +
    s.replace(/&#(\d+);/g, function (u, m1) {
      let c = String.fromCodePoint(m1)
      return c
    })
}

function onexit () {
  if (process.argv.length === 6 && process.argv[3] === '-e') {
  } else {
    o.log.push(`Retagged headwords or cards: ${o.retagged}.`)
  }
}
