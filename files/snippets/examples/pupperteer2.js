
/*

Пример использования модуля puppeteer

Командная строка:
rep -rt pupperteer2.js url_list.txt output

ДО)
https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML
https://developer.mozilla.org/en-US/docs/Web/API/Element/accessKey
https://developer.mozilla.org/en-US/docs/Web/API/Element/classList
https://developer.mozilla.org/en-US/docs/Web/API/Element/getAttributeNode


ПОСЛЕ)
<div>...
<div>...


*/

function onstart()
{
	o.progress_bar_title = 'Reading file:\n';
	o.eol_mode = 0;
	o.byline();
}




if (/^http/.test(s.trim()))
{
	o.arr.push(s);
}

s = null;


async function onexit_async()
{

	function processpage()
	{
		try
		{
			return  document.body.innerHTML;	
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

		for (let i = 0; i < o.arr.length; i++)
		{


			await page.goto(o.arr[i]);
			let str = await page.evaluate(processpage);
			str = o.utils.normalize(str);
			fs.writeFileSync(o.outputfile, str.trim() + "\n", {encoding: o.in_encoding, flag: "a"});

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

