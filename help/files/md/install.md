# ИНСТРУКЦИЯ К СКРИПТУ nodereplacer.js

### Содержание инструкции:

* **Установка**
* [Общий раздел](index.md)
* [Замены](replacer.md)
* [Дополнительные плагины](plugins.md)
* [Раздел для программистов](javascript.md)


УСТАНОВКА

![warning.png](./../warning.png)
Если **nodereplacer.js** прекращает работу с сообщением, которое содержит "`out of memory`", такое может произойти при обработке очень больших файлов (если обработка сопровождается чтением всего входного файла в оперативную память), то можно попробовать запуск скрипта с ключом `--max_old_space_size=4096`</br>
Отредактируйте для этого файл rep.bat, должно быть так:</br>
`node --max_old_space_size=4096...`</br>
Значение ключа может быть и другим, в приведённом примере 4096 означает 4 гигабайта.

## Содержание раздела:

1. [Системные требования](#Системные-требования)
2. [Установка](#Установка)
3. [Подготовка](#Подготовка)

### Системные требования

Для запуска скрипта необходимо чтобы на вашем компьютере была установлена программная платформа [Node.js](https://ru.wikipedia.org/wiki/Node.js) версии желательно не ниже **9.7.0**</br>
Если не установлена, то берём [здесь](https://nodejs.org/).

### Установка
```
git clone https://github.com/lingvoboard/nodereplacer.git
cd nodereplacer
npm install
```

Альтернативный вариант:
* Скачайте zip-архив.
* Распакуйте его.
* Измените имя папки **nodereplacer-master** (нужно чтобы было просто **nodereplacer**).
* Зайдите в папку **nodereplacer** и установите внешние Node.js модули командой `npm install`

### Подготовка

На Windows:

* Отредактируйте пути в файле **rep.bat**
* Скопируйте **rep.bat** в папку `C:\Windows\System32\`

После этого скрипт можно будет запускать из любого места используя команды такого вида:</br>
`rep -rt list input.txt output.txt`

Вместо:</br>
`node nodereplacer.js -rt list.js input.txt output.txt`

Т.е. при использовании батника `rep` = `node nodereplacer.js`

И при этом не требуется копирование обрабатываемых файлов в папку, в которой находится **nodereplacer.js** или использование полных путей.

* Скопируйте файл **dictzip.exe** в папку `C:\Windows\System32\`

Он требуется для [этой операции](/help/files/md/index.md#5-node-nodereplacerjs-inputglsoutputifo)

Команда для вызова справки: `rep -h`

<hr>

На Linux:

Добавьте в **.bashrc** файл следующий код:

```bash
function nodereplacer()
{
  clear
  if [[ $# -eq 1 ]] && [[ "$1" == "-h" ]]; then
          (firefox https://github.com/lingvoboard/nodereplacer/blob/master/help/files/md/index.md >/dev/null 2>&1 &)
  else
          node полный_путь/nodereplacer.js "$@"
          echo ''
          echo "$(tput sgr 0)$(tput setaf 3)Press Enter to return$(tput sgr 0)"
          read input
  fi      
}

alias rep=nodereplacer
```

Отредактируйте пути.

Установите **dictzip** (опционально)

<hr>

