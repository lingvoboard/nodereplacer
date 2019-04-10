function splitArray (arr, parts) {
  let len = Math.floor(arr.length / parts)
  let rest = arr.length - len * parts
  let chunks = [],
    i = 0,
    n = arr.length
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

let cluster = require('cluster')

if (cluster.isMaster) {
  cluster.setupMaster({ exec: __filename })

  module.exports = (o, threads_num) => {
    return new Promise((resolve, reject) => {
      console.time('Execution time')

      const pb = require(o.utilspath).progressbar(o.arr.length, 0)

      let chunks = splitArray(o.arr, threads_num)

      pb.start()

      const fs = require('fs')

      fs.writeFileSync('result.txt', '', { encoding: 'utf8', flag: 'w' })

      let worker_count = 0

      let i = 0
      while (i < threads_num) {
        const worker = cluster.fork()
        worker.send({ chunk: chunks[i], o: o })
        i += 1
      }

      cluster.on('exit', function (worker, code, sig) {
        worker_count++
        if (worker_count > threads_num - 1) {
          pb.end()
          console.timeEnd('Execution time')
          resolve(true)
        }
      })

      cluster.on('message', (worker, message, handle) => {
        if (message.got) pb.stat++
      })
    })
  }
} else if (cluster.isWorker) {
  let worker = cluster.worker

  let worker_count = 0

  async function get (chunk, o) {
    const fs = require('fs')

    const httpget = require(o.utilspath + 'additionalTools.js').httpget

    for (let link of chunk) {
      try {
        let page = await httpget(encodeURI(decodeURIComponent(link)))

        page = page.toString()

        let header = `\n### ${link}\n`

        fs.writeFileSync('result.txt', `${header}${page}`, {
          encoding: 'utf8',
          flag: 'a'
        })

        worker.send({ got: true })
      } catch (err) {
        console.log(err)
        cluster.worker.kill()
      }
    }

    cluster.worker.kill()
  }

  process.on('message', msg => {
    get(msg.chunk, msg.o)
  })
}
