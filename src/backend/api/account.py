import sqlite3
import os
import binascii
import hashlib
import re
import moderation

regex = '^[a-zA-Z0-9]+[\\._]?[a-zA-Z0-9]+[@]\\w+[.]\\w{2,3}$'


def hash(string):
    return hashlib.sha256(string.encode()).hexdigest()


def generate_random_token():
    return binascii.hexlify(os.urandom(32)).decode()


def db_add_token(con, userid, token):
    cur = con.cursor()
    query = 'INSERT into tokens (token, user) values (?, ?)'

    # this will throw if the token already exists but we don't want to leak that to the API
    cur.execute(query, (token, userid))

    con.commit()


def register(con, data):
    if not data.get('username'):
        raise ValueError('Missing username')

    if not data.get('email'):
        raise ValueError('Missing email')

    if not data.get('password'):
        raise ValueError('Missing password')

    cur = con.cursor()
    query = 'INSERT into users (username, email, password, imageurl) VALUES (?, ?, ?, ?)'

    try:
        cur.execute(query, (data['username'],
                    data['email'], hash(data['password']), ""))
    except sqlite3.IntegrityError:
        raise ValueError('username / email already exists')

    userid = cur.lastrowid
    token = generate_random_token()
    db_add_token(con, userid, token)

    con.commit()

    return {
        'userid': userid,
        'token': token
    }


def login(con, data):
    if not data.get('username'):
        raise ValueError('Missing username')

    if not data.get('password'):
        raise ValueError('Missing password')

    cur = con.cursor()
    # Checks for email
    if re.search(regex, data['username']):
        query = 'SELECT * FROM users WHERE email = ?'
        cur.execute(query, (data['username'],))
    else:
        query = 'SELECT * FROM users WHERE username = ?'
        cur.execute(query, (data['username'],))
    user = cur.fetchone()
    if not user:
        raise ValueError("username doesn't exist")
    userid = user['userid']
    if hash(data['password']) != user['password']:
        raise ValueError("Password is incorrect")
    cur = con.cursor()
    query = 'SELECT * FROM tokens WHERE user = ?'
    cur.execute(query, (user['userid'],))

    tokenrow = cur.fetchone()
    if not tokenrow:
        token = generate_random_token()
        db_add_token(con, userid, token)
    else:
        token = tokenrow['token']
    return {
        'userid': userid,
        'token': token,
        'is_admin': moderation.is_admin(con, {'userid': userid})
    }


def logout(con, userid):
    cur = con.cursor()
    query = 'DELETE FROM tokens WHERE user = ?'
    cur.execute(query, (userid,))

    con.commit()

    return {}
