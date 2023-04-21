#!/bin/bash

db_dir='api/db'
db_file="${db_dir}/drinks.db"
reset_file="${db_dir}/reset.sql"
dump_file="${db_dir}/dump.sql"
import="${db_dir}/import.py"

reset_db() {
	rm -f "$db_file"

	if [ ! -f "$db_file" ]; then
		sqlite3 -init "$reset_file" "$db_file" .quit && echo "Database successfully generated"
		python3 "$import"
	fi
}

run_backend() {
	if [ ! -f $db_file ]; then
		echo "No database file found. Run $0 reset to generate it"
		exit 1
	fi

	cd api && python3 -m flask run
}

fill_db() {
	rm -f "$db_file"

	if [ ! -f "$db_file" ]; then
		sqlite3 -init "$dump_file" "$db_file" .quit && echo "Database successfully generated"
	fi
}

if [ "$#" -eq 0 ]; then
	run_backend
elif [ "$1" = "run" ]; then
	run_backend
elif [ "$1" = "reset" ]; then
	reset_db
elif [ "$1" = "fill" ]; then
	fill_db
else
	exit 1
fi
