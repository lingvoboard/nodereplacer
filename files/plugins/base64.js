// Конвертирует изображения в base64

function onstart () {
  if (
    process.argv.length === 6 &&
    process.argv[3] === '-i' &&
    o.utils.fileExists(process.argv[4])
  ) {
    // node nodereplacer.js -base64 -i input.txt output.txt
    o.inputfile = process.argv[4]
    o.outputfile = process.argv[5]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    o.byline()
    fs.writeFileSync(o.error_log_path, '', { encoding: 'utf8', flag: 'w' })
  } else if (process.argv.length === 5 && o.utils.fileExists(process.argv[3])) {
    // node nodereplacer.js -base64 input.txt output.txt
    const hrstart = process.hrtime()

    o.inputfile = process.argv[3]
    o.outputfile = process.argv[4]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    try {
      let encoding = o.utils.guessEncoding(o.inputfile)
      let data = fs.readFileSync(o.inputfile)
      let base64str = data.toString('base64')
      let content =
        '<img src="' + 'data:image/png;base64,' + base64str + '" />\n\n'
      content +=
        '<style>\ndiv.image {\nbackground-image:url(data:image/png;base64,'
      content +=
        base64str +
        ');\nbackground-size: auto;\nbackground-repeat: no-repeat;\nwidth:100%;\nheight:100%;\n\n}\n</style>\n\n<div class=image title="' +
        o.inputfile +
        '"></div>'
      fs.writeFileSync(o.outputfile, content, { encoding: encoding, flag: 'w' })

      const hrend = process.hrtime(hrstart)
      console.log(
        `\n\nExecution time: ${hrend[0]}.${Math.floor(hrend[1] / 1000000)}\n`
      )
    } catch (err) {
      console.log('\nTypeError: ' + err.message)
    }
  } else {
    console.log('Invalid command line.')
    process.exit()
  }
}

function imgtobase64 (b, img, e) {
  try {
    let data = fs.readFileSync('res/' + img)
    let base64str = data.toString('base64')
    return b + 'data:image/png;base64,' + base64str + e
  } catch (err) {
    if (o.tab[img] === undefined) {
      o.tab[img] = ''
      fs.writeFileSync(o.error_log_path, 'File does not exist: ' + img + '\n', {
        encoding: 'utf8',
        flag: 'a'
      })
    }
    return b + img + e
  }
}

s = s.replace(/(<IMG[^>]*src=\")([^\">]+)(\"[^>]*>)/gi, (u, m1, m2, m3) => {
  return imgtobase64(m1, m2, m3)
})
