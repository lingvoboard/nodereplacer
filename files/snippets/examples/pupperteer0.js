/*

Пример использования модуля puppeteer

Командная строка:
rep -rt pupperteer0.js input output

ДО)
<b>болд <i>болд-курсив </b>курсив <u>курсив-подчёркивание </i>подчёркивание</u>
<b>болд <i>болд-курсив </b>курсив <u>курсив-подчёркивание </i>подчёркивание</u>

ПОСЛЕ)
<b>болд <i>болд-курсив </i></b><i>курсив <u>курсив-подчёркивание </u></i><u>подчёркивание</u>
<b>болд <i>болд-курсив </i></b><i>курсив <u>курсив-подчёркивание </u></i><u>подчёркивание</u>

*/

s = null

async function onexit_async () {
  try {
    const puppeteer = require('puppeteer')
    console.log('\n')
    let spin = o.utils.spinner_start('Processing... %s', ['|', '/', '—', '\\'])
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()

    while (o.idata.next()) {
      let v = o.idata.get()
      let str = await page.evaluate(htmlString => {
        document.body.innerHTML = htmlString
        return document.body.innerHTML
      }, v.trim())

      o.idata.write(str + '\n')
    }

    browser.close()
    o.utils.spinner_stop(spin, 'Processing... Done\n')
    o.et_show()
  } catch (e) {
    console.log(e.message)
  }
}
