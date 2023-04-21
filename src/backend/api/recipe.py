import sqlite3
import reviews
import moderation
import datetime
import random


def put_average_rating(con, recipes):
    for recipe in recipes:
        cur = con.cursor()
        query = 'select count(rating) as count, sum(rating) as total from reviews\n'\
                'where recipeid = ?'
        cur.execute(query, (recipe['recipeid'],))

        row = dict(cur.fetchone())
        count = row.get('count')
        total = row.get('total')

        if count > 0:
            recipe['average_rating'] = total / count
        else:
            recipe['average_rating'] = -1

    return recipes


def get_recipes(con):
    cur = con.cursor()
    query = 'select * from recipes'
    cur.execute(query)

    result = [dict(x) for x in cur.fetchall()]
    put_average_rating(con, result)

    return result


def add_recipe(con, userid, data):
    if not data.get('name'):
        raise ValueError('All recipes must have a name')

    ingredient_ids = list(map(int, data.get('ingredients', [])))
    tag_ids = list(map(int, data.get('tags', [])))

    # Insert recipe
    cur = con.cursor()
    query = 'insert into recipes (name, description, method, imageurl, creator, creationtime, popularity) values (?, ?, ?, ?, ?, ?, ?)'
    try:
        cur.execute(query, (data.get('name'), data.get('description'), data.get('method'), data.get(
            'imageurl'), userid, datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 0))
    except sqlite3.IntegrityError:
        raise ValueError('Recipe name already exists')

    recipeid = cur.lastrowid

    # Insert ingredients
    ingredient_info = data.get("ingredient_info", dict())
    if not isinstance(ingredient_info, dict):
        raise ValueError("ingredient_info needs to be an object")

    ingredient_rows = []
    for x in ingredient_ids:
        info = ingredient_info.get(str(x), dict())
        quantity = info.get("quantity")
        measurement = info.get("measurement")
        ingredient_rows.append((recipeid, x, quantity, measurement))

    cur = con.cursor()
    query = 'insert into has_ingredient (recipe, ingredient, quantity, measurement) values (?, ?, ?, ?)'

    try:
        cur.executemany(query, ingredient_rows)
    except sqlite3.IntegrityError:
        raise ValueError('invalid ingredient id')

    # Get tags from ingredients
    cur = con.cursor()
    query = 'select distinct tag from ingredient_has_tag where ingredient in ({})'.format(
        ','.join(('?',)*len(ingredient_ids)))
    cur.execute(query, ingredient_ids)
    tags2 = [x['tag'] for x in cur.fetchall()]
    tag_ids = set(tags2) | set(tag_ids)

    cur = con.cursor()
    cur.execute('select tagid from tags where name = ?', ('alcohol',))
    alcohol_tag = cur.fetchone()
    cur = con.cursor()
    cur.execute('select tagid from tags where name = ?', ('non-alcoholic',))
    nonalcohol_tag = cur.fetchone()

    if alcohol_tag and nonalcohol_tag:
        if alcohol_tag['tagid'] not in tag_ids:
            tag_ids.add(nonalcohol_tag['tagid'])
    print(tag_ids)

    # Insert tags
    tag_rows = [(recipeid, x) for x in tag_ids]

    cur = con.cursor()
    query = 'insert into has_tag (recipe, tag) values (?, ?)'

    try:
        cur.executemany(query, tag_rows)
    except sqlite3.IntegrityError:
        raise ValueError('invalid tag id')

    # Done
    con.commit()

    return recipeid


