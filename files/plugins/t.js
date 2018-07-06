// Получение списка HTML тэгов.


function onstart() {
  
  if (process.argv.length === 5 && o.utils.fileExists(process.argv[3])) {
    // node nodereplacer.js -t input.txt output.txt
    o.inputfile = process.argv[3]
    o.outputfile = process.argv[4]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    o.byline()
    
  } else {
    console.log('Invalid command line.')
    process.exit()
  }

}



let list = s.match(/<[^<>]+>/g)

if (list) {
  for (let v of list) o.tab[v] = ''
}

s = null

function slash (s) {
  s = s.replace(/^<\/?(.*)>$/, '$1')
  return s
}

function sortFunction (a, b) {
  return slash(a) < slash(b) ? -1 : 1
}

function onexit () {
  for (let k in o.tab) {
    o.res.push(k)
  }

  o.res.sort(sortFunction)
}
