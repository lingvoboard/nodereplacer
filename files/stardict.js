// Слелан на основе https://gist.github.com/vsemozhetbyt/2b92014cd65e8fb3c3e5c0897a750e40
// Плагин конвертирует исходные файлы в формате GLS в словари StarDict и обратно.

function onstart () {
  o.path = require('path')
  o.fpath = process.argv[2] || ''
  o.fext = o.path.extname(o.fpath)

  if (!o.fpath || process.argv[3] || !['.gls', '.ifo'].includes(o.fext)) {
    const scriptName = o.path.basename(__filename)
    console.error(xs`

		Usage 1: ${scriptName} dictionary.gls

		Usage 2: ${scriptName} dictionary.ifo
	  `)
    process.exit(1)
  }

  console.log('')
  /******************************************************************************/
  o.fs = require('fs')
  o.rl = require('readline')

  o.execSync = require('child_process').execSync

  o.getByteLength = Buffer.byteLength

  o.changeExtRE = /(?:\.[^.]+)?$/

  o.inCoding = 'utf8'
  o.outCoding = 'utf8'

  o.bomRE = /^\uFEFF/

  o.INT_BYTES = 4
  o.intBf = Buffer.alloc(o.INT_BYTES)

  o.HEADWORD_EDGE = 256

  o.inDic = Object.create(null)
  o.outDic = Object.create(null)

  o.UPDATE_PB_SYNC_PACE = 1000
  /******************************************************************************/
  if (o.fext === '.gls') {
    gls2sd()
  } else {
    sd2gls()
  }
}

