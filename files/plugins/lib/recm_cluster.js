'use strict'

const fs = require('fs')
const cluster = require('cluster')

/*
https://nodejs.org/api/cluster.html
*/

if (cluster.isMaster) {
  module.exports = (o, threadsNum) => {
    function splitArray (arr, parts) {
      const n = arr.length
      const len = Math.floor(n / parts)
      const chunks = []
      let rest = arr.length - len * parts

      let i = 0
      while (i < n) {
        let a = 0
        if (rest > 0) {
          a = 1
          rest--
        }
        chunks.push(arr.slice(i, (i += len + a)))
      }

      return chunks
    }

    return new Promise((resolve, reject) => {
      cluster.setupMaster({ exec: __filename })

      const chunks = splitArray(o.filelist, threadsNum)

      threadsNum = chunks.length

      if (threadsNum === 0) {
        resolve(true)
      }

      let workerCount = 0

      for (let i = 0; i < chunks.length; i += 1) {
        const worker = cluster.fork()
        worker.send({
          chunk: chunks[i],
          o: {
            path: o.path,
            utilspath: o.utilspath,
            out_encoding: o.out_encoding,
            in_encoding: o.in_encoding,
            inputfile: o.inputfile,
            outputfile: o.outputfile,
            outpath: o.outpath,
            processorfile: o.processorfile,
            dev_argv: o.dev_argv,
            error_log_path: o.error_log_path
          }
        })
      }

      cluster.on('exit', function (worker, code, sig) {
        if (++workerCount > threadsNum - 1) {
          resolve(true)
        }
      })
    })
  }
} else if (cluster.isWorker) {
  process.on('message', msg => {
    work(msg.chunk, msg.o)
  })
}

async function work (chunk, o) {
    // console.log(o.processor)
  try {
    await processFiles(chunk, o)
    cluster.worker.kill()
  } catch (err) {
    console.log(err)
    cluster.worker.kill()
  }
}

async function processFiles (files, o) {
  o.cheerio = require('cheerio')
  // o.utils = require(o.path + '/files/rep_modules/utils/').utils()
  // o.htmlclean = require(o.path + '/files/rep_modules/utils/htmlclean.js').htmlclean
  const iconvLite = o.dev_argv.encoding ? require('iconv-lite') : null
  const processor = require(o.processorfile)

  for (let k in files) {
    if (files[k].isHtml) {
      let html = o.dev_argv.encoding
        ? iconvLite.decode(fs.readFileSync(files[k].path), o.dev_argv.encoding)
        : fs.readFileSync(files[k].path, 'utf8').replace(/^\uFEFF/, '')

      if (html.length) {
        html = processor.processPage(html, o)

        await write(o.outputfile, `${html}\n`, {
          encoding: 'utf8',
          flag: 'a'
        })

        await write(o.outpath + 'written.txt', `${files[k].path}\n`, {
          encoding: 'utf8',
          flag: 'a'
        })
      } else {
        await write(o.outpath + 'ignored.txt', `${files[k].path}\n`, {
          encoding: 'utf8',
          flag: 'a'
        })
      }
    } else {
      await write(o.outpath + 'ignored.txt', `${files[k].path}\n`, {
        encoding: 'utf8',
        flag: 'a'
      })
    }
  }
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
