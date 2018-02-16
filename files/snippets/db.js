/*

Командная строка:
rep -rd db.js input.txt output.txt

Назначение:
Удаление дубликатов статей из очень больших DSL словарей (около гигабайта и больше).

Штатный плагин "d" делает то же самое, но если файл очень большой, то ему может не хватить памяти или операция будет длиться очень долго.

*/

function onstart()
{
	o.BigArr = [];
	const path = require('path');
	o.out_path = path.dirname(o.outputfile) + path.sep;

	fs.writeFileSync(o.out_path + 'temp.txt', '', {
		encoding: 'utf8',
		flag: 'w'
	});

	fs.writeFileSync(o.out_path + 'dub.txt', '', {
		encoding: 'utf8',
		flag: 'w'
	});

	o.temp = fs.openSync(o.out_path + 'temp.txt', 'r');
	o.bytes = 0;
	o.by_dsl_article();
}


s = '';

let hw = [];

for (let v of o.dsl[0])
{
	let h1 = o.utils.remove_comments(v).replace(/[\t ]{2, }/g, ' ').trim();

	if (h1 === '')
	{
		if (hw.length > 0) hw[hw.length - 1][1] += '\n' + v;
	}
	else
	{
		hw.push([h1, v]);
	}
}

for (let v of hw)
{
	let b = o.dsl[1].replace(/\n+$/, '');
	v[0] = v[0].replace(/\x00/g, ' ');
	v[1] = v[1].replace(/\x00/g, ' ');
	b = b.replace(/\x00/g, ' ');

	let a = b;

	if (o.in_encoding === 'utf16le')
	{
		a = Buffer.from(a, 'utf8');
	}

	let len = Buffer.byteLength(a);
	let q = o.tab[v[0] + '\x00' + b.length + '\x00' + 0];

	if (q !== undefined)
	{
		let f = 0;

		for (let i = 0; i < q[2]; i++)
		{
			let w = o.tab[v[0] + '\x00' + b.length + '\x00' + i];
			let buf = Buffer.alloc(w[1]);
			fs.readSync(o.temp, buf, 0, buf.length, w[0]);
			let r = buf.toString();

			if (b === r)
			{
				f = 1;
				break;
			}
		}

		if (f === 0)
		{
			o.tab[v[0] + '\x00' + b.length + '\x00' + q[2]] = [o.bytes, len];
			o.tab[v[0] + '\x00' + b.length + '\x00' + 0][2]++;

			fs.writeFileSync(o.out_path + 'temp.txt', b, {
				encoding: 'utf8',
				flag: 'a'
			});

			s += s !== '' ? '\n' : '';
			s += v[1] + '\n' + b;

			o.bytes += len;
		}
		else
		{
			fs.writeFileSync(o.out_path + 'dub.txt', v[1] + '\n' + b + '\n', {
				encoding: 'utf8',
				flag: 'a'
			});
		}
	}
	else
	{
		o.tab[v[0] + '\x00' + b.length + '\x00' + 0] = [o.bytes, len, 1];

		fs.writeFileSync(o.out_path + 'temp.txt', b, {
			encoding: 'utf8',
			flag: 'a'
		});

		s += s !== '' ? '\n' : '';
		s += v[1] + '\n' + b;

		o.bytes += len;
	}
}

if (s === '')
	s = null;

function onexit()
{
	fs.unlinkSync(o.out_path + 'temp.txt');
}