/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
function gls2sd () {
  o.inDic.rli = o.rl.createInterface({
    input: fs.createReadStream(o.fpath, o.inCoding)
  })

  o.inDic.directives = Object.create(null)
  o.inDic.hasDirectives = false
  o.inDic.dic = []
  o.inDic.syns = []

  o.inDic.empties = []
  o.inDic.article = []

  o.inDic.dirRE = /^#+\s*(.+?)\s*[:?]\s*(.*)/
  o.inDic.articleRE = /^[^#]/

  o.inDic.lineNumber = 0

  o.inDic.isDirectivesZone = true
  o.inDic.errors = false

  readGLS()
}
/******************************************************************************/
function readGLS () {
  console.log('Reading .gls file...\n')
  o.inDic.pb = pb(fs.statSync(o.fpath).size)
  o.inDic.pb.start()

  o.inDic.rli
    .on('line', line => {
      o.inDic.pb.stat += o.getByteLength(line, o.inCoding) + 1

      if (++o.inDic.lineNumber === 1) {
        line = line.replace(o.bomRE, '').trim()

        if (o.inDic.articleRE.test(line)) {
          abortOnParsingError(
            `Error: no empty line before article at line ${o.inDic.lineNumber}.`
          )
        }
      } else {
        line = line.trim()
      }

      if (!line) {
        o.inDic.empties.push(line)

        if (o.inDic.hasDirectives) {
          o.inDic.isDirectivesZone = false
        }

        if (!o.inDic.isDirectivesZone) {
          addGLSArticle()
        }
      } else if (o.inDic.articleRE.test(line) || !o.inDic.isDirectivesZone) {
        if (o.inDic.article.length === 0) {
          if (o.inDic.empties.length) {
            o.inDic.isDirectivesZone = false
            o.inDic.empties.length = 0

            const headwords = line.split(/\s*\|\s*/).filter(elem => elem)

            if (!headwords.length) {
              abortOnParsingError(
                `Error: no headwords in the article at line ${
                  o.inDic.lineNumber
                }.`
              )
            }

            if (
              headwords.some(
                hw => o.getByteLength(hw, o.inCoding) >= o.HEADWORD_EDGE
              )
            ) {
              abortOnParsingError(xs`
              Error: headword should be less than ${o.HEADWORD_EDGE} bytes
              in the article at line ${o.inDic.lineNumber}.
            `)
            }

            o.inDic.article.push(headwords)
          } else {
            abortOnParsingError(
              `Error: no empty line before article at line ${
                o.inDic.lineNumber
              }.`
            )
          }
        } else if (o.inDic.article.length === 1) {
          o.inDic.article.push(line)
        } else {
          abortOnParsingError(
            `Error: wrong article format at line ${o.inDic.lineNumber}.`
          )
        }
      } else {
        o.inDic.empties.length = 0

        const [, k, v] = line.match(o.inDic.dirRE) || []
        if (k) {
          o.inDic.directives[k] = v
          o.inDic.hasDirectives = true
        }
      }
    })
    .on('close', () => {
      o.inDic.pb.end()

      addGLSArticle()

      if (!o.inDic.errors && o.inDic.dic.length) {
        writeSDDic()
        if (o.inDic.syns.length) writeSDSyn()
        writeSDIfo()
      }

      console.log(
        `${o.inDic.dic.length} articles with ${
          o.inDic.syns.length
        } synonyms saved.\n`
      )

      if (process['dev_argv'].notpack !== 'yes') {
        console.log(
          `Trying to pack "${o.path.basename(
            o.fpath,
            '.gls'
          )}.dict" by dictzip...\n`
        )

        packDICTfile()
      }
    })
}
/******************************************************************************/
function addGLSArticle () {
  if (o.inDic.article.length === 2) {
    o.inDic.dic.push(o.inDic.article.slice())
    o.inDic.article.length = 0
  } else if (o.inDic.article.length) {
    abortOnParsingError(
      `Error: wrong article format before line ${o.inDic.lineNumber}.`
    )
  }
}
/******************************************************************************/
function writeSDDic () {
  console.log('Sorting the dictionary...\n')
  o.inDic.dic.forEach((artcl, i) => {
    artcl.push(i)
  }) // for stable sorting
  o.inDic.dic.sort(sortSDDic)

  o.outDic.idxFile = fs.openSync(o.fpath.replace(o.changeExtRE, '.idx'), 'w')
  o.outDic.dictFile = fs.openSync(o.fpath.replace(o.changeExtRE, '.dict'), 'w')

  let defOffset = 0

  console.log('Writing .idx and .dict files...\n')
  o.outDic.pb = pb(o.inDic.dic.length)

  o.inDic.dic.forEach((artcl, i) => {
    if (i % o.UPDATE_PB_SYNC_PACE === 0) o.outDic.pb.update(i)

    const [[hw1, ...hwSyns], def] = artcl

    const defLen = o.getByteLength(def, o.inCoding)

    fs.writeSync(o.outDic.idxFile, `${hw1}\0`, null, o.outCoding)

    o.intBf.writeUInt32BE(defOffset, 0)
    fs.writeSync(o.outDic.idxFile, o.intBf, 0, o.INT_BYTES)

    o.intBf.writeUInt32BE(defLen, 0)
    fs.writeSync(o.outDic.idxFile, o.intBf, 0, o.INT_BYTES)

    defOffset += defLen

    fs.writeSync(o.outDic.dictFile, `${def}`, null, o.outCoding)

    hwSyns.forEach(syn => {
      o.inDic.syns.push([syn, i])
    })
  })

  o.outDic.pb.end()
}
/******************************************************************************/
function writeSDSyn () {
  o.inDic.syns.sort(sortSDSyns)

  o.outDic.synsFile = fs.openSync(o.fpath.replace(o.changeExtRE, '.syn'), 'w')

  console.log('Writing .syn file...\n')

  o.inDic.syns.forEach(syn => {
    fs.writeSync(o.outDic.synsFile, `${syn[0]}\0`, null, o.outCoding)

    o.intBf.writeUInt32BE(syn[1], 0)
    fs.writeSync(o.outDic.synsFile, o.intBf, 0, o.INT_BYTES)
  })
}
/******************************************************************************/
function writeSDIfo () {
  console.log('Writing .ifo file...\n')

  const directivesToFilter = [
    'version',
    'Bookname',
    'Glossary title',
    'Wordcount',
    'Synwordcount',
    'Idxfilesize',
    'Sametypesequence',
    'Glossary section'
  ]

  fs.writeFileSync(
    o.fpath.replace(o.changeExtRE, '.ifo'),
    xs`
    StarDict's dict ifo file
    version=2.4.2
    bookname=${o.inDic.directives['Glossary title'] ||
      o.path.basename(o.fpath, o.fext)}
    wordcount=${o.inDic.dic.length}
    synwordcount=${o.inDic.syns.length}
    idxfilesize=${fs.fstatSync(o.outDic.idxFile).size}
    sametypesequence=h
    ${Object.keys(o.inDic.directives)
    .filter(k => !directivesToFilter.includes(k))
    .map(
      k => `${k.toLowerCase().replace(/ /g, '_')}=${o.inDic.directives[k]}`
    )
    .join('\n')}

  `,
    'utf8'
  )
}
/******************************************************************************/
function sortSDDic (a, b) {
  const HWa = a[0][0]
  const HWb = b[0][0]

  const asciiLowerCaseHWa = HWa.replace(/[A-Z]/g, m => m.toLowerCase())
  const asciiLowerCaseHWb = HWb.replace(/[A-Z]/g, m => m.toLowerCase())

  if (asciiLowerCaseHWa < asciiLowerCaseHWb) return -1

  if (asciiLowerCaseHWa > asciiLowerCaseHWb) return 1

  if (HWa < HWb) return -1

  if (HWa > HWb) return 1

  return a[2] - b[2] // for stable sorting
}
/******************************************************************************/
function sortSDSyns (a, b) {
  const SYNa = a[0]
  const SYNb = b[0]

  const asciiLowerCaseSYNa = SYNa.replace(/[A-Z]/g, m => m.toLowerCase())
  const asciiLowerCaseSYNb = SYNb.replace(/[A-Z]/g, m => m.toLowerCase())

  if (asciiLowerCaseSYNa < asciiLowerCaseSYNb) return -1

  if (asciiLowerCaseSYNa > asciiLowerCaseSYNb) return 1

  if (SYNa < SYNb) return -1

  if (SYNa > SYNb) return 1

  return 0
}
/******************************************************************************/
function packDICTfile () {
  try {
    o.execSync(`dictzip ${o.fpath.replace(o.changeExtRE, '.dict')}`)
    console.log('.dict file is packed successfully.')
  } catch (error) {
    console.error(`dictzip error: ${error}`)
  }
}
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
function sd2gls () {
  o.inDic.inDir = o.path.dirname(o.fpath)
  o.inDic.basename = o.path.basename(o.fpath, '.ifo')
  o.inDic.needFiles = [
    '.ifo',
    '.idx',
    '.idx.gz',
    '.dict',
    '.dict.dz',
    '.syn'
  ].map(ext => `${o.inDic.basename}${ext}`)
  o.inDic.foundfiles = fs
    .readdirSync(o.inDic.inDir)
    .filter(f => o.inDic.needFiles.includes(f))

  if (!o.inDic.foundfiles.includes(`${o.inDic.basename}.ifo`)) {
    console.error('.ifo file not found.')
    process.exit(1)
  }
  if (
    !o.inDic.foundfiles.includes(`${o.inDic.basename}.idx`) &&
    !o.inDic.foundfiles.includes(`${o.inDic.basename}.idx.gz`)
  ) {
    console.error('.idx (or .idx.gz) file not found.')
    process.exit(1)
  }
  if (
    !o.inDic.foundfiles.includes(`${o.inDic.basename}.dict`) &&
    !o.inDic.foundfiles.includes(`${o.inDic.basename}.dict.dz`)
  ) {
    console.error('.dict (or .dict.dz) file not found.')
    process.exit(1)
  }

  o.inDic.foundfiles = o.inDic.foundfiles.map(f =>
    o.path.join(o.inDic.inDir, f)
  )

  o.inDic.directives = Object.create(null)
  o.inDic.dic = []
  o.inDic.syns = []

  o.inDic.dirRE = /^\s*(\w+)\s*=\s*(.*)/

  o.inDic.errors = false

  readSDIfo()
  if (o.inDic.foundfiles.some(f => f.endsWith('.syn'))) readSDSyn()
  readSDDic()

  if (!o.inDic.errors && o.inDic.dic.length) {
    writeGLS()
  }

  console.log(
    `${o.inDic.dic.length} articles with ${o.inDic.syns.length} synonyms saved.`
  )
}
/******************************************************************************/
function readSDIfo () {
  console.log('Reading .ifo file...\n')

  fs
    .readFileSync(o.inDic.foundfiles.find(f => f.endsWith('.ifo')), o.inCoding)
    .replace(/^\uFEFF/, '')
    .split(/[\n\r]+/)
    .forEach(line => {
      const [, k, v] = line.match(o.inDic.dirRE) || []
      if (k) o.inDic.directives[k] = v
    })

  if (o.inDic.directives.sametypesequence !== 'h') {
    console.error(
      "Only StarDict's dictionaries with 'sametypesequence=h' are supported."
    )
    process.exit(1)
  }
  if (o.inDic.directives.idxoffsetbits === '64') {
    console.error(
      "Only StarDict's dictionaries with 'idxoffsetbits=32' are supported."
    )
    process.exit(1)
  }
}
/******************************************************************************/
function readSDSyn () {
  console.log('Reading .syn file...\n')

  o.inDic.synBf = fs.readFileSync(
    o.inDic.foundfiles.find(f => f.endsWith('.syn'))
  )

  let synOffset = 0
  while (synOffset < o.inDic.synBf.length) {
    const synBf = []
    let byte
    while ((byte = o.inDic.synBf[synOffset++])) synBf.push(byte)

    const i = o.inDic.synBf.readUInt32BE(synOffset)
    synOffset += o.INT_BYTES

    o.inDic.syns.push([Buffer.from(synBf).toString(o.inCoding), i])
  }

  delete o.inDic.synBf
}
/******************************************************************************/
function readSDDic () {
  console.log('Reading .idx and .dict files...\n')

  if (o.inDic.foundfiles.some(f => f.endsWith('.idx'))) {
    o.inDic.idxBf = fs.readFileSync(
      o.inDic.foundfiles.find(f => f.endsWith('.idx'))
    )
  } else {
    o.inDic.zlib = require('zlib')

    o.inDic.idxBf = o.inDic.zlib.unzipSync(
      fs.readFileSync(o.inDic.foundfiles.find(f => f.endsWith('.idx.gz')))
    )
  }

  if (o.inDic.foundfiles.some(f => f.endsWith('.dict'))) {
    o.inDic.dictBf = fs.readFileSync(
      o.inDic.foundfiles.find(f => f.endsWith('.dict'))
    )
  } else {
    if (!o.inDic.zlib) o.inDic.zlib = require('zlib')

    o.inDic.dictBf = o.inDic.zlib.unzipSync(
      fs.readFileSync(o.inDic.foundfiles.find(f => f.endsWith('.dict.dz')))
    )
  }

  console.log('Processing .idx and .dict files...\n')
  o.inDic.pb = pb(o.inDic.directives.wordcount)

  let idxOffset = 0
  while (idxOffset < o.inDic.idxBf.length) {
    const added = o.inDic.dic.length
    if (added % o.UPDATE_PB_SYNC_PACE === 0) o.inDic.pb.update(added)

    const hwBf = []
    let byte
    while ((byte = o.inDic.idxBf[idxOffset++])) hwBf.push(byte)

    const dataOffset = o.inDic.idxBf.readUInt32BE(idxOffset)
    idxOffset += o.INT_BYTES
    const dataSize = o.inDic.idxBf.readUInt32BE(idxOffset)
    idxOffset += o.INT_BYTES

    o.inDic.dic.push([
      [Buffer.from(hwBf).toString(o.inCoding)],
      o.inDic.dictBf.toString(o.inCoding, dataOffset, dataOffset + dataSize)
    ])
  }

  o.inDic.pb.end()
  delete o.inDic.idxBf
  delete o.inDic.dictBf

  if (o.inDic.syns.length) {
    console.log('Adding synonyms...\n')

    o.inDic.syns.forEach(rec => {
      const [syn, i] = rec
      o.inDic.dic[i][0].push(syn)
    })
  }
}
/******************************************************************************/
function writeGLS () {
  console.log('Writing .gls file...\n')

  o.outDic.glsFile = fs.openSync(o.fpath.replace(o.changeExtRE, '.gls'), 'w')
  fs.writeSync(o.outDic.glsFile, '\uFEFF', null, o.outCoding)

  const directivesToFilter = [
    'version',
    'wordcount',
    'synwordcount',
    'idxfilesize',
    'idxoffsetbits',
    'sametypesequence'
  ]

  fs.writeSync(
    o.outDic.glsFile,
    Object.keys(o.inDic.directives)
      .filter(k => !directivesToFilter.includes(k))
      .map(
        k =>
          `### ${k
            .replace(/^bookname$/, 'Glossary title')
            .replace(/^\w/, char => char.toUpperCase())
            .replace(/_/g, ' ')}:${o.inDic.directives[k]}`
      )
      .concat('### Glossary section:')
      .join('\n')
      .concat('\n\n'),
    null,
    o.outCoding
  )

  o.outDic.pb = pb(o.inDic.dic.length)

  o.inDic.dic.forEach((artcl, i) => {
    if (i % o.UPDATE_PB_SYNC_PACE === 0) o.outDic.pb.update(i)

    fs.writeSync(
      o.outDic.glsFile,
      `${artcl[0].join('|')}\n${artcl[1]}\n\n`,
      null,
      o.outCoding
    )
  })

  o.outDic.pb.end()
}
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
function abortOnParsingError (msg) {
  o.inDic.errors = true
  o.inDic.pb.clear()
  console.error(msg)
  process.exit(1)
}
/******************************************************************************/
// remove auxiliary code spaces in template strings

function xs (strings, ...expressions) {
  const firstIndentRE = /\n +/
  const indentSize =
    firstIndentRE.exec(strings.find(str => firstIndentRE.test(str)))[0].length -
    1

  const xLfRE = /^\n|\n$/g
  const xSpRE = new RegExp(`\n {0,${indentSize}}`, 'g')

  if (!expressions.length) { return strings[0].replace(xSpRE, '\n').replace(xLfRE, '') }

  return strings
    .reduce(
      (acc, str, i) =>
        (i === 1 ? acc.replace(xSpRE, '\n') : acc) +
        expressions[i - 1] +
        str.replace(xSpRE, '\n')
    )
    .replace(xLfRE, '')
}
/******************************************************************************/
// progress bar

function pb (edge = 0) {
  const DEFAULT_FREQ = 500
  const HUNDRED_PERCENT = 100
  const PB_LENGTH = 50
  const PB_SCALE = HUNDRED_PERCENT / PB_LENGTH

  function clearLine () {
    o.rl.cursorTo(process.stdout, 0)
    o.rl.clearLine(process.stdout, 0)
  }

  return {
    edge,
    stat: 0,

    start (freq = DEFAULT_FREQ) {
      this.updater = setInterval(() => {
        this.update()
      }, freq)
    },

    update (stat = this.stat) {
      let statPercent = Math.ceil(stat / this.edge * HUNDRED_PERCENT)
      if (statPercent > HUNDRED_PERCENT) statPercent = HUNDRED_PERCENT

      const barsNumber = Math.floor(statPercent / PB_SCALE)
      const padsNumber = PB_LENGTH - barsNumber

      clearLine()
      process.stdout.write(
        `${'█'.repeat(barsNumber)}${' '.repeat(padsNumber)} ${statPercent}%`
      )
    },

    end () {
      clearInterval(this.updater)
      this.stat = this.edge
      this.update()
      console.log('\n')
    },

    clear () {
      clearInterval(this.updater)
      clearLine()
    }
  }
}
/******************************************************************************/
/******************************************************************************/
/******************************************************************************/
