//Конвертирует изображения в base64

function onstart()
{

	if ((process.argv.length === 6) && (process.argv[3] === '-i'))
	{
	
		o.byline();
		fs.writeFileSync(o.error_log_path, "", {encoding: 'utf8', flag: "w"});
	
	}
	else
	{


		const hrstart = process.hrtime();

		try
		{
			let encoding = o.utils.guessEncoding(o.inputfile);
			let data = fs.readFileSync(o.inputfile);
			let base64str = data.toString('base64');
			let content = "<img src=\"" + "data:image/png;base64," + base64str + "\" />\n\n";
			content += "<style>\ndiv.image {\nbackground-image:url(data:image/png;base64,";
			content += base64str + ");\nbackground-size: auto;\nbackground-repeat: no-repeat;\nwidth:100%;\nheight:100%;\n\n}\n</style>\n\n<div class=image title=\"" + o.inputfile + "\"></div>";
			fs.writeFileSync(o.outputfile, content, {encoding: encoding, flag: "w"});

			const hrend = process.hrtime(hrstart);
			console.log(`\n\nExecution time: ${ hrend[0] }.${ Math.floor(hrend[1]/1000000) }\n`);


		}
		catch (err)
		{
			console.log("\nTypeError: " + err.message);
		}


	}

}


function imgtobase64(b, img, e)
{

	try
	{
		let data = fs.readFileSync("res/" + img);
		let base64str = data.toString('base64');
		return  b + "data:image/png;base64," + base64str + e;
	}
	catch (err)
	{
		if (o.tab[img] === undefined)
		{
			o.tab[img] = '';
			fs.writeFileSync(o.error_log_path, "File does not exist: " + img + "\n", {encoding: 'utf8', flag: "a"});
		}
		return  b + img + e;
	}
	

}

s = s.replace(/(<IMG[^>]*src=\")([^\">]+)(\"[^>]*>)/ig, function(u, m1, m2, m3){
return imgtobase64(m1, m2, m3);
});
