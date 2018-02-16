"use strict";
const util = require('util');

class memory_usage
{
	constructor(time)
	{
		this.interval = time;
		this.rss_max = 0;
		this.updater;
	}
	
	start()
	{
		this.updater = setInterval(()=>{

			let rss = process.memoryUsage().rss;
			if (rss)
			{
				rss = parseInt(rss);
				if (rss > this.rss_max)
				{
					this.rss_max = rss;
				}
			}
			
			
		}, this.interval);
	}
	
	stop()
	{
		clearInterval(this.updater);
	}

	get()
	{
		return (this.rss_max/1024/1024);
	}

}


module.exports = {

	mem: function (time)
	{
		return new memory_usage(time);
	}

}
