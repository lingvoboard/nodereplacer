// Конвертирование файла из кодировки utf8 в кодировку utf16le с BOM.


function onstart() {
  
  if (process.argv.length === 5 && o.utils.fileExists(process.argv[3])) {
    // node nodereplacer.js -to16 input.txt output.txt
    o.inputfile = process.argv[3]
    o.outputfile = process.argv[4]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    o.bom = ''
    o.byline()
    
  } else {
    console.log('Invalid command line.')
    process.exit()
  }

}

if (o.count === 1) {
  s = `\uFEFF${s}`
  o.out_encoding = 'utf16le'
}