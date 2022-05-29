#!/usr/bin/env node

// Command line:
/*
[Main]
node nodereplacer.js -rd list input.txt output.txt
node nodereplacer.js (-rt|-re) list input.txt output.txt
node nodereplacer.js -rg list input.txt output.txt
node nodereplacer.js -rs list -[A-Za-z]{1,10} input.txt output.txt
node nodereplacer.js (input.gls|output.ifo)
node nodereplacer.js -ctags input.txt output.txt
node nodereplacer.js -d input.txt output.txt
node nodereplacer.js -m -((a|a1|a2|l|l1|l2|r|r1|r2) | (a|a1|a2|l|l1|l2|r|r1|r2) list.txt) input.txt output.txt
node nodereplacer.js -pile input.txt output.txt
node nodereplacer.js -susp input.txt output.txt
node nodereplacer.js (-symb|-symb -f) input.txt output.txt
node nodereplacer.js -sort -(b|o|bi|bie|oi|oie|bd|od|bdc|odc) input.txt output.txt
node nodereplacer.js (-usort|-usort -i) input.txt output.txt
node nodereplacer.js -stags input.txt output.txt
node nodereplacer.js (-base64|-base64 -i) input.txt output.txt
node nodereplacer.js -rb -(dsl1|dsl2|dslm1|dslm2|gls|glsm) input.txt output.txt
node nodereplacer.js -t input.txt output.txt
node nodereplacer.js (-chkdsl|-chkdsl -t) input.txt output.txt
node nodereplacer.js -mgls input.txt output.txt
*/

/*
[Ad hoc]
node nodereplacer.js -recm "path\to\folder" (|processor.js|"C:\Path\To\Processor.js") output
node nodereplacer.js -retag (|-(gls|re|rt)) input.txt output.txt
node nodereplacer.js -cut -(t|d|g|b)\d+ input.txt output.txt
node nodereplacer.js -cut -(t|d|g)\d+% input.txt out.txt
node nodereplacer.js -cut -(t|d|g)\d+%,\d+%... input.txt out.txt
node nodereplacer.js -cut -(t|d|g)\d+%(2-9|10) input.txt out.txt.part1
node nodereplacer.js -dt input.txt output.txt
node nodereplacer.js -(recc|rec2|rec5) "path\to\folder" output
node nodereplacer.js -im morpholist.txt input.gls output.gls
node nodereplacer.js -title input_abrv.dsl input.txt output.txt
node nodereplacer.js -sdu -tab1 input.idx output.txt
node nodereplacer.js -sdu -tab2 input.dict.dz output.txt
node nodereplacer.js -sdu -(tab3|tab4) input.dsl output.txt
node nodereplacer.js -sdu -test=input.dz input_tab.txt output.txt
node nodereplacer.js -htmldump 'regular expression' input.txt output.txt
node nodereplacer.js -rd db.js input.txt output.txt
*/

'use strict'
const hrstart = process.hrtime()
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const crypto = require('crypto')

let mod_path

let MEMORY_USAGE

const o = Object.create(null)
o.res = []
o.arr = []
o.tab = Object.create(null)
o.eol = '\n'
o.bom = '\uFEFF'
o.log = []
o.path = __dirname
o.mode = 'by_dsl_article'
o.loop = 0
o.utils = require(__dirname + '/files/rep_modules/utils/').utils()
o.utilspath = __dirname + '/files/rep_modules/utils/'
o.eol_mode = 0
o.in_encoding = 'utf8'
o.progress_bar = true
o.progress_bar_title = ''

o.et_auto = true
o.et_show = () => {
  const hrend = process.hrtime(hrstart)
  console.log(
    `\n\nExecution time: ${hrend[0]}.${Math.floor(hrend[1] / 1000000)}\n`
  )
}

class offset_eol {
  constructor (
    inputfile,
    in_encoding,
    outputfile,
    out_encoding,
    fileSize,
    writer_buffering_size
  ) {
    this.inputfile = inputfile
    this.in_encoding = in_encoding
    this.outputfile = outputfile
    this.out_encoding = out_encoding
    this.arr = []
    this.ifd = fs.openSync(inputfile, 'r')
    this.data = ''
    this.index = -1
    this.last = undefined
    this.fileSize = fileSize
    this.eof = false
    this.eof_protected = false
    this.buffer_arr = []
    this.writer_disk_access_counter = 0
    this.reader_disk_access_counter = 0
    this.writer_buffering_size = writer_buffering_size
    this.trim_endings = hex => {
      return hex
        .match(/([\w]{2})/g)
        .filter(val => {
          return val === '0a' || val === '0d'
        })
        .join('')
    }
  }

  get_writer_disk_access_counter () {
    return this.writer_disk_access_counter
  }

  save_reader_disk_access_counter (i) {
    this.reader_disk_access_counter = i
  }

  get_reader_disk_access_counter () {
    return this.reader_disk_access_counter
  }

  file_end () {
    if (this.eof_protected === false) {
      this.eof = true
      this.eof_protected = true
    }
  }

  addtoarr (data) {
    this.arr.push([data[0], data[2]])
  }

  setlast (data) {
    this.last = data
  }

  getlast () {
    return this.last
  }

  getlength () {
    return this.arr.length
  }