def edit_recipe(con, userid, recipeid, data):
    if not data.get('name'):
        raise ValueError('All recipes must have a name')

    ingredient_ids = list(map(int, data.get('ingredients', [])))
    tag_ids = list(map(int, data.get('tags', [])))

    cur = con.cursor()
    query = 'select * from recipes where recipeid=? and creator=?'
    cur.execute(query, (recipeid, userid))
    row = cur.fetchone()
    if row is None:
        raise ValueError('You must be the creator of the recipe to edit it')

    query = 'update recipes set name=?, description=?, method=? where recipeid=? and creator=?'
    try:
        cur.execute(query, (data.get('name'), data.get(
            'description'), data.get('method'), recipeid, userid))
    except sqlite3.IntegrityError:
        raise ValueError('Recipe name already exists')

    # Update ingredients
    cur = con.cursor()
    ingredient_rows = [(recipeid, x) for x in ingredient_ids]

    cur = con.cursor()
    query = 'delete from has_ingredient where recipe=?'
    cur.execute(query, (int(recipeid),))

    query = 'insert into has_ingredient (recipe, ingredient) values (?, ?)'
    try:
        cur.executemany(query, ingredient_rows)
    except sqlite3.IntegrityError:
        raise ValueError('invalid ingredient id')

    # Update tags
    tag_rows = [(recipeid, x) for x in tag_ids]

    cur = con.cursor()
    query = 'delete from has_tag where recipe=?'
    cur.execute(query, (int(recipeid),))

    query = 'insert into has_tag (recipe, tag) values (?, ?)'
    try:
        cur.executemany(query, tag_rows)
    except sqlite3.IntegrityError:
        raise ValueError('invalid tag id')

    con.commit()
    return


def delete_recipe(con, data):
    recipeid = data.get('recipeid')
    userid = data.get('userid')

    cur = con.cursor()
    if moderation.is_admin(con, data):
        remove_recipe_dependencies(con, data)
        query = 'delete from recipes where recipeid=?'
        cur.execute(query, (recipeid,))
    else:
        query = 'select * from recipes where recipeid=? and creator=?'
        cur.execute(query, (recipeid, userid))
        row = cur.fetchone()
        if row is None:
            raise ValueError(
                'You must be the creator of the recipe to delete it')
        else:
            remove_recipe_dependencies(con, data)
            query = 'delete from recipes where recipeid=? and creator=?'
            cur.execute(query, (recipeid, userid))

    con.commit()
    return

# Remove all recipe dependencies to prevent foreign key constraints when deleting


def remove_recipe_dependencies(con, data):
    reviews.delete_all_reviews(con, data)

    cur = con.cursor()
    query = 'delete from has_ingredient where recipe=?'
    cur.execute(query, (data.get('recipeid'),))

    query = 'delete from has_tag where recipe=?'
    cur.execute(query, (data.get('recipeid'),))

    con.commit()
    return

# Gets all recipes saved by a user


def get_saved_recipes(con, data):
    cur = con.cursor()
    query = 'select recipeid from saved_recipes where userid=?'
    cur.execute(query, (data.get('userid'),))

    recipes_list = []
    for row in cur.fetchall():
        row_dict = dict(row)
        query = 'select * from recipes where recipeid=?'
        cur.execute(query, (row_dict.get('recipeid'),))
        recipe_info = dict(cur.fetchone())

        ingredient_id_list = cur.execute(
            "SELECT ingredient FROM has_ingredient WHERE recipe = ?", (row_dict.get("recipeid"),)).fetchall()

        ingredient_name_list = []
        for ingredient in ingredient_id_list:
            name = cur.execute(
                "SELECT name FROM ingredients WHERE ingredientid = ?", (ingredient['ingredient'],)).fetchone()
            ingredient_name_list.append(name['name'])

        recipe_info["ingredients"] = ingredient_name_list

        recipes_list.append(recipe_info)
    return recipes_list

# Saves recipe for a user given recipeid


def add_saved_recipe(con, data):
    cur = con.cursor()
    query = 'insert into saved_recipes (recipeid, userid) values (?, ?)'
    cur.execute(query, (data.get('recipeid'), data.get('userid')))

    con.commit()
    return

# Removes a saved recipe


def remove_saved_recipe(con, data):
    cur = con.cursor()
    query = 'delete from saved_recipes where recipeid=? and userid=?'
    cur.execute(query, (data.get('recipeid'), data.get('userid')))

    con.commit()
    return

# Gets all recipes created by a user


