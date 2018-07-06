// Перенос данных из файла аббревиатур в HTML теги.

function onstart () {
  if (
    process.argv.length === 6 &&
    o.utils.fileExists(process.argv[3]) &&
    o.utils.fileExists(process.argv[4])
  ) {
    // node nodereplacer.js -title input_abrv.dsl input.txt output.txt
    o.inputfile = process.argv[3]
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

if (o.loop === 1) {
  for (let v of o.dsl[2]) {
    o.tab[v] = o.dsl[1].trim()
  }

  s = null
}

if (o.loop === 2) {
  let m
  while ((m = /^([^]*?)<abbr>(.+?)<\/abbr>([^]*)$/.exec(s))) {
    if (o.tab[m[2]] !== undefined) {
      s = m[1] + '<abbr title="' + o.tab[m[2]] + '">' + m[2] + '</abbr>' + m[3]
    } else {
      s = m[1] + '<$$$>' + m[2] + '</$$$>' + m[3]
    }
  }
}

function onexit () {
  if (o.loop === 1) {
    o.inputfile = process.argv[4]
    o.repeat = 'byline'
  }
}
