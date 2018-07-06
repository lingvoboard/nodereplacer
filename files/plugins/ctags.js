// Исправление некоторых ошибок форматирования словарей в формате DSL.

function onstart () {
  if (process.argv.length === 5 && o.utils.fileExists(process.argv[3])) {
    // node nodereplacer.js -ctags input.txt output.txt
    o.inputfile = process.argv[3]
    o.outputfile = process.argv[4]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    o.by_dsl_article()
  } else {
    console.log('Invalid command line.')
    process.exit()
  }
}

function correcttags (s) {
  let tags = Object.create(null)
  tags['lang'] = [[], '[/lang]']
  tags['!trs'] = [[], '[/trs]']
  tags['sup'] = [[], '[/sup]']
  tags['sub'] = [[], '[/sub]']
  tags['com'] = [[], '[/com]']
  tags['trn'] = [[], '[/trn]']
  tags['ex'] = [[], '[/ex]']
  tags['b'] = [[], '[/b]']
  tags['i'] = [[], '[/i]']
  tags['u'] = [[], '[/u]']
  tags['p'] = [[], '[/p]']
  tags["'"] = [[], "[/']"]
  tags['*'] = [[], '[/*]']
  tags['c'] = [[], '[/c]']

  let arr = []

  let m

  while (
    (m = /^([^]*?)(\\*)\[(\/?(?:[\*\'biup]|sup|sub|ex|trn|\!trs|com|c)|(?:c [a-z]{3,50}|lang id=[0-9]{1,5}|lang name=\"[a-zA-Z]{5,22}\"|\/lang))\]([^]*)$/.exec(
      s
    ))
  ) {
    s = m[4]
    arr.push(m[1])

    if (m[2].length % 2 === 1) {
      arr.push(m[2])
      arr.push('[' + m[3] + ']')
      continue
    } else {
      arr.push(m[2])
    }

    if (/^[^\/]/.test(m[3])) {
      let name = m[3].replace(/ .*$/, '')
      let tag = '[' + m[3] + ']'

      if (tags[name][0].length > 0) {
        arr.push(tags[name][1])
        tags[name][0][tags[name][0].length - 1][2].push(arr.length - 1)

        arr.push(tag)
        tags[name][0].push([tag, arr.length - 1, []])
      } else {
        arr.push(tag)
        tags[name][0].push([tag, arr.length - 1, []])
      }
    } else {
      let name = m[3].replace(/\//, '')
      let tag = '[' + m[3] + ']'

      if (tags[name][0].length > 0) {
        tags[name][0].pop()
        arr.push(tag)

        if (tags[name][0].length > 0) {
          arr.push(tags[name][0][tags[name][0].length - 1][0])
          tags[name][0][tags[name][0].length - 1][2].push(arr.length - 1)
        }
      } else {
        arr.push('{{' + tag + '}}')
      }
    }
  }

  arr.push(s)

  for (let k in tags) {
    if (tags[k][0].length > 0) {
      for (let v of tags[k][0]) {
        arr[v[1]] = '{{' + arr[v[1]] + '}}'

        for (let i of v[2]) {
          arr[i] = ''
        }
      }
    }
  }

  return arr.join('')
}

s = o.dsl[0].join('\n') + '\n' + correcttags(o.dsl[1])
