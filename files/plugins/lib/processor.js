'use strict'

module.exports = {
  toTrim: {
    leftUntil: { string: '<body', regexp: '' },
    rightFrom: { string: '</html', regexp: '' }
  },

  toExtract: {
    cssSelectors: [
      // '#dict-header',
      // '#dict-body.content',
    ],
    regexp: ''
  },

  toRemove: {
    cssSelectors: [
      // 'input',
      // 'label',
    ],
    regexp: [
      // '<input\\b[^>]*>',
      // '</?label\\b[^>]*>'
    ]
  },

  toParse: true,

  asDocument: false,

  normalize: true,

  separator: '$$$',

  // clean: true,

  processPage: function (html, o) {
    function checkIfDocument (str) {
      return /^\s*<(!doctype|html|head|body)\b/i.test(str)
    }

    function normalizeHTML (str) {
      return str.replace(/[\t\n\v\f\r\x20\x85]+/g, ' ').trim()
    }

    const iniIdx = Boolean(this.toTrim.leftUntil.string)
      ? html.indexOf(this.toTrim.leftUntil.string)
      : Boolean(this.toTrim.leftUntil.regexp)
      ? html.search(new RegExp(this.toTrim.leftUntil.regexp, 'i'))
      : -1
    const endIdx = Boolean(this.toTrim.rightFrom.string)
      ? html.indexOf(this.toTrim.rightFrom.string)
      : Boolean(this.toTrim.rightFrom.regexp)
      ? html.search(new RegExp(this.toTrim.rightFrom.regexp, 'i'))
      : -1

    if (iniIdx !== -1 && endIdx !== -1) {
      html = html.substring(iniIdx, endIdx)
    }

    if (Boolean(this.toExtract.regexp)) {
      html = Array.from(
        html.matchAll(new RegExp(this.toExtract.regexp, 'gi')),
        m => m[0]
      ).join(this.separator)
    }

    const regExToRemove = this.toRemove.regexp.filter(re => Boolean(re)).join('|')
    if (regExToRemove.length) {
      console.log(regExToRemove)
      html = html.replace(new RegExp(regExToRemove, 'gi'), '')
    }

    if (!html.trim().length) return ''

    if (this.toParse) {
      const cheerio = o.cheerio
      const $ = cheerio.load(
        html,
        null,
        this.asDocument ? checkIfDocument(html) : false
      )

      const cssToExtract = this.toExtract.cssSelectors.filter(sel => Boolean(sel))
      const $set = cssToExtract.length ? $(cssToExtract.join(', ')) : $.root()

      const cssToRemove = this.toRemove.cssSelectors.filter(sel => Boolean(sel))
      if (cssToRemove.length) $set.find(cssToRemove.join(', ')).remove()
      html = $set
        .toArray()
        .map(el => (this.normalize ? normalizeHTML($.html(el)) : $.html(el)))
        .join(this.separator)
    } else if (this.normalize) {
      html = normalizeHTML(html)
    }
    return html
  }
}
