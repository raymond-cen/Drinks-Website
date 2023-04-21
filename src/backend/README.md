## Requirements
- A recent enough flask version
- sqlite3
- python3

### On the CSE machines
The preinstalled flask version is too old. You can get around this by setting up a python venv.

1. `cd src/backend`
2. `python3 -m venv venv`
3. `pip3 install -r requirements.txt`

### On your own machine
Figure it out yourself. If it works on the CSE machines then it can't be too hard.

## Running
### Starting the server
- `./fiveset-backend` or `./fiveset-backend run`

If you don't have a database file it will tell you to generate one.

### Resetting the database
- `./fiveset-backend reset`

This will reset the database to a default state (or generate a new one if there isn't one).

## FAQ
### Why no Django?
I couldn't figure out how to use it. In hindsight I think a simpler framework is easier especially since we only need an API that the
frontend will call anyway. The only Flask specific code is in `app.py` so feel free to make it work with Django if you want.

## Trying it out
You can test that it works by sending a GET request to `/recipes`.
There's also a route for adding recipes and searching for recipes so try those out as well.
