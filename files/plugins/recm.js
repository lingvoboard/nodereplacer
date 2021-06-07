/*

Варианты командной строки:
rep -recm "D:\Path\To\Site" output
rep -recm "D:\Path\To\Site" processor.js output
rep -recm "D:\Path\To\Site" "C:\Path\To\Processor.js" output
rep -recm "D:\Path\To\Site" processor.js output --encoding=win-1251
rep -recm "D:\Path\To\Site" processor.js output --encoding=utf8 --jobs=8

Назначение:
Предназначен для рекурсивного и
многопоточного слияния HTML-файлов, находящихся в указанной папке.
Страницы пишутся одной строкой в выходной файл.
В качестве парсера используется модуль parse5.

*/

function onstart () {
  if (process.argv.length === 5 &&
    o.utils.dirExists(process.argv[3]) &&
    o.utils.fileExists(`${o.path}/files/plugins/lib/processor.js`)
  ) {
    o.inputfile = process.argv[3]
    o.outputfile = process.argv[4]
    o.processorfile = `${o.path}/files/plugins/lib/processor.js`
  } else if (
    process.argv.length === 6 &&
    o.utils.dirExists(process.argv[3]) &&
    o.utils.fileExists(process.argv[4])
  ) {
    o.inputfile = process.argv[3]
    o.outputfile = process.argv[5]
    o.processorfile = path.resolve(process.argv[4])
  } else {
    console.log('Invalid command line.')
    console.log(process.argv.length)
    process.exit()
  }

  if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
    o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
  } else {
    o.error_log_path = 'error.log'
  }

  o.cheerio = require('cheerio')
  const $ = o.cheerio.load('')

  main()
}

async function main () {
  o.dev_argv = process.dev_argv
  o.outpath = path.dirname(o.outputfile) + path.sep

  const spin = o.utils.spinner_start('Processing... %s', ['|', '/', '—', '\\'])

  try {
    const recmCluster = require(`${o.path}/files/plugins/lib/recm_cluster.js`)
    const os = require('os')

    o.filelist = await rreaddir(o.inputfile)

    await write(o.outputfile, '', { encoding: 'utf8', flag: 'w' })
    await write(o.outpath + 'ignored.txt', '', { encoding: 'utf8', flag: 'w' })
    await write(o.outpath + 'written.txt', '', { encoding: 'utf8', flag: 'w' })

    let jobs = os.cpus().length
    if (
      o.dev_argv.jobs &&
      /^\d{1,2}$/.test(o.dev_argv.jobs) &&
      o.dev_argv.jobs > 1 &&
      o.dev_argv.jobs <= jobs
    ) {
      jobs = o.dev_argv.jobs
    }

    await recmCluster(o, jobs)
  } catch (err) {
    console.log(err)
  }

  o.utils.spinner_stop(spin, 'Processing... Done\n')
  o.et_show()
}

async function rreaddir (dir, allFiles = []) {
  const { readdir } = require('fs').promises
  const { join } = require('path')

  try {
    const files = await readdir(dir, { withFileTypes: true })

    for (const f of files) {
      if (f.isDirectory()) {
        await rreaddir(join(dir, f.name), allFiles)
      } else {
        allFiles.push({
          name: f.name,
          path: join(dir, f.name),
          isHtml: await isHtmlSync(join(dir, f.name))
        })
      }
    }

    return allFiles
  } catch (err) {
    console.log(err)
  }
}

function isHtmlSync (path) {
  if (/\.html?$/i.test(path)) return true

  try {
    const fd = fs.openSync(path, 'r')
    const buf = Buffer.alloc(512)
    fs.readSync(fd, buf, 0, 512, 0)
    const asStr = buf
      .toString('utf-8')
      .trim()
      .toLowerCase()

    fs.closeSync(fd)

    if (asStr.indexOf('<html') !== -1 || asStr.indexOf('<div') !== -1) {
      return true
    }
  } catch (e) {
    // console.error(`Error: ${e.message}.`);
  }

  return false
}

function write (file, data, options) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, options, err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
