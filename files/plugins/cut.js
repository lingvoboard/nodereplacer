/*
НАЗЕАЧЕНИЕ
Плагин предназначен для экстракции из входного файла фрагментов или разделение его на несколько частей.

ВАРИАНТЫ КОМАНДНОЙ СТРОКИ
rep -cut -t10 input.txt out.txt
rep -cut -d10 input.dsl out.dsl
rep -cut -g10 input.gls out.gls

rep -cut -t10% input.txt out.txt
rep -cut -d10% input.dsl out.dsl
rep -cut -g10% input.gls out.gls

rep -cut -b1000000 input.txt out.txt
rep -cut -b5000000 input.gls out.gls
...

rep -cut -t10%,20% input.txt out.txt.part1
rep -cut -d50%,50% input.dsl out.dsl.part1
rep -cut -g10%,20%,30% input.gls out.gls.part1

rep -cut -g20%,20%,20%,20% test.gls out.part1

rep -cut -t10%5 input.txt out.txt.part1
rep -cut -d10%5 input.dsl out.dsl.part1
rep -cut -g10%5 input.gls out.gls.part1

ПОЯСНЕНИЕ
-t10 - записать в выходной файл 10 строк из входного файла.
-d10 - записать в выходной файл 10 DSL статей из входного файла.
-g10 - записать в выходной файл 10 GLS статей из входного файла.

-b1000000 - записать в выходной файл примерно 1000000 байт из входного файла.
Примерно - поэтому, что скорее всего будет записано немно больше или меньше чем указано.
Ибо файл в этом режиме читается построчно и строки пишутся полностью, а, к примеру, 1000000-ый байт может находится где-нибудь в середине строки.

-t10%, -d10%, -g10% - записать в выходной файл 10 процентов строк или статей из входного файла.

-t10%,20%, -d50%,50%... - записать в один выходной файл 10%, а во второй 20% строк или статей.

ВНИМАНИЕ!
В сумме части не должны превышать 100%
Пример невалидного параметра: -d50%,50%,10% (Ибо 50% + 50% + 10% = 110%)

Сокращённый формат:
-t10%5 = -t10%,10%,10%,10%,10%
-d10%5 = -d10%,10%,10%,10%,10%
-g10%5 = -g10%,10%,10%,10%,10%

После % можно использовать число от 2 до 10.

Недопустимые значения: -t10%1, -t10%11 и т. п.

ПРИМЕР

До)

dog
translation

dog
translation

dog
translation

... и ещё 16 GLS статей.

Команда:
rep -cut -g20%4 test.gls out.part1

На выходе:
out.part1
out.part2
out.part3
out.part4

В каждом файле по 3 статьи.

Потому что Math.floor((20 / 100) * 16) = 3.

Команда:
rep -cut -g20%5 test.gls out.part1

На выходе:
out.part1
out.part2
out.part3
out.part4
out.part5

В 4 файлах по 3 статьи, в 5-том 4.

Потому что 3+3+3+3+4 = 16.

*/

function checkparam (p) {
  let r = p.match(/^-[tdg]([\d%,]+)$/)

  if (!r) return false

  let arr = r[1].split(',')

  if (arr.length === 0 || /^\d+%$/.test(arr[0]) === false) return false

  let count = 0

  for (let i = 0; i < arr.length; i++) {
    if (!/^\d+%$/.test(arr[i])) return false
    count += parseInt(arr[i])
    arr[i] = parseInt(arr[i])
    if (count > 100) return false
  }

  return [true, arr]
}

