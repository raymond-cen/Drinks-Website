@echo off

set db_dir=api\db
set db_file=%db_dir%\drinks.db
set reset_file=%db_dir%\reset.sql

IF "%1"=="" GOTO DO_FLASK
IF "%2"=="" GOTO HAVE_1
GOTO DO_ERROR

:HAVE_1
IF "%1"=="reset" GOTO DO_RESET
IF "%1"=="run" GOTO DO_FLASK
GOTO DO_ERROR

:DO_FLASK
cd api
python -m flask run
GOTO DO_EXIT

:DO_RESET
del /f "%db_file%"
sqlite3 -init %reset_file% %db_file% .quit
GOTO DO_EXIT

:DO_EXIT
echo exit
exit

:DO_ERROR
echo error