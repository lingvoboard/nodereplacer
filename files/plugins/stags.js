//Сортирует DSL теги.

function onstart() {
  
  if (process.argv.length === 5 && o.utils.fileExists(process.argv[3])) {
    // node nodereplacer.js -stags input.txt output.txt
    o.inputfile = process.argv[3]
    o.outputfile = process.argv[4]

    if (o.outputfile !== null && path.isAbsolute(o.outputfile)) {
      o.error_log_path = path.dirname(o.outputfile) + path.sep + 'error.log'
    } else {
      o.error_log_path = 'error.log'
    }

    o.by_dsl_article()
    
  } else {
    console.log('Invalid command line.')
    process.exit()
  }

}

function trimOpeningTag (str) {
  return str.replace(cTagRe, 'c').replace(langTagRe, 'lang')
}

function isChanged (checkArr, refArr) {
  for (let i = 0; i < checkArr.length; i++) {
    if (checkArr[i][4] !== refArr[i][4]) return true
  }
  return false
}

function replaceSlicesArr (str, rangesArr) {
  if (rangesArr.length > 0) {
    const tails = str.slice(rangesArr[rangesArr.length - 1][1])
    str = rangesArr.reduce((acc, val, i, arr) => {
      const beginning = i === 0 ? 0 : arr[i - 1][1]
      const ending = arr[i][0]
      return acc + str.slice(beginning, ending) + arr[i][2]
    }, '')
    str += tails
  }
  return str
}

/*******************************************************************/
const cTagRe = /^\[c [a-z]+\]/
const langTagRe = /^\[lang [^\]]+\]/
const allTagRe = /(\\*)(\[(?:\/?(com|[*'bcipu]|ex|lang|trn1?|!trs|sub|sup)|(?:c [a-z]{3,50}|lang (?:id=\d{1,5}|name="\w{5,22}")))\])/g
const allTagMapArr = []
let prevIdx = -1
let count = 0
let tagMatchArr

while ((tagMatchArr = allTagRe.exec(s))) {
  if (tagMatchArr[1].length % 2 === 1) continue

  const tag = tagMatchArr[2]
  const closing = tag.indexOf('/') === 1
  const adj = prevIdx === allTagRe.lastIndex - tag.length
  const trimmed = tagMatchArr[3] ? tagMatchArr[3] : trimOpeningTag(tag)

  const statArr = [tag, trimmed, closing, allTagRe.lastIndex, ++count, -1, -1]

  if (adj) allTagMapArr[allTagMapArr.length - 1].push(statArr)
  else allTagMapArr.push([statArr])

  prevIdx = allTagRe.lastIndex
}

const allTagArr = new Array(count)
const allAdjArr = []
let allAdjCount = 0
count = 0

// get an array of all adjacent tags
allTagMapArr.forEach(val => {
  if (val.length === 1) {
    allTagArr[count++] = val[0]
  } else {
    val.forEach(tag => {
      allTagArr[count++] = tag
      if (!allAdjArr[allAdjCount]) allAdjArr[allAdjCount] = []
      allAdjArr[allAdjCount].push(tag)
    })
    allAdjCount++
  }
})

const openingTagArr = allTagArr.filter(tag => !tag[2])
const closingTagArr = allTagArr.filter(tag => tag[2])

// sorting adjacent tags function
const sortBlock = (adjArr, closing) => {
  adjArr.forEach(block => {
    if (!closing) {
      const openingTagsInBlok = block.reduce((obj, tag, i) => {
        if (!tag[2]) {
          if (obj[tag[1]] === undefined) obj[tag[1]] = [i]
          else obj[tag[1]].push(i)
        }
        return obj
      }, Object.create(null))

      const closingTagsInBlock = block.reduce((obj, tag, i) => {
        if (tag[2]) {
          if (obj[tag[1]] === undefined) obj[tag[1]] = [i]
          else obj[tag[1]].push(i)
        }
        return obj
      }, Object.create(null))

      for (let i = 0; i < block.length; i++) {
        const tag = block[i]
        if (tag[2]) {
          if (openingTagsInBlok[tag[1]] === undefined) tag[6] = 0
          else {
            if (openingTagsInBlok[tag[1]].some(idx => idx < i)) {
              tag[6] = 2
            } else tag[6] = 0
          }
        } else {
          if (closingTagsInBlock[tag[1]] === undefined) tag[6] = 3
          else {
            if (closingTagsInBlock[tag[1]].some(idx => idx > i)) {
              tag[6] = 1
            } else tag[6] = 3
          }
        }
      }
    }

    if (block.length > 1) {
      const newIdxArr = new Array(block.length)
      const min = block[0][4]

      for (let i = 0; i < block.length; i++) {
        const tag = block[i]
        const bool = tag[2] === closing

        if (bool) {
          const currTagPos = tag[5] === -1 ? tag[4] : tag[5]
          let oppTagPos = -1
          if (closing) {
            for (let j = openingTagArr.length - 1; j >= 0; j--) {
              const oTag = openingTagArr[j]
              oppTagPos = oTag[oTag[5] === -1 ? 4 : 5]
              if (currTagPos > oppTagPos && tag[1] === oTag[1]) break
            }
          } else {
            for (let j = 0; j < closingTagArr.length; j++) {
              const cTag = closingTagArr[j]
              oppTagPos = cTag[4]
              if (currTagPos < oppTagPos && tag[1] === cTag[1]) break
            }
          }

          newIdxArr[i] = [tag, oppTagPos]
        } else {
          newIdxArr[i] = [tag, closing ? -1 : tag[5]]
        }
      }

      newIdxArr.sort((a, b) => b[1] - a[1])
      if (
        isChanged(
          newIdxArr
            .map(val => val[0])
            .sort((a, b) => a[5] - b[5])
            .sort((a, b) => a[6] - b[6]),
          block
        )
      ) {
        newIdxArr.forEach(
          (arr, idx) => (arr[0][5] = arr[0][5] === -1 ? idx + min : arr[0][5])
        )
      }
    }
  })
}

sortBlock(allAdjArr, false)
sortBlock(allAdjArr, true)

// get slices to replace
const slices = allAdjArr
  .filter(val => val[0][5] !== -1)
  .map(val => {
    const start = val[0][3] - val[0][0].length
    const end = val[val.length - 1][3]
    const ret = val
      .sort((a, b) => a[5] - b[5])
      .sort((a, b) => a[6] - b[6])
      .map(v => v[0])
      .join('')
    return [start, end, ret]
  })

s = replaceSlicesArr(s, slices)
