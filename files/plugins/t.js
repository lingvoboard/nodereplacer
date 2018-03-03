// Получение списка HTML тэгов.

function onstart () {
  o.byline()
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
