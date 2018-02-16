//Сортирует DSL теги.

function trim(s)
{

	s = s.replace(/\[(c) +[a-z]+\]/, "$1");
	s = s.replace(/\[lang +id=\d+?\]/, "lang");
	s = s.replace(/\[lang +name=[^\[\]]+?\]/, "lang");
	s = s.replace(/\[\/?(.+)\]/i, "$1");

	return s;

}


function sortFunction1(a, b)
{
	return (a[0] > b[0]) ? -1 : 1;
}


function sortFunction2(a, b)
{
	return (b[0] > a[0]) ? -1 : 1;
}



function sorttags(arr, closedtags)
{


	let m = [];

	for (let i = 0; i < arr.length; i++)
	{
		let n = arr[i].split(/:/)[0];
		let t = arr[i].split(/:/)[1];

		let ctn = 0;
		for (let j = 0; j < tags.length; j++)
		{


			if ((tags[j][0] > n) && (trim(tags[j][1]) === trim(t)))
			{
				ctn = tags[j][0];
				break;
			}

		}

		m.push([ctn, t]);

	}

	if (closedtags)
	{
		m.sort(sortFunction2);
	}
	else
	{
		m.sort(sortFunction1);
	}

	let r = [];

	for (let l = 0; l < m.length; l++)
	{
		r.push(m[l][1]);
	}

	return r;

}




//|||||||||||||||||||| OPEN TAGS SORT START ||||||||||||||||||||

let count = 0;

let tags = [];

let t = s;

let m;
while (m = /^[^]*?(\\*)(\[(?:\/?(?:com|[\*'bcipu]|ex|trn1?|!trs|sub|sup)|(?:c [a-z]{3,50}|lang id=[0-9]{1,5}|lang name=\"[a-zA-Z]{5,22}\"|\/lang))\])([^]*)$/.exec(t))
{
	
	t = m[3];

	if ((m[1].length % 2) === 1)
	{
		continue;
	}

	count++;

	if (/^\[\/[^\n]*\]$/.test(m[2]))
	{
		tags.push([count, m[2]]);
	}

}



let arr = [];

count = 0;

while (m = /^([^]*?)(\\*)(\[(?:\/?(?:com|[\*'bcipu]|ex|trn1?|!trs|sub|sup)|(?:c [a-z]{3,50}|lang id=[0-9]{1,5}|lang name=\"[a-zA-Z]{5,22}\"|\/lang))\])([^]*)$/.exec(s))
{


	let m1 = m[1];
	let m2 = m[2];
	let m3 = m[3];
	let m4 = m[4];

	s = m4;


	if (m1 !== '')
	{
		arr.push([m1]);
	}

	if (m2 !== '')
	{
		arr.push([m2]);
	}

	if ((m2.length % 2) === 1)
	{
		continue;
	}


	if ((arr.length > 0) && (/^\d+:\[[^\/\n][^\n]*\]$/.test(arr[arr.length - 1][0])) && (/^\[[^\/\n][^\n]*\]$/.test(m3)))
	{
		count++;
		arr[arr.length - 1].push(count + ':' + m3);
	}
	else
	{

		if (/^\[[^\/\n][^\n]*\]$/.test(m3))
		{
			count++;
			arr.push([count + ':' + m3]);
		}
		else if (/^\[\/[^\n]*\]$/.test(m3))
		{
			count++;
			arr.push([m3]);
		}
		else
		{
			arr.push([m3]);
		}

	}


}


arr.push([s]);



s = '';

for (let i = 0; i < arr.length; i++)
{

	let r = arr[i];


	if (r.length > 1)
	{
		r = sorttags(r, false);
	}
	else
	{
		let m;
		if (m = /^\d+:(\[[^\/\n][^\n]*\])$/.exec(r[0]))
		{
			r[0] = m[1];
		}

	}


	s += r.join("");

}

//|||||||||||||||||||| OPEN TAGS SORT END ||||||||||||||||||||

//------------------------------------------------------------

//|||||||||||||||||||| CLOSIG TAGS SORT START ||||||||||||||||


count = 0;

tags.length = 0;

t = s;

while (m = /^([^]*)(\\*)(\[(?:\/?(?:com|[\*'bcipu]|ex|trn1?|!trs|sub|sup)|(?:c [a-z]{3,50}|lang id=[0-9]{1,5}|lang name=\"[a-zA-Z]{5,22}\"|\/lang))\])[^]*?$/.exec(t))
{



	let m1 = m[1];
	let m2 = m[2];
	let m3 = m[3];
	t = m1;

	if ((m2.length % 2) === 1)
	{
		continue;
	}
	

	count++;

	if (/^\[[^\n\/]*\]$/.test(m3))
	{
		tags.push([count, m3]);
	}


}



arr.length = 0;

count = 0;

while (m = /^([^]*)(\\*)(\[(?:\/?(?:com|[\*'bcipu]|ex|trn1?|!trs|sub|sup)|(?:c [a-z]{3,50}|lang id=[0-9]{1,5}|lang name=\"[a-zA-Z]{5,22}\"|\/lang))\])([^]*?)$/.exec(s))
{


	let m1 = m[1];
	let m2 = m[2];
	let m3 = m[3];
	let m4 = m[4];

	s = m1 + m2;

	if (m4 !== '')
	{
		arr.push([m4]);
	}

	if ((m2.length % 2) === 1)
	{
		continue;
	}


	if ((arr.length > 0) && (/^\d+:\[\/[^\n]*\]$/.test(arr[arr.length - 1][0])) && (/^\[\/[^\n]*\]$/.test(m3)))
	{
		count++;
		arr[arr.length - 1].push(count + ':' + m3);

	}
	else
	{

		if (/^\[\/[^\n]*\]$/.test(m3))
		{
			count++;
			arr.push([count + ':' + m3]);
		}
		else if (/^\[[^\/\n][^\n]*\]$/.test(m3))
		{
			count++;
			arr.push([m3]);
		}
		else
		{
			arr.push([m3]);
		}

	}


}


arr.push([s]);

s = '';

for (let i = 0; i < arr.length; i++)
{

	let r = arr[i];


	if (arr[i].length > 1)
	{

		arr[i] = sorttags(arr[i], true);
	}
	else
	{
		let m;
		if (m = /^\d+:(\[\/[^\n]*\])$/.exec(arr[i][0]))
		{
			arr[i][0] = m[1];
		}

	}



}


arr.reverse(); 

for (let i = 0; i < arr.length; i++)
{

	let r = arr[i];
	s += r.join("");

}


//|||||||||||||||||||| CLOSIG TAGS SORT END ||||||||||||||||


