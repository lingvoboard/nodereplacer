// Объединение статей в словарях в формате GLS.

function onstart () {
  if (process.argv.length === 5 && o.utils.fileExists(process.argv[3])) {
    // node nodereplacer.js -mgls input.txt output.txt
    o.inputfile = process.argv[3]
    o.outputfile = process.argv[4]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    o.by_gls_article()
  } else {
    console.log('Invalid command line.')
    process.exit()
  }
}

let hw = o.gls[0].split(/\|/)

for (let h of hw) {
  h = h.trim()
  if (h !== '') o.arr.push([o.arr.length, [h], o.gls[1]])
}

s = null

function sortFunction1 (a, b) {
  if (a[2] === b[2]) {
    return a[0] < b[0] ? -1 : 1
  } else {
    return a[2] < b[2] ? -1 : 1
  }
}

function sortFunction2 (a, b) {
  return a[0] < b[0] ? -1 : 1
}

function onexit () {
  o.arr.sort(sortFunction1)

  for (let i = 0; i < o.arr.length; i++) {
    if (i === 0) {
      o.res.push(o.arr[i])
    } else {
      if (o.res[o.res.length - 1][2] === o.arr[i][2]) {
        o.res[o.res.length - 1][1].push(o.arr[i][1][0])
      } else {
        o.res.push(o.arr[i])
      }
    }
  }

  o.res.sort(sortFunction2)

  for (let i = 0; i < o.res.length; i++) {
    let unique = [...new Set(o.res[i][1])]
    o.res[i] = unique.join('|') + '\n' + o.res[i][2] + '\n'
  }
}
