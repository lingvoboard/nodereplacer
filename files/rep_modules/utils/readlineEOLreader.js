'use strict';
const fs = require('fs');

class readline_eol_reader
{

	constructor(in_encoding, inputfile, fileSize, block_size)
	{
		this.in_encoding = in_encoding;
		this.fileSize = fileSize;
		this.block_size = block_size;
		this.ifd = fs.openSync(inputfile, 'r');
		this.magic = {'0d0a': '\r\n', '0a': '\n', '0d': '\r',};
		this.buffer_arr = [];
		this.disk_access_counter = 0;
		this.trim_endings = function(hex) {
			return hex.match(/([\w]{2})/g).filter(val=>{return (val === '0a' || val === '0d')}).join("");
		};
		
		this.get_one_closest_eol = function(offset) {


			let eol = "";
			let len = 2;
			let shift = 0;

			
			if (this.in_encoding === 'utf16le')
			{
				len = 4;
				shift = 1;
			}


			const buf = Buffer.alloc(len);
			fs.readSync(this.ifd, buf, 0, len, offset-shift);


			this.disk_access_counter++;
			const hex = this.trim_endings(buf.toString('hex'));	


			for (let magicNumber in this.magic)
			{
				if (hex.indexOf(magicNumber) === 0)
				{
					eol = this.magic[magicNumber];
					break;
				}
			}
			
			return eol;
			
		};
		
		this.get_eols_from_block = function(offset) {

			let len = this.block_size;

			if ((offset + this.block_size) > this.fileSize)
			{
				len = this.fileSize - offset;
			}
			
			const buf = Buffer.alloc(len);
			fs.readSync(this.ifd, buf, 0, len, offset);
			this.disk_access_counter++;
			let str = buf.toString(this.in_encoding);

			const arr = str.replace(/\r$/, "").match(/([\r\n]+)/g);

			if ((arr) && (arr.length > 0))
			{
				this.buffer_arr = arr;
				return this.buffer_arr.shift();
			}
			else
			{
				return this.get_one_closest_eol(offset);
			}
			
		};
		
	}

	
	get_eol(offset)
	{
		
		try
		{
			const in_buffer = this.buffer_arr.shift();
			
			if (in_buffer !== undefined)
			{
				return in_buffer;
			}
			else
			{
				
				return this.get_eols_from_block(offset);
				
			}
		}
		catch(e)
		{
			console.error(e)
			process.exit();
		}
		
	}


	get_disk_access_counter()
	{
		return this.disk_access_counter;
	}


}


module.exports = {

	reader: function (in_encoding, inputfile, fileSize, block_size)
	{
		return new readline_eol_reader(in_encoding, inputfile, fileSize, block_size);
	}

}
