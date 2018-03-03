// Конвертирование файла из кодировки utf16le в кодировку utf8 с BOM.

function onstart () {
  o.in_encoding = 'utf16le'
  o.out_encoding = 'utf8'
  o.byline()
}
