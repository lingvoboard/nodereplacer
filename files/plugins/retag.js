// Плагин исправляет неправильные сочетания DSL тегов.

function onstart () {
  o.parse5 = require('parse5')
  const parse5 = o.parse5
  o.fragment = parse5.parseFragment('')
  // o.htmlclean = require(o.utilspath + 'htmlclean.js').htmlclean

  o.retagged = 0

  if (process.argv.length === 5 && o.utils.fileExists(process.argv[3])) {
    // node nodereplacer.js -retag input.txt output.txt

    o.defaultTreeAdapter = require('parse5/lib/tree-adapters/default')
    o.entities = require('entities')

    o.inputfile = process.argv[3]
    o.outputfile = process.argv[4]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    const r = String.raw
    o.startOfString = '^'
    o.notEscapeSymbol = r`[^\x5c]`
    o.escapedEscapeSymbols = r`(?:${o.startOfString}|${o.notEscapeSymbol})(?:\x5c{2})+`

    o.DSLTag = r`\x5b([^\x5d]+?)(?: ([^\x5d]+))*\x5d`

    o.notEscapedDSLTagRE = new RegExp(
      `(?<=${o.startOfString}|${o.notEscapeSymbol}|${o.escapedEscapeSymbols})${o.DSLTag}`,
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
  } else if (process.argv.length === 6) {
    if (process.argv[3] === '-gls' && o.utils.fileExists(process.argv[4])) {
      // node nodereplacer.js -retag -gls input.gls output.gls
      o.inputfile = process.argv[4]
      o.outputfile = process.argv[5]

      if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
        o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
      } else {
        o.error_log_path = 'error.log'
      }

      o.by_gls_article()
    } else if (
      process.argv[3] === '-re' &&
      o.utils.fileExists(process.argv[4])
    ) {
      // node nodereplacer.js -retag -re input.html output.html
      o.inputfile = process.argv[4]
      o.outputfile = process.argv[5]

      if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
        o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
      } else {
        o.error_log_path = 'error.log'
      }

      o.entirefile()
    } else if (
      process.argv[3] === '-rt' &&
      o.utils.fileExists(process.argv[4])
    ) {
      // node nodereplacer.js -retag -rt input.txt output.txt
      o.inputfile = process.argv[4]
      o.outputfile = process.argv[5]

      if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
        o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
      } else {
        o.error_log_path = 'error.log'
      }

      o.byline()
    } else console.log('Invalid command line.')
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
      treeAdapter: o.defaultTreeAdapter
    }
  )

  const treeAdapter = o.defaultTreeAdapter

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

function processHtmlString (str, normalize) {
  const parse5 = o.parse5
  const dom = parse5[
    'parse' + (o.utils.checkIfDocument(str) ? '' : 'Fragment')
  ](str)
  // const htmlclean = o.htmlclean
  // return htmlclean(parse5.serialize(html))
  return normalize
    ? o.utils.normalizeHTML(parse5.serialize(dom))
    : parse5.serialize(dom)
}

function checkIfChanged (oldStr, newStr) {
  return (
    oldStr.trim().length !== newStr.trim().length ||
    oldStr.trim() !== newStr.trim()
  )
}

if (process.argv.length === 6) {
  let str = ''
  let isChanged = false
  if (process.argv[3] === '-gls') {
    str = processHtmlString(o.gls[1], true)
    isChanged = checkIfChanged(o.gls[1], str)
    if (isChanged) str = o.gls[0] + '\n' + str
  } else if (process.argv[3] === '-rt') {
    str = processHtmlString(s, true)
    isChanged = checkIfChanged(s, str)
  } else if (process.argv[3] === '-re') {
    str = processHtmlString(s, false)
    isChanged = checkIfChanged(s, str)
  }
  if (isChanged) {
    o.retagged++
    s = str
  }
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
