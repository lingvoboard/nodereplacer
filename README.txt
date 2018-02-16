
1)Справка в папке help

__________________________________________________

2)Обновления nodereplacer.js можно найти здесь:
http://lingvoboard.ru/forum/viewtopic.php?f=16&t=62

__________________________________________________

3)Для пользователей Windows:

а)Отредактируйте пути в файле rep.bat если требуется.

Или можно ничего не редактировать, а просто создать папку U на диск C и распаковать там архив со скриптом.

б)Скопируйте rep.bat в папку C:\Windows\System32\

После этого скрипт можно будет запускать из любого места используя такую командную строку:

rep -rt list input.txt output.txt

Вызов справки: rep -h 

б)Скопируйте файл dictzip.exe в папку C:\Windows\System32\

__________________________________________________
	
4)Для пользователей Linux:

Добавте в .bashrc такой код:

#---- начало
	
function nodereplacer()
{
clear

if [[ $# -eq 1 ]] && [[ "$1" == "-h" ]]; then
	(firefox /home/user/path/to/nodereplacer/help/index.htm >/dev/null 2>&1 &)
elif [[ $# -eq 1 ]] && [[ "$1" == "-j" ]]; then
	(firefox /home/user/path/to/nodereplacer/help/javascript.htm >/dev/null 2>&1 &)
else
	node --harmony_regexp_lookbehind --harmony_regexp_property /home/user/path/to/nodereplacer/nodereplacer.js "$@"
	echo ''
	echo "$(tput sgr 0)$(tput setaf 3)Press Enter to return$(tput sgr 0)"
	read input
fi	
}

alias rep=nodereplacer

#---- конец

Отредактируйте пути.

После этого скрипт можно будет запускать из любого места используя такую командную строку:

rep -rt list input.txt output.txt

Вызов справки: rep -h и rep -j 
