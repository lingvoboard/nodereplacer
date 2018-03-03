/*
Modified: 09-11-2017 (21:15)

НАЗНАЧЕНИЕ
Маркировка подвешенных и невалидных ссылок в GLS файле.

- Подвешенные ссылки маркируются меткой ###
- Невалидные ссылки маркируются меткой $$$
- Значения href подвешенных ссылок записываются в файл susp_href.log
- Ссылки в значениях которых только якорь (href="#dog") игнорируются
- Нелокальные ссылки (href="http://example.com") игнорируются (значение href проверяется таким рег. выражением /^https?:/)
- Ссылки у которых значение атрибута href начинается с "javascript:" игнорируются.

ИСПОЛЬЗОВАНИЕ
rep -rg suspg.js input.gls out.gls
Как плагин:
rep -suspg input.gls out.gls

ПРИМЕР

До)

собака
перевод<a href="">aaaaa</a>

dog
перевод<a href="aaaaaa"><b> </b></a>

perro
перевод<a href="dog#anchor">aaaaa</a> <a href="javascript:void(0);">aaaaa</a>

chien
перевод<a href="error">aaaaa</a> <a href="http://example.com">aaaaa</a>

После)

собака
перевод<a href="">$$$aaaaa</a>

dog
перевод<a href="aaaaaa">$$$<b> </b></a>

perro
перевод<a href="dog#anchor">aaaaa</a> <a href="javascript:void(0);">aaaaa</a>

chien
перевод<a href="error">###aaaaa</a> <a href="http://example.com">aaaaa</a>

*/

function onstart () {
  o.invalidLinksCounter = 0
  o.suspendedLinksCounter = 0
  fs.writeFileSync('susp_href.log', o.bom + 'Hrefs of suspended links:\n', {
    encoding: 'utf8',
    flag: 'w'
  })
  o.progress_bar_title = 'Reading headwords:\n'
  o.by_gls_article()
}

if (o.loop === 1) {
  let arr = o.gls[0]
    .split('|')
    .map(el => {
      return el.trim()
    })
    .filter(Boolean)
  for (let v of arr) o.tab[v] = 0
  s = null
} else {
  function removeAnchorPart (lnk) {
    return lnk.replace(/^([^]*?)#.*$/, '$1')
  }

  let $ = o.utils.init_cheerio_old(o.gls[1])

  $('a').each(function (i, elem) {
    let h = $(elem).attr('href')
    let t = $(elem).text()

    if (
      !h ||
      !t ||
      h.trim() === '' ||
      t.trim() === '' ||
      /^[^]*#\s*$/.test(h)
    ) {
      o.invalidLinksCounter++
      $(elem).html('$$$' + $(elem).html())
    } else {
      let q = removeAnchorPart(h.trim())

      if (
        q &&
        /^(https?|javascript):/.test(q) === false &&
        o.tab[q] === undefined
      ) {
        o.suspendedLinksCounter++
        $(elem).html('###' + $(elem).html())
        fs.writeFileSync('susp_href.log', h + '\n', {
          encoding: 'utf8',
          flag: 'a'
        })
      }
    }
  })

  s = o.gls[0] + '\n' + $.html({ decodeEntities: false })
}

function onexit () {
  if (o.loop === 1) {
    o.progress_bar_title = 'Cheking links:\n'
    o.repeat = 'by_gls_article'
  }

  if (o.loop === 2) {
    o.log.push('Invalid links: ' + o.invalidLinksCounter)
    o.log.push('Suspended links: ' + o.suspendedLinksCounter)
  }
}
