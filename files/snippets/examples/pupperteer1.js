/*

Пример использования модуля puppeteer

Командная строка:
rep -rt pupperteer1.js input output

ДО)
<!DOCTYPE html>...<title>About this reference - JavaScript | MDN</title>...</html>
<!DOCTYPE html>...<title>Infinity - JavaScript | MDN</title>...</html>

ПОСЛЕ)
About this reference - JavaScript | MDN
Infinity - JavaScript | MDN

_______________________________

Вариант без page.setContent:

...

function processpage(str)
{

	try
	{

		let body = str.match(/<body[^>]*>([^]*?)<\/body>/i)[1];
		document.body.innerHTML = body;
		let title = document.getElementsByTagName('title');
		return  title[0].innerHTML;

	}
	catch(e)
	{
		return e.message;
	}

}

...

while (o.idata.next())
{
	let v = o.idata.get();
	let str = await page.evaluate(processpage, v.str);
	o.idata.write(str + v.eol);

}

...

*/

s = null

async function onexit_async () {
  function processpage () {
    try {
      let title = document.getElementsByTagName('title')
      return title[0].innerHTML
    } catch (e) {
      return e.message
    }
  }

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
      await page.setContent(v, { waitUntil: 'domcontentloaded' })
      let str = await page.evaluate(processpage)
      o.idata.write(str + '\n')
    }

    browser.close()
    o.utils.spinner_stop(spin, 'Processing... Done\n')
    o.et_show()
  } catch (e) {
    console.log(e.message)
  }
}
