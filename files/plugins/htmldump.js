/*

НАЗНАЧЕНИЕ

Обработка файла, который содержит результат объединения веб-страниц
Задача обработки - сделать так, чтобы \n остался только между страницам.

ПРИМЕР

До)

<html>
<head>
<title></title>
</head>
<body>dog</body>
</html>

<html>
<head>
<title></title>
</head>
<body>cat</body>
</html>

После)

<html><head><title></title></head><body>dog</body></html>
<html><head><title></title></head><body>cat</body></html>


ПРИМЕРЫ КОМАНД

node nodereplacer.js -htmldump '</script>' input.txt output.txt
node nodereplacer.js -htmldump '</html>' input.txt output.txt
node nodereplacer.js -htmldump '<\/html>' input.txt output.txt
node nodereplacer.js -htmldump '<\/html\s*>' input.txt output.txt

Второй аргумент - разделитель - регулярное выражение, которое описывает окончание каждой веб-страницы.

*/

function onstart () {
  if (process.argv.length === 6 && o.utils.fileExists(process.argv[4])) {
    o.re_end_tag = process.argv[3]
    o.inputfile = process.argv[4]
    o.outputfile = process.argv[5]
    o.s = ''
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

let m

let re = new RegExp(`^(.*?${o.re_end_tag})(.*)$`, 'i')

if ((m = re.exec(s))) {
  o.s += m[1] + ' '
  s = o.s
  o.s = m[2]
} else {
  o.s += s + ' '
  s = null
}