function onstart () {
  o.bytescount = 0

  o.items = 0

  if (process.argv[3] && /^-[tdg]\d+%([2-9]|10)$/.test(process.argv[3])) {
    let r = process.argv[3].match(/^(-[tdg])(\d+%)([2-9]|10)$/)

    if (r) {
      let n = r[2]

      for (let i = 1; i < r[3]; i++) {
        n += ',' + r[2]
      }

      process.argv[3] = r[1] + n
    }
  }

  if (/^-[b]\d+$/.test(process.argv[3])) {
    o.byline()
  } else if (
    process.argv.length === 6 &&
    /^-t/.test(process.argv[3]) &&
    (/^-t\d+$/.test(process.argv[3]) || checkparam(process.argv[3])[0])
  ) {
    if (/%/.test(process.argv[3])) {
      o.progress_bar_title = 'Counting lines:\n'
      o.arr = checkparam(process.argv[3])[1]
      o.parts = o.arr.length
    }

    o.mode = 'byline'
    o.byline()
  } else if (
    process.argv.length === 6 &&
    /^-d/.test(process.argv[3]) &&
    (/^-d\d+$/.test(process.argv[3]) || checkparam(process.argv[3])[0])
  ) {
    if (/%/.test(process.argv[3])) {
      o.progress_bar_title = 'Counting articles:\n'
      o.arr = checkparam(process.argv[3])[1]
      o.parts = o.arr.length
    }

    o.mode = 'by_dsl_article'
    o.by_dsl_article()
  } else if (
    process.argv.length === 6 &&
    /^-g/.test(process.argv[3]) &&
    (/^-g\d+$/.test(process.argv[3]) || checkparam(process.argv[3])[0])
  ) {
    if (/%/.test(process.argv[3])) {
      o.progress_bar_title = 'Counting articles:\n'
      o.arr = checkparam(process.argv[3])[1]
      o.parts = o.arr.length
    }

    o.mode = 'by_gls_article'
    o.by_gls_article()
  } else {
    console.log('Invalid command line.')
  }
}

if (/%/.test(process.argv[3])) {
  if (o.loop === 2) {
    if (o.arr && o.arr.length > 0) {
      if (o.count <= Math.floor(parseInt(o.arr[0]) / 100 * o.item)) {
        if (/^-g/.test(process.argv[3])) {
          fs.writeFileSync(o.outputfile, s + '\n\n', {
            encoding: o.out_encoding,
            flag: 'a'
          })
        } else {
          fs.writeFileSync(o.outputfile, s + '\n', {
            encoding: o.out_encoding,
            flag: 'a'
          })
        }
      } else {
        let p = o.arr.shift()

        if (o.arr.length > 0) {
          o.arr[0] = p + o.arr[0]

          let r = o.outputfile.match(/^.*\.part(\d+)$/)

          let i

          if (r) {
            i = r[1]
            i++
            o.outputfile = o.outputfile.replace(/^(.*\.part)\d+$/, '$1' + i)
          } else {
            o.outputfile = o.outputfile + '.part2'
          }

          try {
            fs.unlinkSync(o.outputfile)
          } catch (e) {}

          if (/^-g/.test(process.argv[3])) {
            fs.writeFileSync(o.outputfile, s + '\n\n', {
              encoding: o.out_encoding,
              flag: 'w'
            })
          } else {
            fs.writeFileSync(o.outputfile, s + '\n', {
              encoding: o.out_encoding,
              flag: 'w'
            })
          }
        }
      }
    }
  }

  s = null
} else {
  if (/^-[b]\d+$/.test(process.argv[3])) {
    o.bytescount += Buffer.byteLength(s, o.in_encoding) + 1

    if (o.bytescount >= parseInt(process.argv[3].replace(/^-b(\d+)$/, '$1'))) {
      o.stop = ' ~ ' + o.bytescount + ' bytes written'
    }
  } else {
    if (o.count >= parseInt(process.argv[3].replace(/^-[tdg](\d+)$/, '$1'))) {
      if (/^-t/.test(process.argv[3])) {
        o.stop = o.count + ' lines written'
      } else if (/^-d/.test(process.argv[3])) {
        o.stop = o.count + ' DSL articles written'
      } else {
        o.stop = o.count + ' GLS articles written'
      }
    }
  }
}

function onexit () {
  if (/%/.test(process.argv[3]) && o.loop === 1) {
    if (/^-t/.test(process.argv[3])) {
      o.progress_bar_title = 'Writing lines:\n'
    } else {
      o.progress_bar_title = 'Writing articles:\n'
    }

    o.item = o.count
    o.repeat = o.mode
  }

  if (o.loop === 2) {
    o.log = [o.parts + ' parts written']
  }
}
