function onstart () {
  const stardict = require(o.utilspath + 'stardictUtils.js')

  if (
    process.argv.length === 6 &&
    process.argv[3] === '-tab1' &&
    o.utils.fileExists(process.argv[4])
  ) {

    o.inputfile = process.argv[4]
    o.outputfile = process.argv[5]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    const indfile = process.argv[4]
    let synfile
    const indfile_path = indfile.replace(/(\.idx)$/i, '')
    for (let ext of [
      '.syn',
      '.SYN',
      '.Syn',
      '.sYn',
      '.syN',
      '.SYn',
      '.sYN',
      '.SyN'
    ]) {
      if (o.utils.fileExists(indfile_path + ext)) {
        synfile = indfile_path + ext
        break
      }
    }

    process.stdout.write('\nCreating table...')
    const tab1 = stardict.getOffsetLengthTable(indfile, synfile)
    fs.writeFileSync(process.argv[5], '', { encoding: 'utf8', flag: 'w' })
    for (let v of tab1) {
      fs.writeFileSync(
        process.argv[5],
        `${v[0].replace(/\t+/, ' ')}\t${v[1]}\t${v[2]}\n`,
        { encoding: 'utf8', flag: 'a' }
      )
    }

    process.stdout.write('\rCreating table...Done')
    o.et_show()
  } else if (
    process.argv.length === 6 &&
    process.argv[3] === '-tab2' &&
    o.utils.fileExists(process.argv[4])
  ) {
    o.inputfile = process.argv[4]
    o.outputfile = process.argv[5]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    const dzfile = process.argv[4]
    let indfile
    let synfile

    const dzfile_path = dzfile.replace(/(\.dict\.dz)$/i, '')
    for (let ext of [
      '.idx',
      '.IDX',
      '.Idx',
      '.iDx',
      '.idX',
      '.IDx',
      '.iDX',
      '.IdX'
    ]) {
      if (o.utils.fileExists(dzfile_path + ext)) {
        indfile = dzfile_path + ext
        break
      }
    }

    for (let ext of [
      '.syn',
      '.SYN',
      '.Syn',
      '.sYn',
      '.syN',
      '.SYn',
      '.sYN',
      '.SyN'
    ]) {
      if (o.utils.fileExists(dzfile_path + ext)) {
        synfile = dzfile_path + ext
        break
      }
    }

    if (!indfile) throw new Error('Index file not exists.')

    process.stdout.write('\nCreating table...')
    const tab1 = stardict.getOffsetLengthTable(indfile, synfile)
    const tab2 = stardict.getSliceChunksTable(dzfile, tab1)

    fs.writeFileSync(process.argv[5], '', { encoding: 'utf8', flag: 'w' })
    for (let v of tab2) {
      fs.writeFileSync(
        process.argv[5],
        `${v[0].replace(/\t+/g, ' ')}\t${v[1]}\n`,
        { encoding: 'utf8', flag: 'a' }
      )
    }

    process.stdout.write('\rCreating table...Done')
    o.et_show()
  } else if (
    process.argv.length === 6 &&
    (process.argv[3] === '-tab3' || process.argv[3] === '-tab4') &&
    o.utils.fileExists(process.argv[4])
  ) {
    o.inputfile = process.argv[4]
    o.outputfile = process.argv[5]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    o.progress_bar = false
    process.stdout.write('\nCreating table...')
    o.by_dsl_article()
  } else if (
    process.argv.length === 6 &&
    /^-test=.*$/.test(process.argv[3]) &&
    o.utils.fileExists(process.argv[3].replace(/^-test=(.*)$/, '$1')) &&
    o.utils.fileExists(process.argv[4])
  ) {
    o.inputfile = process.argv[4]
    o.outputfile = process.argv[5]

    process.stdout.write('\nTesting dzfile...')

    let dzfile = process.argv[3].replace(/^-test=(.*)$/, '$1')

    let arr = fs
      .readFileSync(process.argv[4], 'utf8')
      .toString()
      .split('\n')

    fs.writeFileSync(process.argv[5], '', { encoding: 'utf8', flag: 'w' })

    for (let v of arr) {
      let args = v.split(/\t/)

      if (!args[1]) break

      let artinfo = JSON.parse(args[1])

      if (artinfo.length === 2) {
        let last = artinfo[1]
        artinfo[1] = [[0, artinfo[0][1] - artinfo[0][0]]]
        artinfo.push(last)
      }

      let art = stardict.getArticleBodyfromDZ2(dzfile, artinfo)
      fs.writeFileSync(process.argv[5], art, { encoding: 'utf8', flag: 'a' })
    }

    process.stdout.write('\rTesting dzfile...Done')
    o.et_show()
  } else {
    console.log('Invalid command line.')
    process.exit()
  }
}

if (o.loop === 1) {
  o.tab[o.art_start] = [o.dsl[2], []]
}

if (o.loop === 2) {
  if (o.tab[o.count]) {
    o.tab[o.count][1].push(o.idata.getlast()[0])
  }
}

s = null

function SortFunction (a, b) {
  return parseInt(a) < parseInt(b) ? -1 : 1
}

function onexit () {
  if (o.loop === 1) {
    o.eol_mode = 1
    o.repeat = 'byline'
  } else {
    fs.writeFileSync(process.argv[5], '', { encoding: 'utf8', flag: 'w' })

    let keys = Object.keys(o.tab).sort(SortFunction)

    let tab1 = []
    for (let i = 0; i < keys.length; i++) {
      if (i + 1 < keys.length) {
        let headwords = o.tab[keys[i]][0]
        let offset = o.tab[keys[i]][1][0]
        let len = o.tab[keys[i + 1]][1] - o.tab[keys[i]][1]
        for (let h of headwords) {
          if (process.argv[3] === '-tab3') {
            fs.writeFileSync(process.argv[5], `${h}\t${offset}\t${len}\n`, {
              encoding: 'utf8',
              flag: 'a'
            })
          } else {
            tab1.push([h, offset, len])
          }
        }
      } else {
        let headwords = o.tab[keys[i]][0]
        let offset = o.tab[keys[i]][1][0]
        let filesize = fs.statSync(o.inputfile)['size']
        let len = filesize - o.tab[keys[i]][1]
        for (let h of headwords) {
          if (process.argv[3] === '-tab3') {
            fs.writeFileSync(process.argv[5], `${h}\t${offset}\t${len}\n`, {
              encoding: 'utf8',
              flag: 'a'
            })
          } else {
            tab1.push([h, offset, len])
          }
        }
      }
    }

    if (process.argv[3] === '-tab4') {
      const dslfile = process.argv[4]
      let dzfile
      const stardict = require(o.utilspath + 'stardictUtils.js')
      for (let ext of ['.dz', '.DZ', '.dZ', '.zD']) {
        if (o.utils.fileExists(dslfile + ext)) {
          dzfile = dslfile + ext
          break
        }
      }

      if (!dzfile) throw new Error('Index file not exists.')

      const tab2 = stardict.getSliceChunksTable(dzfile, tab1)

      for (let v of tab2) {
        fs.writeFileSync(
          process.argv[5],
          `${v[0].replace(/\t+/g, ' ')}\t${v[1]}\n`,
          { encoding: 'utf8', flag: 'a' }
        )
      }
    }

    process.stdout.write('\rCreating table...Done')
  }
}
