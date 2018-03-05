@ECHO OFF
if "%1" == "-h" (
	start firefox.exe https://github.com/lingvoboard/nodereplacer/blob/master/help/files/md/index.md 
) ELSE (
	node --harmony_regexp_lookbehind --harmony_regexp_property C:\U\nodereplacer\nodereplacer.js %*
	pause
)
