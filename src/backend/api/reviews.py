from datetime import datetime
from multiprocessing.sharedctypes import Value
import sqlite3
import moderation
# Get all reviews and comments in reviews table given recipe id
def get_recipe_reviews(con, data):
    recipeid = data.get('recipe_id')
    cur = con.cursor()
    query = 'select * from reviews where recipeid=?'
    cur.execute(query, (recipeid,))

    response_payload = []
    for x in cur.fetchall():
        temp_dict = dict(x)
        temp_dict['comments'] = get_review_comments(con, temp_dict)
        temp_dict['creatorname'] = creator_to_username(con, temp_dict)
        response_payload.append(temp_dict)

    return response_payload

# Adds review to reviews table
def add_recipe_review(con, data):
    if not data.get('rating'):
        raise ValueError('Must have rating between 0 to 5')

    cur = con.cursor()
    query = 'insert into reviews (recipeid, creator, rating, reviewtext, creationtime) values (?, ?, ?, ?, ?)'
    cur.execute(query, (data.get('recipeid'), data.get('userid'), data.get('rating'), data.get('review_text'), datetime.now().strftime("%Y-%m-%d %H:%M:%S")))

    con.commit()

    return cur.lastrowid

# Edits review
def edit_recipe_review(con, data):
    if not data.get('rating'):
        raise ValueError('Must have rating between 0 to 5')
    cur = con.cursor()
    try:
        query = 'select * from reviews where reviewid=? and creator=?'
        cur.execute(query, (data.get('reviewid'), data.get('userid')))
        row = cur.fetchone()
        if row is None:
            raise ValueError('You must be the creator of the review to edit it')
        else:
            query = 'update reviews set rating=?, reviewtext=? where reviewid=? and creator=?'
            cur.execute(query, (data.get('rating'), data.get('review_text'), data.get('reviewid'), data.get('userid')))

        con.commit()
    except sqlite3.IntegrityError:
        raise ValueError('Cannot edit a review that does not exist.')


# Deletes review from reviews table
def delete_recipe_review(con, data):
    reviewid = data.get('reviewid')
    userid = data.get('userid')
    cur = con.cursor()

    if moderation.is_admin(con, data):
        delete_all_comments(con, data)
        query = 'delete from reviews where reviewid=?'
        cur.execute(query, (reviewid,))
    else:
        query = 'select * from reviews where reviewid=? and creator=?'
        cur.execute(query, (reviewid, userid))
        row = cur.fetchone()
        if row is None:
            raise ValueError('You must be the creator of the review to delete it')
        else:
            delete_all_comments(con, data)
            query = 'delete from reviews where reviewid=? and creator=?'
            cur.execute(query, (reviewid, userid))
    con.commit()

    return

# Deletes all reviews for any given recipe
def delete_all_reviews(con, data):
    recipeid = data.get('recipeid')
    cur = con.cursor()

    query = 'select * from reviews where recipeid=?'
    cur.execute(query, (recipeid,))
    for x in cur.fetchall():
        temp_dict = dict(x)
        delete_all_comments(con, {'reviewid': temp_dict['reviewid']})
    
    query = 'delete from reviews where recipeid=?'
    cur.execute(query, (recipeid,))
    con.commit()
    return

# Get all comments in comments table given review id
def get_review_comments(con, data):
    reviewid = data.get('reviewid')
    cur = con.cursor()
    query = 'select * from comments where reviewid=?'
    cur.execute(query, (reviewid,))

    response_payload = []
    for x in cur.fetchall():
        temp_dict = dict(x)
        temp_dict['creatorname'] = creator_to_username(con, temp_dict)
        response_payload.append(temp_dict)

    return response_payload

# Adds comment to comments table
def add_review_comment(con, data):
    if not data.get('comment_text'):
        raise ValueError('Comment must have text')

    cur = con.cursor()
    query = 'insert into comments (reviewid, creator, commenttext, creationtime) values (?, ?, ?, ?)'
    cur.execute(query, (data.get('reviewid'), data.get('userid'), data.get('comment_text'), datetime.now().strftime("%Y-%m-%d %H:%M:%S")))

    con.commit()

    return cur.lastrowid

# Edits comment in review
def edit_review_comment(con, data):
    if not data.get('comment_text'):
        raise ValueError('Comment must have text')
    cur = con.cursor()
    try:
        query = 'select * from comments where commentid=? and creator=?'
        cur.execute(query, (data.get('commentid'), data.get('userid')))
        row = cur.fetchone()
        if row is None:
            raise ValueError('You must be the creator of the comment to edit it')
        query = 'update comments set commenttext=? where commentid=? and creator=?'
        cur.execute(query, (data.get('comment_text'), data.get('commentid'), data.get('userid')))

        con.commit()
    except sqlite3.IntegrityError:
        raise ValueError('Cannot edit comment that does not exist')

# Delete comment from comments table given comment id
def delete_review_comment(con, data):
    commentid = data.get('commentid')
    userid = data.get('userid')
    cur = con.cursor()

    if moderation.is_admin(con, data):
        query = 'delete from comments where commentid=?'
        cur.execute(query, (commentid,))
    else:
        query = 'select * from comments where commentid=? and creator=?'
        cur.execute(query, (commentid, userid))
        row = cur.fetchone()
        if row is None:
            raise ValueError('You must be the creator of the comment to delete it')
        else:
            delete_all_comments(con, data)
            query = 'delete from reviews where commentid=? and creator=?'
            cur.execute(query, (commentid, userid))
    
    con.commit()

    return

# Deletes all comments for any given a review
def delete_all_comments(con, data):
    reviewid = data.get('reviewid')
    cur = con.cursor()

    query = 'delete from comments where reviewid=?'
    cur.execute(query, (reviewid,))

    con.commit()

# Returns the username of creator given creator id
def creator_to_username(con, data):
    cur = con.cursor()
    query = 'select username from users where userid=?'
    cur.execute(query, (data.get('creator'),))
    
    return dict(cur.fetchone())['username']
    