  getindex () {
    return this.index
  }

  next () {
    if (this.index + 1 >= this.arr.length) return false
    this.index++
    return true
  }

  split_line (line) {
    if (/^[^\r\n]*[\r\n]*$/.test(line)) {
      const [, str, eol] = line.match(/^([^\r\n]*)([\r\n]*)$/)
      return { str: str, eol: eol }
    } else {
      return { str: line, eol: '' }
    }
  }

  get (split) {
    try {
      if (!this.eof) {
        throw new Error(
          `\nThe error occurred after calling the method "get" (object o.idata).\nThis operation is not allowed while the function "byline" reading input file.`
        )
      }

      let inbuffer = this.buffer_arr.shift()

      if (inbuffer !== undefined) {
        if (this.index === 0) inbuffer = inbuffer.replace(/^\uFEFF/, '')

        if (split === true) {
          return this.split_line(inbuffer)
        } else {
          return inbuffer
        }
      } else {
        const v = this.arr[this.index]

        if (!v) {
          throw new Error('\nthis.arr[this.index] return ' + v)
        }

        const offset = v[0]
        const eol = v[1]

        let len

        if (this.writer_buffering_size) {
          len = this.arr[this.index + this.writer_buffering_size]
        } else {
          len = undefined
        }

        if (len) {
          const size = len[0] - offset
          const buf = Buffer.alloc(size)
          fs.readSync(this.ifd, buf, 0, size, offset)
          this.writer_disk_access_counter++
          const str = buf.toString(this.in_encoding)
          this.buffer_arr = str.match(/([^\r\n]*[\r\n]+|[^\r\n]+[\r\n]*)/g)
          let line = this.buffer_arr.shift()
          if (this.index === 0) line = line.replace(/^\uFEFF/, '')

          if (split === true) {
            return this.split_line(line)
          } else {
            return line
          }
        } else {
          const n = this.arr[this.index + 1]

          if (n) {
            var size =
              n[0] - (offset + Buffer.byteLength(eol, this.in_encoding))
          } else {
            var size =
              this.fileSize -
              (offset + Buffer.byteLength(eol, this.in_encoding))
          }

          const buf = Buffer.alloc(size)
          fs.readSync(this.ifd, buf, 0, size, offset)
          this.writer_disk_access_counter++
          let str = buf.toString(this.in_encoding)
          if (this.index === 0) str = str.replace(/^\uFEFF/, '')

          if (split === true) {
            return { str: str, eol: eol }
          } else {
            return `${str}${eol}`
          }
        }
      }
    } catch (e) {
      console.error('\n\n' + e)
      process.exit()
    }
  }

  change_outputfile (outputfile) {
    this.outputfile = outputfile
  }

  write (str) {
    fs.writeFileSync(this.outputfile, str, {
      encoding: this.out_encoding,
      flag: 'a'
    })
  }
}

let LISTJS

let byteCount = 0
let fileSize = 0
let errorCount = 0

function guessEncoding (path) {
  const BOM_0 = 0xff
  const BOM_1 = 0xfe

  try {
    const fd = fs.openSync(path, 'r')
    const bf = Buffer.alloc(2)
    fs.readSync(fd, bf, 0, 2, 0)
    fs.closeSync(fd)
    return bf[0] === BOM_0 && bf[1] === BOM_1 ? 'utf16le' : 'utf8'
  } catch (e) {
    console.error(`Error: ${e.message}.`)
    return null
  }
}

function updateProgressBar () {
  if (!fileSize || !byteCount) return
  let readPercent = Math.ceil((byteCount / fileSize) * 100)
  if (readPercent > 100) readPercent = 100
  const barsNumber = Math.floor(readPercent / 2)
  const padsNumber = 50 - barsNumber
  readline.cursorTo(process.stdout, 0)
  readline.clearLine(process.stdout, 0)
  if (readPercent) {
    process.stdout.write(
      `${'█'.repeat(barsNumber)}${' '.repeat(padsNumber)} ${readPercent}%`
    )
  }
}

function removecommentedpart (s) {
  s = s.replace(/(\\*)(\{\{[^]*?\}\})/g, (a, m1, m2) => {
    if (m1.length % 2 === 0) m2 = ''
    return m1 + m2
  })

  return s
}

function escapeRegExp (str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')
}

