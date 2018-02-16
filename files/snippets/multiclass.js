/*

Командная строка:
rep -rd multiclass.js input.txt output.txt

Назначение:
<dsl class="m2"><dsl class="asterisk"><dsl class="ref"> => <span class="m2 asterisk ref">


Пример:

ДО)

overlive
	\[<dsl class="t">ˌəuv(ə)ˈlɪv</dsl>\]
	<dsl class="p">гл.</dsl><dsl class="c">;</dsl> <dsl class="p">уст.</dsl>
	<dsl class="m1">1) <dsl class="trn">пережить <dsl class="i"><dsl class="com">(кого-л.)</dsl></dsl></dsl></dsl>
	<dsl class="m2"><dsl class="asterisk"><dsl class="ex"><dsl class="1033">He overlived his wife.</dsl> — Он пережил свою жену.</dsl></dsl></dsl>
	<dsl class="m1">2) <dsl class="trn"><dsl class="steelblue">пережить, перенести</dsl></dsl></dsl>
	<dsl class="m2"><dsl class="asterisk"><dsl class="ex"><dsl class="1033">to overlive much trouble</dsl> — пережить много горя</dsl></dsl></dsl>
	<dsl class="m2"><dsl class="asterisk"><dsl class="b">Syn:</dsl></dsl></dsl>
	<dsl class="m2"><dsl class="asterisk"><dsl class="ref">outlive</dsl></dsl></dsl>

ПОСЛЕ)

overlive
\[<span class="t">ˌəuv(ə)ˈlɪv</span>\] <span class="p">гл.</span><span class="c">;</span> <span class="p">уст.</span> <span class="m1">1) <span class="trn">пережить <span class="i com">(кого-л.)</span></span></span> <span class="m2 asterisk ex"><span class="1033">He overlived his wife.</span> — Он пережил свою жену.</span> <span class="m1">2) <span class="trn steelblue">пережить, перенести</span></span> <span class="m2 asterisk ex"><span class="1033">to overlive much trouble</span> — пережить много горя</span> <span class="m2 asterisk b">Syn:</span> <span class="m2 asterisk ref">outlive</span>


*/


let cheerio = require('cheerio');

let $ = cheerio.load(o.dsl[1], {
	decodeEntities: false,
	normalizeWhitespace: true
});

function merge_tags() {
	let dsls = $('dsl');

	if (dsls.length === 0) {
		return true;
	}

	let dsl = dsls.eq(0);

	let kids = dsl.find('dsl');

	if (kids.length === 0) {
		dsl.replaceWith(
			'<span class="' + dsl.attr('class') + '">' + dsl.html() + '</span>'
		);
		return false;
	}

	let clone = dsls.clone();

	clone.eq(0).find('dsl').eq(0).remove();

	if (clone.html().trim() === '') {
		let kid = kids.eq(0);

		dsl.attr('class', dsl.attr('class') + ' ' + kid.attr('class'));

		kid.replaceWith(kid.html());
	} else {
		dsl.replaceWith(
			'<span class="' + dsl.attr('class') + '">' + dsl.html() + '</span>'
		);
	}

	return false;
}

let count = 0;

let r = false;

while (r === false && count < 500) {
	r = merge_tags();

	count++;
}

s = o.dsl[2].join('|') + '\n' + $.html().trim() + '\n\n';
