/*

Это модификация editpad1.js, которая предназначена для запуска асинхронного кода.

ПРИМЕР ИСПОЛЬЗОВАНИЯ №1

let url = decodeURIComponent('http://ordnet.dk/ddo/ordbog?query=adoptere');
let page = await httpget(encodeURI(url));
let $ = o.utils.init_cheerio_old(page.toString());
let t = $('title').eq(0).html();
console.log(t);

ПРИМЕР ИСПОЛЬЗОВАНИЯ №2

const puppeteer = require('puppeteer');
const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
const page = await browser.newPage();
await page.goto('http://example.com/');

function processpage()
{
	try
	{

		let title = document.getElementsByTagName('title');
		return  title[0].innerHTML;

	}
	catch(e)
	{
		return e.message;
	}

}

let r = await page.evaluate(processpage);
console.log(r);
browser.close();

*/

'use strict'

const fs = require('fs')
const readline = require('readline')
const util = require('util')

const exec = util.promisify(require('child_process').exec)

let input = 'R:\\Temp\\temp_in.js'
let output = 'R:\\Temp\\temp_out.txt'

fs.writeFileSync(input, '', {
  encoding: 'utf8',
  flag: 'w'
})
fs.writeFileSync(output, '', {
  encoding: 'utf8',
  flag: 'w'
})

;(async () => {
  try {
    const count = await readstdin()

    let { stdout, stderr } = await exec(
      `node  --harmony_regexp_lookbehind --harmony_regexp_property C:\\nodereplacer\\nodereplacer.js ${input}`
    )

    if (stderr) stderr = `\n${stderr}`

    fs.writeFileSync(output, stdout + stderr, { encoding: 'utf8', flag: 'a' })

    const result = await readoutput()

    fs.unlinkSync(input)
    fs.unlinkSync(output)
  } catch (e) {
    console.log(e)
    fs.unlinkSync(input)
    fs.unlinkSync(output)
  }
})()

function readstdin () {
  let count = 0

  return new Promise((resolve, reject) => {
    const head = `(async () => {\nconst httpget = require(o.utilspath + 'additionalTools.js').httpget;`
    const foot = `\n})();`
    fs.writeFileSync(input, head, { encoding: 'utf8', flag: 'a' })

    readline
      .createInterface({
        input: process.stdin
      })
      .on('line', line => {
        count++

        if (line.charCodeAt(line.length - 1) === 26) {
          line = line.substring(0, line.length - 1)
          line = line.length ? line : null
          if (line !== null) {
            fs.writeFileSync(input, line, {
              encoding: 'utf8',
              flag: 'a'
            })
          }
        } else {
          fs.writeFileSync(input, line + '\n', {
            encoding: 'utf8',
            flag: 'a'
          })
        }
      })
      .on('close', () => {
        fs.writeFileSync(input, foot, { encoding: 'utf8', flag: 'a' })
        resolve(count)
      })
  })
}

function readoutput () {
  return new Promise((resolve, reject) => {
    readline
      .createInterface({
        input: fs.createReadStream(output, 'utf8')
      })
      .on('line', line => {
        console.log(line)
      })
      .on('close', () => {
        resolve(true)
      })
  })
}
