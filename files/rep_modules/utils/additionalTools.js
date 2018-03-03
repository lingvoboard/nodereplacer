'use strict'

module.exports = {
  httpget: function (url, options) {
    /*
		options.headers = {
			'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0',
			'Cookie':'...amembernamecookie=XXXXXX; apasswordcookie=XXXXX;...'
		};
		*/
    return new Promise((resolve, reject) => {
      const headers =
        options && options.headers && typeof options.headers === 'object'
          ? options.headers
          : {
            'User-Agent':
                'Mozilla/5.0 (X11; Linux x86_64; rv:56.0) Gecko/20100101 Firefox/56.0'
          }
      const http = url.startsWith('https') ? require('https') : require('http')
      const parsedUrl = require('url').parse(url, true, true)
      const request = http.get(
        {
          host: parsedUrl.host,
          path: parsedUrl.path,
          headers: headers
        },
        res => {
          if (options && options.encoding) res.setEncoding(options.encoding)

          if (res.statusCode < 200 || res.statusCode > 299) {
            reject(
              new Error('Failed to load page, status code: ' + res.statusCode)
            )
          }

          const chunks = []
          res.on('data', chunk => chunks.push(chunk))
          res.on('end', () => {
            const buf = Buffer.concat(chunks)
            if (options && options.charset) {
              resolve(require('iconv-lite').decode(buf, options.charset))
            } else {
              resolve(buf)
            }
          })
        }
      )

      request.on('error', err => reject(err.message))
    })
  }
}
