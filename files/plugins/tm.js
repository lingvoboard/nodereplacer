// Получение карты тегов и селекторов для HTML-исходника. Запуск:
// rep -tm -re in.html out
// rep -tm -rt in.txt out --selectors=false
// rep -tm -gls in.gls out --map=false --limit=5

/** Default otions:
 * map: true,
 * selectors: true,
 * entries: true,
 * limit: 10,
 * random: false
 */
function onstart () {
  if (process.argv.length === 6) {
    if (o.utils.fileExists(process.argv[4])) {
      o.tagMap = require(o.utilspath + 'tagMap.js')
      o.inputfile = process.argv[4]
      o.outputfile = process.argv[5]
      o.dev_argv = process.dev_argv

      if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
        o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
      } else o.error_log_path = 'error.log'

      if (process.argv[3] === '-gls') {
        o.mode = 'by_gls_article'
        o.by_gls_article()
      } else if (process.argv[3] === '-re') {
        o.mode = 'entirefile'
        o.entirefile()
      } else if (process.argv[3] === '-rt') {
        o.mode = 'byline'
        o.byline()
      } else {
        console.log('Invalid command line.')
        process.exit()
      }
    } else {
      console.log('Invalid command line.')
      process.exit()
    }
  } else {
    console.log('Invalid command line.')
    process.exit()
  }
}

const opts = Object.keys(o.dev_argv).reduce((obj, key) => {
  obj[key] = Number.isNaN(Number(obj[key]))
    ? obj[key].toLowerCase() !== 'false'
    : Math.floor(Number(obj[key]))
  return obj
}, Object.assign({}, o.dev_argv))

if (process.argv[3] === '-re') {
  Object.assign(opts, { entries: false, limit: 1, random: false })
}

o.tagMap.setMap(process.argv[3] === '-gls' ? o.gls[1] : s, o, opts)

s = null

function onexit () {
  o.res.push(o.tagMap.getMap('tags'))
}
