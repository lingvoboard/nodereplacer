//Удаление из словаря дубликатов статей.
//версия от 21 августа 17:01

if (o.BigArr === undefined)
{

	console.log("\nReading file:\n");
	o.BigArr = [];

	const path = require('path');
	o.out_path = path.dirname(o.outputfile) + path.sep;

}


let hw = [];

for (let v of o.dsl[0])
{
	let h1 = o.utils.remove_comments(v).replace(/[\t ]{2, }/g, " ").trim();
	if (h1 === '')
	{
		if (hw.length > 0)
			hw[hw.length-1][1] += "\n" + v;
	}
	else
	{
		hw.push([h1, v]);
	}

}


for (let v of hw)
{
	
	let b = o.dsl[1].replace(/\n+$/, "");
	o.BigArr.push([o.BigArr.length, v[0], b, v[1], 0]);
}

s = null;


function sortFunction1(a, b) {

	if (a[1] === b[1])
	{

		if (a[2] === b[2])
		{
			return (a[0] < b[0]) ? -1 : 1;		
		}
		else
		{
			return (a[2] < b[2]) ? -1 : 1;
		}

	}
	else
	{
		return (a[1] < b[1]) ? -1 : 1;
	}
}

function sortFunction2(a, b) {
	return (a[0] < b[0]) ? -1 : 1;
}



function mark_dubs()
{


	o.BigArr.sort(sortFunction1);


	for (let i = 0; i < (o.BigArr.length - 1); i++)
	{
		
		if ((o.BigArr[i][1] === o.BigArr[i + 1][1]) && (o.BigArr[i][2] === o.BigArr[i + 1][2]))
		{
			o.BigArr[i+1][4] = 1;
		}


	}


}



function write(OuputFileName)
{


	o.BigArr.sort(sortFunction2);

	let out = fs.openSync(o.outputfile, 'a');
	let dub = fs.openSync(o.out_path + 'dub.txt', 'w');


	for (let i = 0; i < o.BigArr.length; i++)
	{
		
		if (o.BigArr[i][4] === 0)
		{

			fs.writeSync(out, o.BigArr[i][3] + "\n" + o.BigArr[i][2] + "\n", null, o.out_encoding);

		}
		else
		{
			
			fs.writeSync(dub, o.BigArr[i][3] + "\n" + o.BigArr[i][2] + "\n", null, o.out_encoding);
				
		}
		

	}

	fs.closeSync(out);
	fs.closeSync(dub);

	

o.BigArr.length = 0;

return true;

}


function onexit()
{

	process.stdout.write("\n\nProcessing...");

	mark_dubs();

	readline.cursorTo(process.stdout, 0);
	readline.clearLine(process.stdout, 0);

	process.stdout.write("Processing... Done");

	process.stdout.write("\n\nWriting...");

	write();

	readline.cursorTo(process.stdout, 0);
	readline.clearLine(process.stdout, 0);

	process.stdout.write("Writing... Done");


}

