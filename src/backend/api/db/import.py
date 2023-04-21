import csv
import sqlite3
import random

DATABASE_FILE = 'api/db/drinks.db'

def get_random_datetime():
    year = random.randint(2000, 2021)
    month = random.randint(10, 12)
    day = random.randint(10, 30)
    hour = random.randint(12, 23)
    minute = random.randint(10, 59)
    second = random.randint(10, 59)

    s = "{}-{}-{} {}:{}:{}".format(year, month, day, hour, minute, second)
    return s

def get_db():
    # db = getattr(flask.g, '_database', None)
    # if db is None:
    db = sqlite3.connect(DATABASE_FILE)
    db.execute('PRAGMA foreign_keys = 1')
    db.row_factory = sqlite3.Row
    return db

def import_ingredients_csv():
  con = get_db()
  cur = con.cursor()
  with open('api/db/ingredients.csv', 'r') as f:
    reader = csv.reader(f)
    # Just to get rid of the first line
    columns = next(reader)[:2]
    # Edit to use ingredientids and big edits to have ingredient tags
    query = 'insert into ingredients(ingredientid, name) values(?, ?)'
    for data in reader:
      # print(data[:2])
      # data[1] so it only puts in the name
      cur.execute(query, (data[0], data[1]))

  con.commit()
  con.close()

def import_recipes_csv():
  con = get_db()
  cur = con.cursor()
  with open('api/db/recipe.csv', 'r') as f:
    reader = csv.reader(f)
    # Just to get rid of the first line
    columns = next(reader)[:2]
    # Edit to use ingredientids and big edits to have ingredient tags
    query = 'insert into recipes(recipeid, name, description, method, imageurl, creator, creationtime, popularity) values(?, ?, ?, ?, ?, ?, ?, 0)'
    for data in reader:
      # print(data[:2])
      # data[1] so it only puts in the name
      cur.execute(query, (data[0], data[1], data[2], data[3], data[4], 1, get_random_datetime()))

  con.commit()
  con.close()

def import_recipe_ingreds_csv():
  con = get_db()
  cur = con.cursor()
  with open('api/db/recipe_ingreds.csv', 'r') as f:
    reader = csv.reader(f)
    # Just to get rid of the first line
    columns = next(reader)[:2]
    # Edit to use ingredientids and big edits to have ingredient tags
    query = 'insert into has_ingredient(recipe, ingredient, quantity, measurement) values(?, ?, ?, ?)'
    for data in reader:
      # print(data[:2])
      cur.execute(query, (data[0], data[1], data[2], data[3]))

  con.commit()
  con.close()

def import_tags_csv():
  con  = get_db()
  cur = con.cursor()
  with open('api/db/tags.csv') as f:
    reader = csv.reader(f)
    next(reader)
    query = 'insert into tags(tagid, name) values (?, ?)'
    for data in reader:
        cur.execute(query, data)

    con.commit()
    con.close()

def import_has_tags_csv():
  con = get_db()
  cur = con.cursor()
  with open('api/db/has_tags.csv') as f:
      reader = csv.reader(f)
      next(reader)
      query = 'insert into has_tag(recipe, tag) values (?, ?)'
      for data in reader:
          cur.execute(query, data)
      con.commit()
      con.close()

def import_ingredient_has_tags_csv():
    con = get_db()
    cur = con.cursor()
    with open('api/db/ingredient_has_tag.csv') as f:
        reader = csv.reader(f)
        next(reader)
        query = 'insert into ingredient_has_tag(ingredient, tag) values (?, ?)'
        for data in reader:
            cur.execute(query, data)
        con.commit()
        con.close()

if __name__ == "__main__":
  import_ingredients_csv()
  import_recipes_csv()
  import_recipe_ingreds_csv()
  import_tags_csv()
  import_has_tags_csv()
  import_ingredient_has_tags_csv()
