/*

НАЗНАЧЕНИЕ
Подсветка JavaScript кода

Плагин использует форк модуля eshighlight (JavaScript code highlighter based on esprima.)
https://github.com/btford/eshighlight
http://esprima.org/

СИСТЕМНЫЕ ТРЕБОВАНИЯ
Внешняя (не в папку /nodereplacer/node_modules) или другими словами глобальная установка модуля puppeteer
Установка puppeteer:
npm install https://github.com/GoogleChrome/puppeteer/

А команда "npm install puppeteer" скорее всего установит не совсем свежую версию этого модуля.

КОМАНДНАЯ СТРОКА
rep -js2html input output

ЗАМЕЧАНИЯ
Если парсер встретит невалидную с его точки зрения конструкцию, то в выходной файл будет записано сообщение об ошибке с указанием номера строки.
В таком случае можно временно закомментировать указанную строку, отредактировать её как-то чтобы парсер её принял или вообще временно удалить и потом вернуть.

ПРИМЕР

До)
while (arr !== null && arr.length !== 0)
{
	const c = arr.shift();
	if (/^[^\s]$/.test(c))
		o.tab[c] = '';
}

После)
<span class="control-flow">while</span><span class="bold"> (</span><span class="identifier">arr</span> <span class="operator">!==</span> <span class="null">null</span> <span class="operator">&amp;&amp;</span> <span class="identifier">arr</span><span class="bold">.</span><span class="identifier">length</span> <span class="operator">!==</span> <span class="numeric">0</span><span class="bold">)
{
	</span><span class="keyword">const</span> <span class="identifier">c</span> <span class="operator">=</span> <span class="identifier">arr</span><span class="bold">.</span><span class="identifier">shift</span><span class="bold">();
	</span><span class="control-flow">if</span><span class="bold"> (</span><span class="regularexpression">/^[^\s]$/</span><span class="bold">.</span><span class="identifier">test</span><span class="bold">(</span><span class="identifier">c</span><span class="bold">))
		</span><span class="identifier">o</span><span class="bold">.</span><span class="identifier">tab</span><span class="bold">[</span><span class="identifier">c</span><span class="bold">] </span><span class="operator">=</span> <span class="string">''</span><span class="bold">;
}</span>

*/

function onstart () {
  if (process.argv.length === 5 || fileExists(process.argv[3])) {
    main()
  } else {
    console.log('Invalid command line.')
    fs.writeFileSync(process.argv[4], e.message, {
      encoding: 'utf8',
      flag: 'w'
    })
  }
}

function processpage (b) {
  try {
    document.body.innerHTML = b
    let arr = []

    for (let i = 0; i < document.body.childNodes.length; i++) {
      if (
        document.body.childNodes[i].nodeType === 3 &&
        /^[\(\)\{\}\[\]\.;,\$\?\:%]+$/.test(
          document.body.childNodes[i].nodeValue.replace(/\s/g, '')
        )
      ) {
        const textnode = document.body.childNodes[i]
        const el = document.createElement('span')
        el.setAttribute('class', 'bold')
        el.innerText = textnode.nodeValue
        textnode.parentNode.replaceChild(el, textnode)
      }
    }

    const bolds = document.body.getElementsByClassName('bold')

    for (let v of bolds) {
      let t = v.innerHTML

      t = t.replace(/^(.*)([:\?%])(.*)$/, (all, m1, m2, m3) => {
        if (m1.trim() === '' && m3.trim() === '') {
          return `<span class="operator">${m1}${m2}${m3}</span>`
        } else if (m3.trim() === '') {
          return `<span class="bold">${m1}</span><span class="operator">${m2}${m3}</span>`
        } else if (m1.trim() === '') {
          return `<span class="operator">${m1}${m2}</span><span class="bold">${m3}</span>`
        } else {
          return `<span class="bold">${m1}</span><span class="operator">${m2}</span><span class="bold">${m3}</span>`
        }
      })

      v.innerHTML = t
    }

    return document.body.innerHTML
  } catch (e) {
    return { error: true, message: e.message }
  }
}

async function ProcessTextNodes (s) {
  try {
    const puppeteer = require('puppeteer')
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()

    let r = await page.evaluate(processpage, s)
    if (r.error) throw new Error(r.message)

    r = r.replace(/<br>/g, '\n')
    fs.writeFileSync(process.argv[4], r, { encoding: 'utf8', flag: 'w' })
    o.et_show()
    process.exit()
  } catch (e) {
    fs.writeFileSync(process.argv[4], e, { encoding: 'utf8', flag: 'w' })
    process.exit()
  }
}

function escapeHTMLtags (code) {
  code = code.replace(/(<[^<>]*>)/g, function (all, m1) {
    return m1.replace(/([&<>])/g, (all, m1) => {
      if (m1 === '<') {
        return '&lt;'
      } else if (m1 === '>') {
        return '&gt;'
      } else {
        return '&amp;'
      }
    })
  })

  return code
}

function main () {
  try {
    let code = fs.readFileSync(process.argv[3], 'utf8').toString()

    code = escapeHTMLtags(code)

    let r = require(o.utilspath + 'eshighlight2.js')(code)

    ProcessTextNodes(r)
  } catch (e) {
    fs.writeFileSync(process.argv[4], e.message, {
      encoding: 'utf8',
      flag: 'w'
    })
  }
}
