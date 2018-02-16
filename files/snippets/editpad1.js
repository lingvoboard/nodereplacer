/*

Скрипт предназначен для запуска из EditPad-а nodereplacer.js с передачей ему на обработку через stdin содержимого файла в октивном окне.

Настройка:
Окно "Configure External Tools"
Вкладка "Standart I/O"
В разделе "What to send to the tool's standard input" нужно поставить галку напротив "Current file" или "Selected text"

Для использования на вашей конкретной системе необходимо изменить:
 - пути к временным файлам в значениях переменных input и output (лучше, если эти файлы будут создаваться на RAM-диске, если позволяет его объём)
 - путь к nodereplacer.js
 - аргументы для nodereplacer.js под каждую конкретную задачу, согласно документации - http://lingvoboard.ru/store/html/nodereplacer/help/index.htm
*/

'use strict';

const fs = require('fs');
const readline = require('readline');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

let input = 'R:\\TEMP\\temp_in.txt';
let output = 'R:\\TEMP\\temp_out.txt';

fs.writeFileSync(input, '', {
	encoding: 'utf8',
	flag: 'w'
});
fs.writeFileSync(output, '', {
	encoding: 'utf8',
	flag: 'w'
});

(async () => {
	const count = await readstdin();

	const { stdout, stderr } = await exec(
		`node --harmony_regexp_lookbehind C:\\nodereplacer\\nodereplacer.js -stags ${input} ${output}`
	);

	process.stdout.write(stderr);

	const result = await readoutput();

	fs.unlinkSync(input);
	fs.unlinkSync(output);
})();

function readstdin() {
	let count = 0;

	return new Promise((resolve, reject) => {
		readline
			.createInterface({
				input: process.stdin
			})
			.on('line', line => {
				count++;

				if (line.charCodeAt(line.length - 1) === 26) {
					line = line.substring(0, line.length - 1);
					line = line.length ? line : null;
					if (line !== null) {
						fs.writeFileSync(input, line, {
							encoding: 'utf8',
							flag: 'a'
						});
					}
				} else {
					fs.writeFileSync(input, line + '\n', {
						encoding: 'utf8',
						flag: 'a'
					});
				}
			})
			.on('close', () => {
				resolve(count);
			});
	});
}

function readoutput() {
	return new Promise((resolve, reject) => {
		readline
			.createInterface({
				input: fs.createReadStream(output, 'utf8')
			})
			.on('line', line => {
				console.log(line);
			})
			.on('close', () => {
				resolve(true);
			});
	});
}