function escapeDQ (str) {
  return str.replace(/"/g, '\\"')
}

function escapeSlash (str) {
  str = str.replace(/^\//g, '\\/')

  while (/[^\\]\//.test(str)) {
    str = str.replace(/([^\\])\//g, '$1\\/')
  }

  return str
}

function fileExists (filePath) {
  try {
    return fs.statSync(filePath).isFile()
  } catch (err) {
    return false
  }
}

function checkDirectorySync (directory) {
  try {
    fs.statSync(directory)
  } catch (e) {
    fs.mkdirSync(directory)
  }
}

function escape_odd_slash (s) {
    s = s.replace(/(\\*)/g, function (a, m1) {
      if (m1.length % 2 === 1) m1 = m1 + '\x5c'
      return m1
    })

    return s
}

function buildfunctionbody (InputFileName, cb) {
  let m
  let code = ''

  const head = fs.readFileSync(__dirname + '/files/head.js', 'utf8').toString()
  const foot = fs.readFileSync(__dirname + '/files/foot.js', 'utf8').toString()

  code += head

  let encoding = guessEncoding(InputFileName)

  const reader = readline.createInterface({
    input: fs.createReadStream(InputFileName, encoding),
    terminal: false,
    historySize: 0,
    output: null,
    crlfDelay: Infinity
  })

  let dir = __dirname + '/files/rep_modules/main'

  checkDirectorySync(dir)

  let Output

  if (
    process['dev_argv'].rush === 'yes' ||
    process['dev_argv'].parallel === 'yes'
  ) {

    const hrTime = process.hrtime()

    const id = crypto.randomBytes(16).toString('hex')

    mod_path =
      __dirname +
      `/files/rep_modules/main/index_${hrTime[0] * 1000000 +
        hrTime[1] / 1000}_${id}.js`

    Output = fs.openSync(mod_path, 'w')
  } else {
    Output = fs.openSync(__dirname + '/files/rep_modules/main/index.js', 'w')
  }

  reader
    .on('line', line => {
      line = line.replace(/^\uFEFF/, '')

      if (/^\/\//.test(line) === true) {
        code += line + '\n'
      } else if ((m = /^(.+?)\t\|\t(.*)$/.exec(line))) {
        code += 's = s.replace('
        code += '/' + escapeRegExp(m[1]) + '/g, ' + 'String.raw`' + escape_odd_slash(m[2]) + '`'
        code += ');\n'
      } else if ((m = /^(.+?)\t\|(i?)\|\t(.*)$/.exec(line))) {
        code += 's = s.replace('
        code +=
          '/' +
          escapeSlash(m[1]) +
          '/umg' +
          m[2] +
          ', ' +
          '"' +
          escapeDQ(m[3]) +
          '"'
        code += ');\n'
      } else {
        code += line + '\n'
      }
    })
    .on('close', () => {
      code += foot
      fs.writeSync(Output, code, null, 'utf8')
      if (
        process['dev_argv'].rush === 'yes' ||
        process['dev_argv'].parallel === 'yes'
      ) {
        LISTJS = require(mod_path)
      } else {
        LISTJS = require(dir)
      }
      cb()
    })
}

function entirefile () {
  o.loop++

  o.RunOnExit = false
  o.RunOnStart = false
  o.RunOnExitAsync = undefined

  o.eol = ''

  if (o.repeat !== undefined) delete o.repeat

  o.in_encoding = guessEncoding(o.inputfile)

  if (o.out_encoding === undefined) o.out_encoding = o.in_encoding

  if (o.outputfile) var Output = fs.openSync(o.outputfile, 'w')

  if (o.loop === 1) {
    try {
      fs.unlinkSync(o.error_log_path)
    } catch (e) {}
  }

  let s = fs.readFileSync(o.inputfile, o.in_encoding).toString()

  o.count = 1

  s = LISTJS.ProcessString(s, o)

  if (o.stop !== undefined) {
    console.log()
    console.log(o.stop)
    if (o.outputfile) fs.closeSync(Output)
    process.exit()
  }

  if (o.outputfile) fs.writeSync(Output, s + o.eol, null, o.out_encoding)

  o.RunOnStart = false
  o.RunOnExit = true
  o.RunOnExitAsync = undefined

  LISTJS.ProcessString(null, o)

  if (o.outputfile) {
    for (let i = 0; i < o.res.length; i++) {
      if (o.res[i] !== null) {
        fs.writeSync(Output, o.res[i] + o.eol, null, o.out_encoding)
      }
    }
  }

  if (o.log.length > 0) console.log(`\n\n${o.log.join('\n')}`)

  if (!o.repeat && o.et_auto) {
    o.et_show()
  } else {
    if (o.progress_bar) console.log('\n\n')
  }

  if (o.repeat === 'entirefile') {
    o.entirefile()
  }

  if (o.repeat === 'by_gls_article') {
    o.by_gls_article()
  }

  if (o.repeat === 'by_dsl_article') {
    o.by_dsl_article()
  }

  if (o.repeat === 'byline') {
    o.byline()
  }
}

function byline () {
  fileSize = fs.statSync(o.inputfile)['size']

  o.loop++

  if (o.repeat !== undefined) delete o.repeat

  o.RunOnExit = false
  o.RunOnStart = false
  o.RunOnExitAsync = undefined

  let lineCount = 0
  byteCount = 0

  o.in_encoding = guessEncoding(o.inputfile)
  if (o.out_encoding === undefined) o.out_encoding = o.in_encoding

  if (o.eol_mode > 0) {
    delete o.idata
    o.idata = new offset_eol(
      o.inputfile,
      o.in_encoding,
      o.outputfile,
      o.out_encoding,
      fileSize,
      100
    )
    var eol_reader = require(o.utilspath + 'readlineEOLreader.js').reader(
      o.in_encoding,
      o.inputfile,
      fileSize,
      16384
    )
  }

  const fd = fs.openSync(o.inputfile, 'r')

  const reader = readline.createInterface({
    input: fs.createReadStream(o.inputfile, o.in_encoding),
    terminal: false,
    historySize: 0,
    output: null,
    crlfDelay: Infinity
  })

  if (o.outputfile) var Output = fs.openSync(o.outputfile, 'w')

  if (o.outputfile) fs.writeSync(Output, o.bom, null, o.out_encoding)

  if (o.progress_bar) {
    process.stdout.write(o.progress_bar_title)
    var updater = setInterval(updateProgressBar, 100)
  }

  if (o.loop === 1) {
    try {
      fs.unlinkSync(o.error_log_path)
    } catch (e) {}
  }

  reader
    .on('line', line => {
      if (o.stop !== undefined) {
        console.log()
        console.log(o.stop)
        if (o.outputfile) fs.closeSync(Output)
        process.exit()
      }

      lineCount++

      if (o.eol_mode > 0) {
        var lineinfo = []
        lineinfo.push(byteCount)
      }

      const len = Buffer.byteLength(line, o.in_encoding)

      byteCount += len

      if (lineCount === 1) line = line.replace(/^\uFEFF/, '')

      if (o.eol_mode > 0) {
        lineinfo.push(len)
        o.eol = eol_reader.get_eol(byteCount)
        lineinfo.push(o.eol)

        if (o.eol_mode === 1) {
          o.idata.setlast(lineinfo)
        } else {
          o.idata.addtoarr(lineinfo)
        }

        byteCount += Buffer.byteLength(o.eol, o.in_encoding)
      } else {
        byteCount += 1
      }

      o.count = lineCount

      line = LISTJS.ProcessString(line, o)

      if (line !== null && o.outputfile) {
        fs.writeSync(Output, line + o.eol, null, o.out_encoding)
      }
    })
    .on('close', () => {
      if (o.eol_mode > 0) {
        o.idata.file_end()
        o.idata.save_reader_disk_access_counter(
          eol_reader.get_disk_access_counter()
        )
      }

      if (o.progress_bar) clearInterval(updater)

      byteCount = fileSize

      if (o.progress_bar) updateProgressBar()

      o.count = lineCount

      o.RunOnStart = false
      o.RunOnExit = true
      o.RunOnExitAsync = undefined

      LISTJS.ProcessString(null, o)

      if (o.outputfile) {
        for (let i = 0; i < o.res.length; i++) {
          if (o.res[i] !== null) {
            fs.writeSync(Output, o.res[i] + o.eol, null, o.out_encoding)
          }
        }
      }

      if (o.log.length > 0) console.log(`\n\n${o.log.join('\n')}`)

      if (!o.repeat) {
        if (!o.repeat && o.et_auto) {
          o.et_show()
        }
      } else {
        if (o.progress_bar) console.log('\n\n')
      }

      if (o.repeat === 'entirefile') {
        o.entirefile()
        return
      }

      if (o.repeat === 'by_gls_article') {
        o.by_gls_article()
        return
      }

      if (o.repeat === 'by_dsl_article') {
        o.by_dsl_article()
        return
      }

      if (o.repeat === 'byline') {
        o.byline()
        return
      }

      if (!o.repeat) {
        o.RunOnStart = false
        o.RunOnExit = false
        o.RunOnExitAsync = 'run'
        LISTJS.ProcessString(null, o)
      }
    })
}

function parseLine (line) {
  let m
  let re = /([^]*?)(\\*)(\{\{|\}\})/y
  let e
  let l

  while ((m = re.exec(line))) {
    if (m[2].length % 2 === 1) {
      continue
    }

    if (m[3] === '}}') {
      l = [false, re.lastIndex]
      if (!e) {
        e = [true, re.lastIndex]
      }
    } else {
      l = [true, re.lastIndex]
      if (!e) {
        e = [false, re.lastIndex]
      }
    }
  }

  let r = [
    [false, undefined, undefined],
    [false, undefined]
  ]

  if (e) {
    r[0][0] = true
    r[0][1] = e[0]
    r[0][2] = e[1]
  }

  if (l && l[0]) {
    r[1][0] = l[0]
    r[1][1] = l[1]
  }

  // Описание ответа:
  // r[0][0] - информация о наличие закрытие тега {{
  // r[0][1] - если true, то тег закрылся нормально. Нет - значит через {{
  // r[0][2] - позиция закрывающего относительно начала строки

  // r[1][0] - закончилась ли строка открывающим тегом
  // r[1][1] - если да, то передаётся и позиция этого тега

  return r
}

function ProcessDSLArticle (art0, art1, o, art_num, art_start) {
  let hw1 = []
  let info = [0, 0, 0]
  // [0] - счётчик заголовков, [1] - счётчик непустых строк в теле статьи

  for (let i = 0; i < art1.length; i++) {
    if (/^[^\t\x20]/.test(art1[i])) {
      info[0]++
      hw1.push(art1[i].replace(/[\t ]{2, }/g, ' ').trim())
    } else if (/^[\t\x20]+[^\t\x20\n]/.test(art1[i])) {
      if (info[1] === 0) info[2] = i

      info[1]++
    }
  }

  // Заголовков нет
  if (info[0] === 0) {
    fs.writeFileSync(
      o.error_log_path,
      `Error: Empty entry headword. Line: ${art_start}\n`,
      {
        encoding: 'utf8',
        flag: 'a'
      }
    )
    errorCount++
  }

  // Тела нет
  if (info[1] === 0) {
    fs.writeFileSync(
      o.error_log_path,
      `Error: Empty card. Line: ${art_start}\n`,
      {
        encoding: 'utf8',
        flag: 'a'
      }
    )
    errorCount++
  }

  let artstr = art0.join('\n')

  if (info[0] > 0 && info[1] > 0) {
    let hw0 = art0.slice(0, info[2])
    let body = art0.slice(info[2])

    o.dsl = []

    o.dsl.push(hw0)
    // o.dsl.push(body.join("\n").replace(/\n$/, ""));
    o.dsl.push(body.join('\n'))
    o.dsl.push(hw1)
    o.dsl.push(body)

    if (process.argv[2] === '-rs') {
      artstr = symbrep(artstr, o)
    } else {
      artstr = LISTJS.ProcessString(artstr, o)
    }
  }

  return artstr
}

function by_dsl_article () {
  o.loop++

  if (o.repeat !== undefined) delete o.repeat

  o.RunOnStart = false
  o.RunOnExit = false
  o.RunOnExitAsync = undefined

  let commLines = []

  let lineCount = 0

  let art_start = 0

  byteCount = 0

  let articleCount = 0

  o.in_encoding = guessEncoding(o.inputfile)
  if (o.out_encoding === undefined) o.out_encoding = o.in_encoding

  fileSize = fs.statSync(o.inputfile)['size']

  const reader = readline.createInterface({
    input: fs.createReadStream(o.inputfile, o.in_encoding),
    terminal: false,
    historySize: 0,
    output: null,
    crlfDelay: Infinity
  })

  if (o.outputfile) var output = fs.openSync(o.outputfile, 'w')

  let flag = 0

  let art0 = []
  let art1 = []
  let lines = []

  if (o.outputfile) fs.writeSync(output, o.bom, null, o.out_encoding)

  if (o.progress_bar) {
    process.stdout.write(o.progress_bar_title)
    var updater = setInterval(updateProgressBar, 100)
  }

  if (o.loop === 1) {
    try {
      fs.unlinkSync(o.error_log_path)
    } catch (e) {}
  }

  reader
    .on('line', line => {
      if (o.stop !== undefined) {
        console.log()
        console.log(o.stop)
        if (o.outputfile) fs.closeSync(output)
        process.exit()
      }

      lineCount++

      byteCount += Buffer.byteLength(line, o.in_encoding) + 1

      if (lineCount === 1) line = line.replace(/^\uFEFF/, '')

      let r = parseLine(line)

      // Описание ответа:
      // r[0][0] - информация о наличие закрытие тега {{
      // r[0][1] - если true, то тег закрылся нормально. Нет - значит через {{
      // r[0][2] - позиция закрывающего относительно начала строки

      // r[1][0] - закончилась ли строка открывающим тегом
      // r[1][1] - если да, то передаётся и позиция этого тега

      if (commLines.length > 0) {
        if (r[0][0] && !r[0][1] && r[1][0]) {
          // {{ ... {{

          lines.push(...commLines)
          commLines.length = 0
          commLines.push([lineCount, line])
        } else if (r[0][0] && !r[0][1] && !r[1][0]) {
          // {{ ...

          lines.push(...commLines)
          commLines.length = 0
          lines.push([lineCount, line])
        } else if (r[0][0] && r[0][1] && !r[1][0]) {
          // }} ...

          commLines.push([lineCount, line])
          lines.push(commLines.shift())
          while (commLines.length > 0) {
            lines[lines.length - 1][1] += '\n' + commLines.shift()[1]
          }
        } else if (r[0][0] && r[0][1] && r[1][0]) {
          // }} ... {{

          while (commLines.length > 1) {
            let last = commLines.pop()
            commLines[commLines.length - 1][1] += '\n' + last[1]
          }

          commLines.push([lineCount, line])
        } else {
          commLines.push([lineCount, line])
        }
      } else {
        if (r[1][0]) {
          commLines.push([lineCount, line])
        } else {
          lines.push([lineCount, line])
        }
      }

      while (lines.length) {
        let s = []
        let l = lines.shift()
        let n = l[0]
        s[0] = l[1]
        s[1] = removecommentedpart(s[0])

        if (/^#/.test(s[1]) && flag === 0) {
          if (o.outputfile)
            fs.writeSync(output, `${s[0]}\n`, null, o.out_encoding)
        } else if (/^\s*$/.test(s[1]) && flag === 0) {
          if (o.outputfile)
            fs.writeSync(output, `${s[0]}\n`, null, o.out_encoding)
        } else if (s[1] === '' && flag !== 0) {
          art0.push(s[0])
          art1.push(s[1])
          if (flag === 2) flag++
        } else if (
          (/^[^\t ].*$/.test(s[1]) && flag !== 1) ||
          (/^[\t ].*[^\t ].*$/.test(s[1]) && (art1.length === 0 || flag === 3))
        ) {
          if (art0.length > 0) {
            articleCount++
            o.count = articleCount
            o.art_start = art_start

            const res = ProcessDSLArticle(
              art0,
              art1,
              o,
              articleCount,
              art_start
            )

            if (res !== null) {
              if (o.outputfile)
                fs.writeSync(output, res + o.eol, null, o.out_encoding)
            }
          }

          art_start = n

          art0.length = 0
          art1.length = 0

          art0.push(s[0])
          art1.push(s[1])

          if (/^[^\t ].*$/.test(s[1])) {
            flag = 1
          } else {
            flag = 2
          }
        } else {
          art0.push(s[0])
          art1.push(s[1])

          if (/^[^\t ].*$/.test(s[1])) {
            flag = 1
          } else {
            flag = 2
          }
        }
      }
    })
    .on('close', () => {
      lines.push(...commLines)
      commLines.length = 0

      while (lines.length) {
        let s = []
        let l = lines.shift()
        let n = l[0]
        s[0] = l[1]
        s[1] = removecommentedpart(s[0])

        if (/^#/.test(s[1]) && flag === 0) {
          if (o.outputfile)
            fs.writeSync(output, `${s[0]}\n`, null, o.out_encoding)
        } else if (/^\s*$/.test(s[1]) && flag === 0) {
          if (o.outputfile)
            fs.writeSync(output, `${s[0]}\n`, null, o.out_encoding)
        } else if (s[1] === '' && flag !== 0) {
          art0.push(s[0])
          art1.push(s[1])
          if (flag === 2) flag++
        } else if (
          (/^[^\t ].*$/.test(s[1]) && flag !== 1) ||
          (/^[\t ].*[^\t ].*$/.test(s[1]) && (art1.length === 0 || flag === 3))
        ) {
          if (art0.length > 0) {
            articleCount++
            o.count = articleCount
            o.art_start = art_start

            const res = ProcessDSLArticle(
              art0,
              art1,
              o,
              articleCount,
              art_start
            )

            if (res !== null) {
              if (o.outputfile)
                fs.writeSync(output, res + o.eol, null, o.out_encoding)
            }
          }

          art_start = n

          art0.length = 0
          art1.length = 0

          art0.push(s[0])
          art1.push(s[1])

          if (/^[^\t ].*$/.test(s[1])) {
            flag = 1
          } else {
            flag = 2
          }
        } else {
          art0.push(s[0])
          art1.push(s[1])

          if (/^[^\t ].*$/.test(s[1])) {
            flag = 1
          } else {
            flag = 2
          }
        }
      }

      if (art0.length > 0) {
        articleCount++
        o.count = articleCount
        o.art_start = art_start

        const res = ProcessDSLArticle(art0, art1, o, articleCount, art_start)

        if (res !== null) {
          if (o.outputfile)
            fs.writeSync(output, res + o.eol, null, o.out_encoding)
        }

        art0.length = 0
        art1.length = 0
      }

      if (o.progress_bar) clearInterval(updater)

      byteCount = fileSize

      if (o.progress_bar) updateProgressBar()

      o.RunOnStart = false
      o.RunOnExit = true
      o.RunOnExitAsync = undefined

      LISTJS.ProcessString(null, o)

      if (o.outputfile) {
        for (let i = 0; i < o.res.length; i++) {
          if (o.res[i] !== null) {
            fs.writeSync(output, o.res[i] + o.eol, null, o.out_encoding)
          }
        }
      }

      if (o.log.length > 0) console.log(`\n\n${o.log.join('\n')}`)

      if (!o.repeat && o.et_auto) {
        o.et_show()
      } else {
        if (o.progress_bar) console.log('\n\n')
      }

      if (errorCount > 0) {
        console.log('Number of Errors: ' + errorCount + ' (Check error.log)')
      }

      if (o.repeat === 'entirefile') {
        o.entirefile()
      }

      if (o.repeat === 'by_gls_article') {
        o.by_gls_article()
      }

      if (o.repeat === 'by_dsl_article') {
        o.by_dsl_article()
      }

      if (o.repeat === 'byline') {
        o.byline()
      }
    })
}

function ProcessGLSArticle (artarr, o, art_start) {
  let artstr = artarr.join('\n')

  o.gls = artarr

  o.gls.push(art_start)

  artstr = LISTJS.ProcessString(artstr, o)

  return artstr
}

function by_gls_article () {
  let writeEmptylines = true

  o.loop++

  if (o.repeat !== undefined) delete o.repeat

  o.RunOnStart = false
  o.RunOnExit = false
  o.RunOnExitAsync = undefined

  let lineCount = 0
  byteCount = 0
  let articleCount = 0

  fileSize = fs.statSync(o.inputfile)['size']

  o.in_encoding = guessEncoding(o.inputfile)
  o.out_encoding = 'utf8'

  const reader = readline.createInterface({
    input: fs.createReadStream(o.inputfile, o.in_encoding),
    terminal: false,
    historySize: 0,
    output: null,
    crlfDelay: Infinity
  })

  if (o.outputfile) var Output = fs.openSync(o.outputfile, 'w')

  let flag = 0
  let arr = []
  let hist = []
  let art_start = 1

  if (o.outputfile) fs.writeSync(Output, o.bom, null, o.out_encoding)

  if (o.progress_bar) {
    process.stdout.write(o.progress_bar_title)
    var updater = setInterval(updateProgressBar, 100)
  }

  if (o.loop === 1) {
    try {
      fs.unlinkSync(o.error_log_path)
    } catch (e) {}
  }

  reader
    .on('line', line => {
      if (o.stop !== undefined) {
        console.log()
        console.log(o.stop)
        if (o.outputfile) fs.closeSync(Output)
        process.exit()
      }

      lineCount++

      byteCount += Buffer.byteLength(line, o.in_encoding) + 1

      if (lineCount === 1) line = line.replace(/^\uFEFF/, '')

      line = line.trim()

      if (hist.length > 3) hist.shift()
      hist.push(line)

      if (flag === 0 && /^[^#]/.test(line)) {
        flag = 1
      }

      if (flag === 1) {
        if (line === '') {
          if (
            (arr.length === 2 && hist.length === 4 && hist[0] === '') ||
            (arr.length === 2 && hist.length < 4)
          ) {
            articleCount++
            o.count = articleCount

            const res = ProcessGLSArticle(arr, o, art_start)

            if (res !== null) {
              writeEmptylines = true

              if (o.outputfile) {
                fs.writeSync(Output, res + o.eol, null, o.out_encoding)
                fs.writeSync(Output, '\n', null, o.out_encoding)
              }
            } else {
              writeEmptylines = false
            }
          } else {
            if (o.outputfile) {
              for (let v of arr) {
                fs.writeSync(Output, `${v}\n`, null, o.out_encoding)
              }
            }

            if (writeEmptylines) {
              if (o.outputfile) fs.writeSync(Output, '\n', null, o.out_encoding)
            }

            // if (o.outputfile)
            //   fs.writeSync(Output, '\n', null, o.out_encoding);

            if (o.loop === 1 && arr.length !== 0) {
              fs.writeFileSync(
                o.error_log_path,
                'Format error on line ' + art_start + '\n',
                {
                  encoding: 'utf8',
                  flag: 'a'
                }
              )
              errorCount++
            }
          }

          arr.length = 0
          art_start = lineCount + 1
        } else {
          arr.push(line)
        }
      } else {
        if (o.outputfile)
          fs.writeSync(Output, `${line}\n`, null, o.out_encoding)
      }
    })
    .on('close', () => {
      if (arr.length === 2) {
        articleCount++
        o.count = articleCount

        const res = ProcessGLSArticle(arr, o, art_start)

        if (res !== null && o.outputfile) {
          fs.writeSync(Output, res + o.eol, null, o.out_encoding)
        }
      } else {
        if (o.outputfile) {
          for (let v of arr) {
            fs.writeSync(Output, `${v}` + o.eol, null, o.out_encoding)
          }
        }

        if (o.loop === 1 && arr.length !== 0) {
          fs.writeFileSync(
            o.error_log_path,
            'Format error on line ' + art_start + '\n',
            {
              encoding: 'utf8',
              flag: 'a'
            }
          )
          errorCount++
        }
      }

      if (o.progress_bar) clearInterval(updater)

      byteCount = fileSize

      if (o.progress_bar) updateProgressBar()

      arr.length = 0

      o.RunOnStart = false
      o.RunOnExit = true
      o.RunOnExitAsync = undefined

      LISTJS.ProcessString(null, o)

      if (o.outputfile) {
        for (let i = 0; i < o.res.length; i++) {
          if (o.res[i] !== null) {
            fs.writeSync(Output, o.res[i] + o.eol, null, o.out_encoding)
          }
        }
      }

      if (o.log.length > 0) console.log(`\n\n${o.log.join('\n')}`)

      if (!o.repeat && o.et_auto) {
        o.et_show()
      } else {
        if (o.progress_bar) console.log('\n\n')
      }

      if (errorCount > 0) {
        console.log('Number of Errors: ' + errorCount + ' (Check error.log)')
      }

      if (o.repeat === 'entirefile') {
        o.entirefile()
      }

      if (o.repeat === 'by_gls_article') {
        o.by_gls_article()
      }

      if (o.repeat === 'by_dsl_article') {
        o.by_dsl_article()
      }

      if (o.repeat === 'byline') {
        o.byline()
      }
    })
}

function symbrep (s) {
  let m

  const name = process.argv[4].replace(/^-(.*)$/, '$1')

  s = s.replace(/,/g, '&#44;')

  const rr1 = new RegExp('(\\[' + name + '\\])', 'ig')
  const rr2 = new RegExp('(\\[\\/' + name + '\\])', 'ig')

  s = s.replace(rr1, ',$1')
  s = s.replace(rr2, '$1,')

  let temparr = s.split(',')

  for (let i = 0; i < temparr.length; i++) {
    const rm = new RegExp(
      '^(\\[' + name + '\\])([\\s\\S]*)(\\[\\/' + name + '\\])$',
      'im'
    )

    if ((m = rm.exec(temparr[i]))) {
      const ot = m[1]
      let between = m[2]
      const ct = m[3]
      between = between.replace(/\&\#44;/g, ',')

      between = LISTJS.ProcessString(between, o)

      temparr[i] = ot + between + ct
      temparr[i] = temparr[i].replace(/\&\#44;/g, ',')
    }
  }

  s = temparr.join('')
  temparr.length = 0

  s = s.replace(/\&\#44;/g, ',')
  return s
}

function prepare (InputFileName, OutputFileName) {
  o.res = []
  o.inputfile = InputFileName
  o.outputfile = OutputFileName
  o.path = __dirname
  o.eol = '\n'

  o.byline = () => {
    byline()
  }

  o.by_gls_article = () => {
    by_gls_article()
  }

  o.by_dsl_article = () => {
    by_dsl_article()
  }

  o.entirefile = () => {
    entirefile()
  }

  if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
    o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
  } else {
    o.error_log_path = 'error.log'
  }

  o.RunOnExit = false
  o.RunOnStart = false
  o.RunOnExitAsync = 'check'

  {
    const res = LISTJS.ProcessString(null, o)
    if (res === true) {
      o.eol_mode = 2
      o.et_auto = false
    }
  }

  o.RunOnExit = false
  o.RunOnStart = true
  o.RunOnExitAsync = undefined

  const res = LISTJS.ProcessString(null, o)

  if (res !== true) {
    if (o.inputfile === null || o.outputfile === null) {
      o.RunOnExit = false
      o.RunOnStart = false
      o.RunOnExitAsync = undefined

      LISTJS.ProcessString(null, o)

      o.RunOnStart = false
      o.RunOnExit = true
      o.RunOnExitAsync = undefined

      LISTJS.ProcessString(null, o)

      if (o.out_encoding === undefined) o.out_encoding = o.in_encoding

      if (o.outputfile !== null) {
        fs.writeFileSync(o.outputfile, '', {
          encoding: o.out_encoding,
          flag: 'w'
        })

        for (let i = 0; i < o.res.length; i++) {
          if (o.res[i] !== null) {
            fs.writeFileSync(o.outputfile, o.res[i] + o.eol, {
              encoding: o.out_encoding,
              flag: 'a'
            })
          }
        }
      }
    } else if (o.mode === 'entirefile') {
      o.entirefile()
    } else if (o.mode === 'byline') {
      o.byline()
    } else if (o.mode === 'by_gls_article') {
      o.by_gls_article()
    } else {
      o.by_dsl_article()
    }
  }
}

let pluginPath

process['dev_argv'] = Object.create(null)

process.argv = process.argv.filter(argv => {
  if (/^--.*$/i.test(argv)) {
    let m
    if ((m = /^--(\w+)=([\w\-]+)$/i.exec(argv))) {
      process['dev_argv'][m[1]] = m[2]
    }

    return false
  } else {
    return true
  }
})

if (
  process.argv.length === 7 &&
  process.argv[2] === '-rs' &&
  fileExists(process.argv[3]) &&
  /^-[A-Za-z]{1,10}$/.test(process.argv[4]) &&
  fileExists(process.argv[5])
) {
  // node nodereplacer.js -rs list -[A-Za-z]{1,10} input.txt output.txt
  buildfunctionbody(process.argv[3], () => {
    prepare(process.argv[5], process.argv[6])
  })
} else if (
  process.argv.length === 6 &&
  /^-r[dt]$/.test(process.argv[2]) &&
  fileExists(process.argv[3]) &&
  fileExists(process.argv[4])
) {
  // node nodereplacer.js (-rt|-rd) list input.txt output.txt
  o.mode = process.argv[2] === '-rt' ? 'byline' : o.mode
  buildfunctionbody(process.argv[3], () => {
    prepare(process.argv[4], process.argv[5])
  })
} else if (
  process.argv.length === 6 &&
  process.argv[2] === '-rg' &&
  fileExists(process.argv[3]) &&
  fileExists(process.argv[4])
) {
  // node nodereplacer.js -rg list input.txt output.txt
  o.mode = 'by_gls_article'
  buildfunctionbody(process.argv[3], () => {
    prepare(process.argv[4], process.argv[5])
  })
} else if (
  process.argv.length === 6 &&
  process.argv[2] === '-re' &&
  fileExists(process.argv[3]) &&
  fileExists(process.argv[4])
) {
  // node nodereplacer.js -re list input.txt output.txt
  o.mode = 'entirefile'
  buildfunctionbody(process.argv[3], () => {
    prepare(process.argv[4], process.argv[5])
  })
} else if (
  /^-(?!r[tdsge]$)\w+$/i.test(process.argv[2]) &&
  (pluginPath =
    __dirname + '/files/plugins/' + process.argv[2].substring(1) + '.js') &&
  fileExists(pluginPath)
) {
  // node nodereplacer.js -ключ1 ...
  buildfunctionbody(pluginPath, () => {
    prepare(null, null)
  })
} else if (
  /^.+\.(?:gls|ifo)$/i.test(process.argv[2]) &&
  fileExists(process.argv[2])
) {
  // stardict.js
  buildfunctionbody(__dirname + '/files/' + 'stardict.js', () => {
    prepare(process.argv[2], null)
  })
} else if (/^.+\.js$/i.test(process.argv[2]) && fileExists(process.argv[2])) {
  // node nodereplacer.js test.js
  buildfunctionbody(process.argv[2], () => {
    prepare(null, null)
  })
} else {
  console.log('Invalid command line.')
  process.exit()
}

function handleExit (signal) {
  fs.unlinkSync(mod_path)
  process.exit(0)
}

if (
  process['dev_argv'].rush === 'yes' ||
  process['dev_argv'].parallel === 'yes'
) {
  process.on('exit', handleExit)
  // process.on('SIGINT', handleExit)
  // process.on('SIGQUIT', handleExit)
  // process.on('SIGTERM', handleExit)
}
