/*

Варианты командной строки:
rep -recc "C:\Temp\Site" output

Назначение:
Предназначен для рекурсивного слияния HTML-файлов находящихся в указанной папке.
Страницы пишутся одной строкой в выходной файл.
В качестве парсера используется модуль cheerio.

*/

function onstart () {
  const mime = require('mime')
  const cheerio = require('cheerio')
  const htmlclean = require(o.utilspath + 'htmlclean.js').htmlclean

  if (process.argv.length === 5 && o.utils.dirExists(process.argv[3])) {
    // node nodereplacer.js -recc "C:\Temp\Site" output
    o.inputfile = process.argv[3]
    o.outputfile = process.argv[4]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }
  } else {
    console.log('Invalid command line.')
    process.exit()
  }

  function identify_filetype (path) {
    // thanks to https://github.com/pfrazee/identify-filetype

    // thanks to https://github.com/bibig/whether

    // http://www.astro.keele.ac.uk/oldusers/rno/computing/file_magic.html
    // http://en.wikipedia.org/wiki/list_of_file_signatures
    // http://asecuritysite.com/forensics/magic

    const mns = {
      '00000100': 'ico',
      '1f8b08': 'gz',
      '25504446': 'pdf',
      '3026b2758e66cf': 'wma',
      '3026b2758e66cf': 'wmv',
      '38425053': 'psd',
      '424d': 'bmp',
      '4344303031': 'iso',
      '464c56': 'flv',
      '465753': 'swf',
      '47494638': 'gif',
      '494443': 'mp3',
      '4949': 'tif',
      '49494e31': 'nif',
      '4d4d': 'tif',
      '4d546864': 'mid',
      '504b0304': 'zip',
      // '504b0304'        : 'docx', //дубликат
      '52494646': 'avi',
      '526172211a07': 'rar',
      '7b5c72746631': 'rtf',
      '89504e47': 'png',
      d0cf11e0a1b11ae1: 'doc',
      // 'd0cf11e0a1b11ae1': 'msi', //дубликат
      ffd8ff: 'jpg' //,
      // '6d6f6f76'     : 'mov', TODO broken, not sure why
      // '7573746172'   : 'tar', TODO broken, needs to be testing against the offset!
    }

    const fs = require('fs')

    let type

    if (/\.html?$/i.test(path)) {
      return 'html'
    }

    let m

    // https://en.wikipedia.org/wiki/List_of_file_formats
    if ((m = /[^\.]\.([a-z\d]{1,6})$/i.exec(path))) {
      return m[1]
    }

    try {
      const fd = fs.openSync(path, 'r')

      {
        const buf = Buffer.alloc(16)
        fs.readSync(fd, buf, 0, 16, 0)
        const hex = buf.toString('hex')

        for (var magicNumber in mns) {
          if (hex.indexOf(magicNumber) === 0) {
            type = mns[magicNumber]
            break
          }
        }
      }

      if (type === undefined) {
        const buf = Buffer.alloc(512)
        fs.readSync(fd, buf, 0, 512, 0)
        const asStr = buf
          .toString('utf-8')
          .trim()
          .toLowerCase()

        if (asStr.indexOf('<html') !== -1) {
          type = 'html'
        } else if (asStr.indexOf('<svg') !== -1) {
          type = 'svg'
        }
      }

      fs.closeSync(fd)
    } catch (e) {
      // console.error(`Error: ${e.message}.`);
    }

    return type
  }

  function processFiles (files) {
    const fs = require('fs')

    fs.writeFileSync(o.outputfile, '', { encoding: 'utf8', flag: 'w' })
    fs.writeFileSync('ignored.txt', '', { encoding: 'utf8', flag: 'w' })
    fs.writeFileSync('written.txt', '', { encoding: 'utf8', flag: 'w' })

    let arr = []

    for (let k in files) {
      if (files[k].type === 'html') {
        arr.push(files[k])
      } else {
        fs.writeFileSync('ignored.txt', files[k].path + '\n', {
          encoding: 'utf8',
          flag: 'a'
        })
      }
    }

    for (let i = 0; i < arr.length; i++) {
      let html = fs
        .readFileSync(arr[i].path, 'utf8')
        .toString()
        .replace(/^\uFEFF/, '')

      const $ = cheerio.load(html, {
        decodeEntities: false,
        normalizeWhitespace: true,
        lowerCaseTags: true
      })

      html = htmlclean($.html())

      if (html.length) {
        // console.log('Written: ' + (i + 1) + ', Left: ' + (arr.length - (i + 1)));
        fs.writeFileSync(o.outputfile, html + '\n', {
          encoding: 'utf8',
          flag: 'a'
        })
        fs.writeFileSync('written.txt', arr[i].path + '\n', {
          encoding: 'utf8',
          flag: 'a'
        })
      } else {
        fs.writeFileSync('ignored.txt', arr[i].path + '\n', {
          encoding: 'utf8',
          flag: 'a'
        })
      }
    }
  }

  const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
      filelist = fs.statSync(path.join(dir, file)).isDirectory()
        ? walkSync(path.join(dir, file), filelist)
        : filelist.concat({
          name: file,
          path: path.join(dir, file),
          size: fs.statSync(path.join(dir, file)).size,
          type: identify_filetype(path.join(dir, file))
        })
    })
    return filelist
  }

  if (process.argv.length === 5 && fs.existsSync(process.argv[3])) {
    let spin = o.utils.spinner_start('Processing... %s', ['|', '/', '—', '\\'])
    let r = walkSync(process.argv[3])
    processFiles(r)
    o.utils.spinner_stop(spin, 'Processing... Done\n')
    o.et_show()
  } else {
    console.log('Invalid command line.')
    process.exit()
  }
}
