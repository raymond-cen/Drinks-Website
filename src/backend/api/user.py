import sqlite3
import account
import recipe
import re

regex = '^[a-zA-Z0-9]+[\\._]?[a-zA-Z0-9]+[@]\\w+[.]\\w{2,3}$'

# Gets user profile information given userid
def get_profile(con, data):
    cur = con.cursor()
    query = 'select username, email, imageurl from users where userid=?'
    cur.execute(query, (data.get('userid'),))
    row = cur.fetchone()
    if row is None:
        raise ValueError('User does not exist')
    response_dict = {
        'username': row['username'],
        'email': row['email'],
        'image_url': row['imageurl'],
        'saved_recipes': recipe.get_saved_recipes(con, data),
        'my_recipes': recipe.get_user_recipes(con, data) # Run function to get user created recipes
    }
    
    return response_dict

# Edits user profile if owner of profile
def edit_profile(con, data):
    cur = con.cursor()
    if not data.get('username') or not data.get('email'):
        raise ValueError('Username or email or cannot be empty')

    if not re.search(regex, data.get('email')):
        raise ValueError('Email must be in correct format')
    
    try:
        if data.get('password') is not None:
            query = 'update users set username=?, email=?, password=?, imageurl=? where userid=?'
            cur.execute(query, (data.get('username'), data.get('email'), account.hash(data.get('password')), 
                data.get('imageurl'), data.get('userid')))
        else:
            query = 'update users set username=?, email=?, imageurl=? where userid=?'
            cur.execute(query, (data.get('username'), data.get('email'), data.get('imageurl'), data.get('userid')))
    except sqlite3.IntegrityError:
        raise ValueError('Username and/or email must be unique')
    con.commit()
    return