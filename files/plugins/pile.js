// Объединение статей в словаре, которые имеют одинаковое тело.
// Заголовки у объединенных статей складываются в стопы.

function onstart () {
  o.by_dsl_article()
}

let hw = []

for (let v of o.dsl[0]) {
  let h1 = o.utils
    .remove_comments(v)
    .replace(/[\t ]{2, }/g, ' ')
    .trim()
  if (h1 === '') {
    if (hw.length > 0) hw[hw.length - 1] += '\n' + v
  } else {
    hw.push(v)
  }
}

for (let v of hw) {
  o.arr.push([v, o.dsl[1].replace(/\n+$/, ''), o.arr.length])
}

s = null

function sortFunction1 (a, b) {
  if (a[1] === b[1]) {
    return a[2] < b[2] ? -1 : 1
  } else {
    return a[1] < b[1] ? -1 : 1
  }
}

function sortFunction2 (a, b) {
  return a[2] < b[2] ? -1 : 1
}

function onexit () {
  o.arr.sort(sortFunction1)

  let tmparr = []

  while (o.arr.length) {
    const element = o.arr.shift()

    if (tmparr.length === 0) {
      tmparr.push(element)
    } else {
      if (element[1] === tmparr[tmparr.length - 1][1]) {
        tmparr[tmparr.length - 1][0] += '\n' + element[0]
      } else {
        tmparr.push(element)
      }
    }
  }

  tmparr.sort(sortFunction2)

  for (let i = 0; i < tmparr.length; i++) { o.res.push(tmparr[i][0] + '\n' + tmparr[i][1]) }
}
