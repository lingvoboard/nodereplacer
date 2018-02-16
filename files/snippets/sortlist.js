/*


Командная строка:
rep -rt sortlist.js list.txt output.txt	

Предназначение:
Сортировка простого списка с удалением дубликатов.

*/

function onstart()
{
	o.byline();
}

if (o.tab[s.trim().toLowerCase()] === undefined)
{
	o.tab[s.trim().toLowerCase()] = 0;
}

s = null;

function onexit()
{
	let arr = Object.keys(o.tab).sort();
	for (let v of arr) o.res.push(v);
}
