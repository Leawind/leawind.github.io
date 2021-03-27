
start py -m http.server
edge "http://localhost:8000/test.htm"
if %errorlevel% equ 1 (
	chrome "http://localhost:8000/test.htm"
)