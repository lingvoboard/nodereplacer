function onstart()
{
	
	if (process.argv[3] === '-tab1')
	{
	
		const indfile = process.argv[4];
		let synfile = undefined;
		const stardict = require(o.utilspath + 'stardictUtils.js');
		const path = indfile.replace(/(\.idx)$/i, "");
		for (let ext of ['.syn', '.SYN', '.Syn', '.sYn', '.syN', '.SYn', '.sYN', '.SyN'])
		{
			if (o.utils.fileExists(path + ext))
			{
				synfile = path + ext;
				break;
			}
		
		}
		
		
		process.stdout.write('\nCreating table...');
		const tab1 = stardict.getOffsetLengthTable(indfile, synfile);
		fs.writeFileSync(process.argv[5], "", {encoding: 'utf8', flag: "w"});
		for (let v of tab1)
		{
			fs.writeFileSync(process.argv[5], `${v[0].replace(/\t+/, " ")}\t${v[1]}\t${v[2]}\n`, {encoding: 'utf8', flag: "a"});
		}
		
		process.stdout.write('\rCreating table...Done');
		o.et_show();

	
	}
	else if (process.argv[3] === '-tab2')
	{


		const dzfile = process.argv[4];
		let indfile = undefined;
		let synfile = undefined;
		
		const stardict = require(o.utilspath + 'stardictUtils.js');
		const path = dzfile.replace(/(\.dict\.dz)$/i, "");
		for (let ext of ['.idx', '.IDX', '.Idx', '.iDx', '.idX', '.IDx', '.iDX', '.IdX'])
		{
			if (o.utils.fileExists(path + ext))
			{
				indfile = path + ext;
				break;
			}
		
		}

		for (let ext of ['.syn', '.SYN', '.Syn', '.sYn', '.syN', '.SYn', '.sYN', '.SyN'])
		{
			if (o.utils.fileExists(path + ext))
			{
				synfile = path + ext;
				break;
			}
		
		}
		
		if (!indfile) throw new Error('Index file not exists.');
		
		process.stdout.write('\nCreating table...');
		const tab1 = stardict.getOffsetLengthTable(indfile, synfile);
		const tab2 = stardict.getSliceChunksTable(dzfile, tab1);

		fs.writeFileSync(process.argv[5], "", {encoding: 'utf8', flag: "w"});
		for (let v of tab2)
		{
			fs.writeFileSync(process.argv[5], `${v[0].replace(/\t+/g, " ")}\t${v[1]}\n`, {encoding: 'utf8', flag: "a"});
		}
		
		process.stdout.write('\rCreating table...Done');
		o.et_show();
		
	
	}
	else
	{
		console.log('Invalid command line.');
		process.exit();
	
	}
	
	
}
