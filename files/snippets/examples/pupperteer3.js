/*

Пример использования модуля puppeteer

Командная строка:
rep -rt pupperteer3.js part1 output

В одной папке с pupperteer3.js лежат файлы part1, part2 и part3

Содержание part1:
<html><head><title>Страница 1</title></head><body></body></html>
<html><head><title>Страница 2</title></head><body></body></html>
<html><head><title>Страница 3</title></head><body></body></html>


Содержание part2:
<span>Фрагмент 1.1</span> <div></div>
<span>Фрагмент 2.1</span> <div></div>
<span>Фрагмент 3.1</span> <div></div>


Содержание part3:
<span>Фрагмент 1.2</span>
<span>Фрагмент 2.2</span>
<span>Фрагмент 3.2</span>


Результат (output):
<html><head><title>Страница 1</title></head><body><span>Фрагмент 1.1</span> <div><span>Фрагмент 1.2</span></div></body></html>
<html><head><title>Страница 2</title></head><body><span>Фрагмент 2.1</span> <div><span>Фрагмент 2.2</span></div></body></html>
<html><head><title>Страница 3</title></head><body><span>Фрагмент 3.1</span> <div><span>Фрагмент 3.2</span></div></body></html>


*/

function onstart()
{

	o.arr1 = [], o.arr2 = [], o.arr3 = [];
	o.eol_mode = 0;
	o.byline();
}

if (o.loop === 1) o.arr1.push(s);
if (o.loop === 2) o.arr2.push(s);
if (o.loop === 3) o.arr3.push(s);

s = null;


function onexit()
{
	
	if (o.loop === 1)
	{
		o.inputfile = 'part2';
		o.repeat = 'byline';
	}

	if (o.loop === 2)
	{
		o.inputfile = 'part3';
		o.repeat = 'byline';
	}

}

async function onexit_async()
{
	

	
	function processpage(part2, part3)
	{
		try
		{

			document.body.innerHTML = part2;
			document.getElementsByTagName('div')[0].innerHTML = part3;
			return  document.documentElement.outerHTML;	
			
		}
		catch(e)
		{
			return e.message;
		}
	
	}
	
	
	try
	{
		const puppeteer = require('puppeteer');
		console.log("\n");
		let spin = o.utils.spinner_start("Processing... %s", ['|', '/', '—', '\\',]);
		const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
		const page = await browser.newPage();

		for (let i = 0; i < o.arr1.length; i++)
		{
			
			let part1 = o.arr1[i], part2 = o.arr2[i], part3 = o.arr3[i];
			await page.setContent(part1, { waitUntil: 'domcontentloaded' });
			let str = await page.evaluate(processpage, part2, part3);			
			fs.writeFileSync(o.outputfile, `${str}\n`, {encoding: 'utf8', flag: "a"});
		
		}
		
		browser.close();
		o.utils.spinner_stop(spin, 'Processing... Done\n');
		o.et_show();
		
	}
	catch(e)
	{
		console.log(e);
	}



	
	
}
