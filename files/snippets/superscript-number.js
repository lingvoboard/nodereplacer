/*

ЗАДАЧА:
Подскажите, пожалуйста, кто знает, как эффективнее... вернее сказать,
проще заменить обычные цифры на уменьшенные (не через [sub] или [sup],
а юникодовские типа &#178;, &#179; и т. д.) при условии,
что меняются только обрамленные тегом [c]...[/c].

КОМАНДНАЯ СТРОКА:
rep -rt list.txt input.txt result.txt


ДО)

#NAME "Test (Eng-Rus)"
#INDEX_LANGUAGE "English"
#CONTENTS_LANGUAGE "Russian"
+1
    * наречие., син.: 5
    * верно [c]1[/c] [c red]2[/c]
    * двачую[c green]2355[/c] [c]9870[/c]
    * подписываюсь под всем вышесказанным [c]123[/c]
    * правильно [c]3[/c]
    * согласен


ПОСЛЕ)

#NAME "Test (Eng-Rus)"
#INDEX_LANGUAGE "English"
#CONTENTS_LANGUAGE "Russian"
+1
	* наречие., син.: 5
	* верно [c]¹[/c] [c red]²[/c]
	* двачую[c green]²³⁵⁵[/c] [c]⁹⁸⁷⁰[/c]
	* подписываюсь под всем вышесказанным [c]¹²³[/c]
	* правильно [c]³[/c]
	* согласен

_______________________________

Thanks to: https://github.com/mikolalysenko/superscript-number

*/

var SUPERSCRIPTS = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
  'a': 'ᵃ',
  'b': 'ᵇ',
  'c': 'ᶜ',
  'd': 'ᵈ',
  'e': 'ᵉ',
  'f': 'ᶠ',
  'g': 'ᵍ',
  'h': 'ʰ',
  'i': 'ⁱ',
  'j': 'ʲ',
  'k': 'ᵏ',
  'l': 'ˡ',
  'm': 'ᵐ',
  'n': 'ⁿ',
  'o': 'ᵒ',
  'p': 'ᵖ',
  'r': 'ʳ',
  's': 'ˢ',
  't': 'ᵗ',
  'u': 'ᵘ',
  'v': 'ᵛ',
  'w': 'ʷ',
  'x': 'ˣ',
  'y': 'ʸ',
  'z': 'ᶻ'
}

function superScriptNumber(num, base) {
  var numStr = num.toString(base)
  if(numStr === 'NaN')       { return 'ᴺᵃᴺ' }
  if(numStr === 'Infinity')  { return '⁺ᴵⁿᶠ' }
  if(numStr === '-Infinity') { return '⁻ᴵⁿᶠ' }
  return numStr.split('').map(function(c) {
    var supc = SUPERSCRIPTS[c]
    if(supc) {
      return supc
    }
    return ''
  }).join('')
}

s = s.replace(/(\[c(?: red| green)?\])(\d+)(\[\/c\])/g, (s, m1, m2, m3) => {
  return `${m1}${superScriptNumber(m2)}${m3}`
})

