// node nodereplacer.js -rget links.txt 4-24

function onstart () {
  if (
    process.argv.length === 5 &&
    o.utils.fileExists(process.argv[3]) &&
    /^\d+$/.test(process.argv[4]) &&
    parseInt(process.argv[4]) < 25 &&
    parseInt(process.argv[4]) > 3
  ) {
    o.inputfile = process.argv[3]
    if (o.inputfile !== null && path.isAbsolute(o.inputfile)) {
      o.error_log_path = path.dirname(o.inputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    o.progress_bar = false
    o.et_auto = false

    o.byline()
  } else {
    console.log('Invalid command line.')
    process.exit()
  }
}

if (/^https?:(www.)?.*$/.test(s.trim())) {
  o.arr.push(s.trim())
}

async function onexit () {
  const rget = require(`${o.path}/files/plugins/lib/rget_cluster_child.js`)
  if (o.arr.length) {
    try {
      let r = await rget(o, process.argv[4])
    } catch (err) {
      console.log(err)
    }
  }
}