def get_user_recipes(con, data):
    cur = con.cursor()
    query = 'select recipeid from recipes where creator=?'
    cur.execute(query, (data.get('userid'),))

    recipes_list = []
    for row in cur.fetchall():
        row_dict = dict(row)
        query = 'select * from recipes where recipeid=?'
        cur.execute(query, (row_dict.get('recipeid'),))
        recipe_info = dict(cur.fetchone())

        ingredient_id_list = cur.execute(
            "SELECT ingredient FROM has_ingredient WHERE recipe = ?", (row_dict.get("recipeid"),)).fetchall()

        ingredient_name_list = []
        for ingredient in ingredient_id_list:
            name = cur.execute(
                "SELECT name FROM ingredients WHERE ingredientid = ?", (ingredient['ingredient'],)).fetchone()
            ingredient_name_list.append(name['name'])

        recipe_info["ingredients"] = ingredient_name_list

        recipes_list.append(recipe_info)

    return recipes_list


def search_recipes_name(con, name):
    cur = con.cursor()
    query = 'select recipeid from recipes\n'\
        'where lower(name) like ?\n'

    cur.execute(query, ('%' + name + '%',))

    return set(x['recipeid'] for x in cur.fetchall())


def search_recipes_only_generic(con, seq, table1, x1):
    cur = con.cursor()
    query = ''\
        'select recipeid, {} from recipes\n'\
        'left join {} on (recipe = recipeid)\norder by recipeid'.format(
            x1, table1)
    cur.execute(query)

    allowed = set(seq)
    allids = set()
    removedids = set()
    for recipeid, ing in cur.fetchall():
        allids.add(recipeid)
        if ing and ing not in allowed:
            removedids.add(recipeid)

    return allids - removedids


def search_recipes_tags_generic(con, seq, logic, table1, x1):
    if logic == 'only':
        return search_recipes_only_generic(con, seq, table1, x1)

    cur = con.cursor()
    values = []
    query = ''\
        'select recipeid from recipes\n'\
        'join {} on ({}.recipe = recipes.recipeid)\n'.format(table1, table1)

    query += 'where {}.{} in ({})\n'.format(table1,
                                            x1, ','.join(('?',)*len(seq)))
    values += seq

    query += 'group by recipes.recipeid\n'\

    if logic == 'and':
        query += 'having count(recipes.recipeid)=?\n'
        values.append(len(seq))

    cur.execute(query, values)

    return set(x['recipeid'] for x in cur.fetchall())


def search_recipes_tags(con, tags, logic):
    return search_recipes_tags_generic(con, tags, logic, 'has_tag', 'tag')


def search_recipes_ingredients(con, ingredients, logic):
    return search_recipes_tags_generic(con, ingredients, logic, 'has_ingredient', 'ingredient')


def get_recipes_from_ids(con, recipe_ids, data):
    sortby = data.get('sortby')
    reverse = data.get('reverse')
    offset = data.get('offset')
    number = data.get('number')

    cur = con.cursor()

    query = 'select recipes.*, ifnull(avg(rating), -1) as average_rating\n'\
        'from recipes left join reviews on (recipes.recipeid = reviews.recipeid)\n'\
        'where recipes.recipeid in ({})\n'\
        .format(','.join(('?',)*len(recipe_ids)))

    query += 'group by recipes.recipeid\n'
    query += 'order by '

    keytofield = {'date': 'creationtime', 'rating': 'average_rating'}

    query += keytofield.get(sortby, sortby)
    if reverse:
        query += ' desc'

    if sortby != 'name':
        query += ', name'

    query += "\nlimit ? offset ?"

    if offset is None:
        offset = 0
        number = len(recipe_ids)

    cur.execute(query, recipe_ids + [number, offset])

    result = [dict(x) for x in cur.fetchall()]

    return result


