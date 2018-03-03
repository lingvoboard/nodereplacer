// Этот плагин предназначен для импорта морфологии в GLS файл.

function onstart () {
  o.inputfile = process.argv[3]
  o.byline()
}

if (o.loop === 1 && o.count === 1) {
  o.morpho = Object.create(null)
}

if (o.loop === 1) {
  let m
  if ((m = /^([^\t]+)\t([^\t]+)$/.exec(s))) {
    if (m[1].trim().length > 0 && m[2].trim().length > 0) {
      if (o.morpho[m[2].trim()] === undefined) {
        o.morpho[m[2].trim()] = m[1].trim()
      } else {
        o.morpho[m[2].trim()] += '|' + m[1].trim()
      }
    }
  }

  s = null
}

if (o.loop === 2) {
  let h = o.gls[0]

  h = h.replace(/\x5c\|/g, '&#x5c;&#x7c;')

  let h_list = h.split(/\|/)

  if (
    h_list.length > 0 &&
    h_list[0].trim().length > 0 &&
    o.morpho[h_list[0].trim()] !== undefined
  ) {
    h += '|' + o.morpho[h_list[0].trim()]
    h = o.utils.filter_gls_hw_list(h)
  }

  h = h.replace(/&#x5c;&#x7c;/g, '\\|')

  s = h + '\n' + o.gls[1]
}

function onexit () {
  if (o.loop === 1) {
    o.inputfile = process.argv[4]
    o.repeat = 'by_gls_article'
  }
}
