/*

Командная строка:
rep -rd suggestion.js input.dsl url_list.txt

Входной файл должен иметь словарную структуру (DSL).

Назначение:
Получение списка ссылок для выкачивания заголовков словаря с какого-то сайта через Autocomplete

Получаемый список не содержит дубликатов.

Пример:

ДО)

abaissant
	тело статьи
abaisse-langue
	тело статьи

ПОСЛЕ)

http://example.com/?data=abaissant
http://example.com/?data=abaissan
http://example.com/?data=abaissa
http://example.com/?data=abaiss
http://example.com/?data=abais
http://example.com/?data=abai
http://example.com/?data=abaisse
http://example.com/?data=abaisse-langue
http://example.com/?data=abaisse-langu
http://example.com/?data=abaisse-lang
http://example.com/?data=abaisse-lan
http://example.com/?data=abaisse-la
http://example.com/?data=abaisse-l
http://example.com/?data=abaisse-

*/

function onstart () {
  o.filter = Object.create(null)
  o.eol = ''
  o.by_dsl_article()
}

s = ''

for (let h1 of o.dsl[2]) {
  // раскрываем dog(s)
  for (let h2 of o.utils.openroundbrackets(h1)[0]) {
    let h3 = o.utils.remove_scb(h2) // удаляем {aaa} (scb - single curly brackets)
    h3 = h3.replace(/\\*/g, '') // удаляем все обратные слеши
    h3 = h3.toLowerCase()

    let res = []

    // получаем массив символов
    let arr = [...h3]

    while (arr.length > 0) {
      let h4 = arr.join('').trim()

      if (o.filter[h4] === undefined) {
        o.filter[h4] = 0
        res.push(h4)
      }

      arr.pop() // удаляем последний элемент
    }

    for (let v of res) {
      s += '\nhttp://' + 'example.com/?data=' + encodeURIComponent(v)
    }
  }
}
