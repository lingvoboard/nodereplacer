@ECHO OFF
if "%1" == "-h" (
	start firefox.exe https://github.com/lingvoboard/nodereplacer/blob/master/help/files/md/index.md 
) ELSE (
	node C:\U\nodereplacer\nodereplacer.js %*
	pause
)