def search_recipes(con, data):
    name = data.get('name')
    tags = data.get('tags')
    tag_logic = data.get('tag_logic')
    ingredients = data.get('ingredients')
    ingredient_logic = data.get('ingredient_logic')

    if not tag_logic:
        tag_logic = 'and'
    if not ingredient_logic:
        ingredient_logic = 'and'

    search_name = bool(name)
    search_tags = bool(tags)
    search_ingredients = bool(ingredients)

    allowed_logic = {'and', 'or', 'only'}
    if tag_logic not in allowed_logic:
        raise ValueError(
            'Invalid tag logical connective {}'.format(tag_logic))
    if ingredient_logic not in allowed_logic:
        raise ValueError(
            'Invalid ingredient logical connective {}'.format(ingredient_logic))

    cur = con.cursor()
    query = 'select recipeid from recipes'
    cur.execute(query)
    allids = [x['recipeid'] for x in cur.fetchall()]
    results = [set(allids)]

    if search_name:
        results.append(search_recipes_name(con, name))

    if search_tags:
        results.append(search_recipes_tags(con, tags, tag_logic))

    if search_ingredients:
        results.append(search_recipes_ingredients(
            con, ingredients, ingredient_logic))

    recipe_ids = set()

    if len(results) > 0:
        recipe_ids = results[0]
        for x in results[1:]:
            recipe_ids &= x

    recipe_ids = list(recipe_ids)
    if data.get('random'):
        if len(recipe_ids) > 0:
            recipe_ids = [random.choice(recipe_ids)]
        else:
            recipe_ids = [random.choice(allids)]

    sortby = data.get('sortby')
    reverse = data.get('reverse')

    allowed_sortby = {'name', 'date', 'rating', 'popularity'}
    if sortby not in allowed_sortby:
        raise ValueError('Invalid sortby {}'.format(sortby))

    return {
        'recipes': get_recipes_from_ids(con, recipe_ids, data),
        'total': len(recipe_ids)
    }


def get_ingredients(con):
    cur = con.cursor()
    query = 'select * from ingredients'
    cur.execute(query)

    return [dict(x) for x in cur.fetchall()]


def update_popularity(con, recipeid, popularity):
    cur = con.cursor()
    query = 'update recipes\n'\
        'set popularity = ?\n'\
        'where recipeid = ?\n'

    cur.execute(query, (popularity+1, recipeid))
    con.commit()


def recipe_details(con, data):
    cur = con.cursor()
    if not data.get("recipe_id"):
        raise ValueError('Invalid Recipe ID')
    result = cur.execute(
        "SELECT * FROM recipes WHERE recipeid = ?", (data.get("recipe_id"),)).fetchone()

    if not result:
        raise ValueError("Recipe ID doesn't exist")

    result = dict(result)
    update_popularity(con, result['recipeid'], result['popularity'])

    result = put_average_rating(con, [result])[0]

    ingredients_rows = cur.execute(
        "select ingredient, name, quantity, measurement from has_ingredient join ingredients on (ingredient = ingredientid) where recipe = ?", (data.get("recipe_id"),))
    ingredients = [dict(x) for x in ingredients_rows]
    ingredient_name_list = [x['name'] for x in ingredients]
    quantity_list = [(x.get('quantity', '') or '') +
                     (x.get('measurement', '') or '') for x in ingredients]

    output = {
        "name": result['name'],
        "description": result['description'],
        "ingredients": ingredient_name_list,
        "quantity_and_measurements": quantity_list,
        "method": result['method'],
        "reviews": reviews.get_recipe_reviews(con, data),
        "average_rating": result['average_rating'],
        "popularity": result['popularity'],
        'imageurl': result['imageurl']
    }
    return output


def search_ingredients(con, data):
    name = data.get('name')
    search_string = '%' + str(name) + '%'
    search_tags = bool(data.get('search_tags'))
    print(data.get('search_tags'))

    values = [search_string]

    cur = con.cursor()
    query = 'select ingredientid, ingredients.name from ingredients\n'\
            'join ingredient_has_tag on (ingredientid = ingredient)\n'\
            'join tags on (tag = tagid)\n'\
            'where lower(ingredients.name) like ?\n'

    if search_tags:
        query += 'or lower(tags.name) like ?\n'
        values.append(search_string)

    query += 'group by ingredientid'

    print(query)
    cur.execute(query, values)

    result = [dict(x) for x in cur.fetchall()]

    return {
        'ingredients': result
    }
