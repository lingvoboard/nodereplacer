
/*

Для Linux c использованием https://linux.die.net/man/1/file

Командная строка:
rep -rec "C:\Temp\Site" output

Назначение:
Предназначен для рекурсивного слияния HTML-файлов находящихся в указанной папке.
Страницы пишутся одной строкой в выходной файл.

*/



function onstart()
{

	const escapeShell = function(cmd) {
		return '"'+cmd.replace(/(["\s'$`\\])/g,'\\$1')+'"';
	}

	const execsync = require('child_process').execSync;
	const fs = require('fs');
	const path = require('path');

	const walkSync = (dir, filelist = []) => {
		fs.readdirSync(dir).forEach(file => {
		filelist = fs.statSync(path.join(dir, file)).isDirectory()
			? walkSync(path.join(dir, file), filelist)
			: filelist.concat({
				name: file,
				path: path.join(dir, file),
				size: fs.statSync(path.join(dir, file)).size,
				type: execsync("file " + escapeShell(path.join(dir, file))).toString().substr(path.join(dir, file).length + 2)
			});
		});
		return filelist;
	}

		
	if (o.argv.length === 5 && fs.existsSync(o.argv[3]))
	{
		let r = walkSync(o.argv[3]);
		//console.log(r);
		processFiles(r);
	}
	else
	{
		console.log('Invalid command line.');
		process.exit();
	}
	
	
}



function processFiles(files)
{


	const fs = require('fs');

	fs.writeFileSync(o.outputfile, "", {encoding: 'utf8', flag: "w"});

	fs.writeFileSync("ignored.txt", "", {encoding: 'utf8', flag: "w"});

	fs.writeFileSync("written.txt", "", {encoding: 'utf8', flag: "w"});
	
	let arr = [];
	
	for (let k in files)
	{

		if (files[k].type.startsWith("HTML document"))
		{
			arr.push(files[k]);
		}
		else
		{
			fs.writeFileSync("ignored.txt", files[k].path + "\n", {encoding: 'utf8', flag: "a"});
		}
	
	}


	for (let i = 0; i < arr.length; i++)
	{

		console.log('Written: ' + (i+1) + ', Left: ' + (arr.length - (i+1)));
		
		let html = fs.readFileSync(arr[i].path, 'utf8').toString().replace(/^\uFEFF/, '');

		let $ = o.utils.init_cheerio(html, {decodeEntities: false, normalizeWhitespace: true, lowerCaseTags: false, lowerCaseAttributeNames: false});
		
		let r = $.html().replace(/\n/g, " ");
		
		fs.writeFileSync(o.outputfile, r + "\n", {encoding: 'utf8', flag: "a"});

		fs.writeFileSync("written.txt", arr[i].path + "\n", {encoding: 'utf8', flag: "a"});

	
	}

}
