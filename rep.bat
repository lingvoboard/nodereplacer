@ECHO OFF
if "%1" == "-h" (
	start firefox.exe C:\U\nodereplacer\help\index.htm 
) ELSE (
	node --harmony_regexp_lookbehind --harmony_regexp_property C:\U\nodereplacer\nodereplacer.js %*
	pause
)
