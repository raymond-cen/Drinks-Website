import flask
import sqlite3
import functools
import account
import recipe
import reviews
import tag
import user
from flask import request, json
from json import dumps
from flask_cors import CORS

app = flask.Flask(__name__)
CORS(app)

DATABASE_FILE = 'db/drinks.db'


def get_db():
    db = getattr(flask.g, '_database', None)
    if db is None:
        db = flask.g._database = sqlite3.connect(DATABASE_FILE)
        db.execute('PRAGMA foreign_keys = 1')
        db.row_factory = sqlite3.Row
    return db


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(flask.g, '_database', None)
    if db is not None:
        db.close()


def require_token(f):
    @functools.wraps(f)
    def wrap(*args, **kwargs):
        token = flask.request.headers.get('Authorization')
        if not token:
            return {'error': 'Authorization header required'}, 400

        if token[:7] != 'Bearer ':
            return {'error': 'token should in form Bearer ...'}, 400

        token = token[7:]
        if not token:
            return {'error': 'token required'}, 400

        con = get_db()
        cur = con.cursor()
        query = 'select * from tokens where token = ?'
        cur.execute(query, (token,))

        tokenrow = cur.fetchone()
        if not tokenrow:
            return {'error': 'invalid token'}, 400

        userid = tokenrow['user']

        return f(userid, *args, **kwargs)

    return wrap


@app.route('/')
def home():
    resp = flask.Response()
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp


@app.route('/register', methods=['POST'])
def register():
    try:
        #data = flask.request.json
        # Should work for both application/json and text/plain
        data = json.loads(request.data)
        result = account.register(get_db(), data)
        return {
            'userid': result['userid'],
            'token': result['token']
        }
    except ValueError as e:
        return {'error': str(e)}, 400


@app.route('/login', methods=['POST'])
def login():
    try:
        # data = flask.request.json
        data = json.loads(request.data)
        result = account.login(get_db(), data)
        return {
            'userid': result['userid'],
            'token': result['token'],
            'is_admin': result['is_admin']
        }
    except ValueError as e:
        return {'error': str(e)}, 400


# endpoint='function_name' required for routes using tokens
@app.route('/logout', methods=['POST'], endpoint='logout')
@require_token
def logout(userid):
    try:
        return account.logout(get_db(), userid)
    except ValueError as e:
        return {'error': str(e)}, 400


@app.route('/recipes', methods=['GET'])
def get_recipes():
    return {'recipes': recipe.get_recipes(get_db())}


@app.route('/recipe/add', methods=['POST'], endpoint='add_recipe')
@require_token
def add_recipe(userid):
    try:
        # data = flask.request.json
        data = json.loads(request.data)
        return {'recipeid': recipe.add_recipe(get_db(), userid, data)}
    except ValueError as e:
        return {'error': str(e)}, 400

'''
Editing recipe
Inputs
    Path
        recipeId
    Header
        Token
    Body
        {
            name : str
            description: str
            method: str
            ingredients: []
            tags: []
        }
Outputs
{}
'''
@app.route('/recipe/<recipeId>', methods=["PUT"], endpoint='edit_recipe')
@require_token
def edit_recipe(userid, recipeId):
    try:
        data = json.loads(request.data)
        recipe.edit_recipe(get_db(), userid, recipeId, data)
        return {}
    except ValueError as e:
        return {'error': str(e)}, 400

# this will be the main search route
# POST because the data inputs will be complicated
# sortby: "name", "date", "rating", "popularity"
# if equal sort by name
@app.route('/recipe/search', methods=['POST'])
def search_recipes():
    try:
        data = json.loads(request.data)
        payload = {
            'name': data.get('name', ''),
            'tags': data.get('tags', []),
            'tag_logic': data.get('tag_logic', 'and'),
            'ingredients': data.get('ingredients', []),
            'ingredient_logic': data.get('ingredient_logic', 'and'),
            'sortby': data.get('sortby', 'name'),
            'reverse': data.get('reverse', False),
            'random': data.get('random', False),
            'offset': data.get('offset'),
            'number': data.get('number', 20)
        }
        return recipe.search_recipes(get_db(), payload)
    except ValueError as e:
        return {'error': str(e)}, 400


@app.route('/ingredients', methods=['GET'])
def get_ingredients():
    return {'ingredients': recipe.get_ingredients(get_db())}


@app.route('/recipe/<recipeId>', methods=['GET'])
def recipe_details(recipeId):
    payload = {
        "recipe_id": recipeId
    }
    try:
        return recipe.recipe_details(get_db(), payload)
    except ValueError as e:
        return {'error': str(e)}, 400

'''
Deleting recipe
Inputs
    Path
        recipeId
    Header
        Token
Outputs
{}

'''
@app.route('/recipe/<recipeId>', methods=["DELETE"], endpoint='delete_recipe')                  
@require_token
def delete_recipe(userid, recipeId):
    try:
        payload = {
            'recipeid': recipeId,
            'userid': userid
        }
        recipe.delete_recipe(get_db(), payload)
        return {}
    except ValueError as e:
        return {'error': str(e)}, 400

'''
Saving recipe to user
Inputs
    Path
        recipeId
    Header
        Token
Outputs
{}

'''
@app.route('/recipe/save/<recipeId>', methods=["PUT"], endpoint='save_recipe')
@require_token
def save_recipe(userid, recipeId):
    try:
        data = {
            'userid': userid,
            'recipeid': recipeId
        }
        recipe.add_saved_recipe(get_db(), data)
        return {}
    except ValueError as e:
        return {'error': str(e)}, 400


'''
Removing saved recipe
Inputs
    Path
        recipeId
    Header
        Token
Outputs
{}

'''
@app.route('/recipe/save/<recipeId>', methods=["DELETE"], endpoint="remove_saved_recipe")
@require_token
def remove_saved_recipe(userid, recipeId):
    try:
        data = {
            'userid': userid,
            'recipeid': recipeId
        }
        recipe.remove_saved_recipe(get_db(), data)
        return {}
    except ValueError as e:
        return {'error': str(e)}, 400


'''
Post review
Inputs
    Path
        recipeId
    Header
        Token
    Body
        {
            rating: int
            reviewText: str
        }
Outputs
{
    reviewId: str
}

'''
@app.route('/review/<recipeId>', methods=['POST'], endpoint='post_review')
@require_token
def post_review(userid, recipeId):
    try:
        data = json.loads(request.data)
        payload = {
            'recipeid': recipeId,
            'userid': userid,
            'review_text': data.get('reviewText', ''),
            'rating': data.get('rating')
        }
        return {'reviewId': str(reviews.add_recipe_review(get_db(), payload))}
    except ValueError as e:
        return {'error': str(e)}, 400

'''
Edit review
Inputs
    Path
        reviewId
    Header
        Token
    Body
        {
            rating: int,
            reviewText: str
        }
Outputs
{}

'''
@app.route('/review/<reviewId>', methods=['PUT'], endpoint='edit_review')
@require_token
def edit_review(userid, reviewId):
    try:
        data = json.loads(request.data)
        payload = {
            'reviewid': reviewId,
            'userid': userid,
            'review_text': data.get('reviewText', ''),
            'rating': data.get('rating')
        }
        reviews.edit_recipe_review(get_db(), payload)
        return {}
    except ValueError as e:
        return {'error': str(e)}, 400

'''
Delete review
Inputs
    Path
        reviewId
    Header
        Token
Outputs
{}

'''
@app.route('/review/<reviewId>', methods=['DELETE'], endpoint='delete_review')
@require_token
def delete_review(userid, reviewId):
    try:
        data = {
            'reviewid': reviewId,
            'userid': userid
        }
        reviews.delete_recipe_review(get_db(), data)
        return {}
    except ValueError as e:
        return {'error': str(e)}, 400


'''
Post recipe comment
Inputs
    Path
        reviewId
    Header
        Token
    Body
        {
            commentText: str
        }
Outputs
{
    commentId: str
}

'''
@app.route('/comment/<reviewId>', methods=['POST'], endpoint='post_comment')
@require_token
def post_comment(userid, reviewId):
    try:
        data = json.loads(request.data)
        payload = {
            'reviewid': reviewId,
            'userid': userid,
            'comment_text': data.get('commentText', ''),
        }
        return {'commentId': str(reviews.add_review_comment(get_db(), payload))}
    except ValueError as e:
        return {'error': str(e)}, 400


'''
Edit recipe comment
Inputs
    Path
        commentId
    Header
        Token
    Body
        {
            commentText: str
        }
Outputs
{}

'''
@app.route('/comment/<commentId>', methods=['PUT'], endpoint='edit_comment')
@require_token
def edit_comment(userid, commentId):
    try:
        data = json.loads(request.data)
        payload = {
            'commentid': commentId,
            'userid': userid,
            'comment_text': data.get('commentText', ''),
        }
        reviews.edit_review_comment(get_db(), payload)
        return {}
    except ValueError as e:
        return {'error': str(e)}, 400


'''
Delete recipe comment
Inputs
    Path
        commentId
    Header
        Token
Outputs
{}

'''
@app.route('/comment/<commentId>', methods=['DELETE'], endpoint='delete_comment')
@require_token
def delete_comment(userid, commentId):
    try:
        data = {
            'commentid': commentId,
            'userid': userid
        }
        reviews.delete_review_comment(get_db(), data)
        return {}
    except ValueError as e:
        return {'error': str(e)}, 400


@app.route('/tag/search', methods=['GET']) # FIXME: Why is this a get with some data?
def search_tags():
    try:
        data = {
            'text': flask.request.args.get('text', '', str),
        }
        return {'tags': tag.search_tags(get_db(), data)}
    except ValueError as e:
        return {'error': str(e)}, 400


@app.route('/ingredient/search', methods=['POST'])
def search_ingredients():
    data = json.loads(request.data)
    payload = {
        'name': data.get('name', ''),
        'search_tags': data.get('search_tags', True)
    }
    try:
        return recipe.search_ingredients(get_db(), payload)
    except ValueError as e:
        return {'error': str(e)}, 400


'''
Get user profile
Inputs
    Header
        Token
Outputs
{
    username: str,
    email: str,
    imageurl: str,
    saved_recipes: [],
    my_recipes: []
}

'''
@app.route('/user', methods=['GET'], endpoint='get_user_profile')
@require_token
def get_user_profile(userid):
    try:
        data = {
            'userid': userid
        }
        return user.get_profile(get_db(), data)
    except ValueError as e:
        return {'error': str(e)}, 400


'''
Edit user profile
Inputs
    Path
        userId
    Header
        Token
    Body
        {
            username: str,
            email: str,
            password: str,
            imageurl: str
        }
Outputs
{}

'''
@app.route('/user', methods=['PUT'], endpoint='edit_user_profile')
@require_token
def edit_user_profile(userid):
    try:
        data = json.loads(request.data)
        payload = {
            'userid': userid,
            'username': data.get('username'),
            'email': data.get('email'),
            'password': data.get('password'),
            'imageurl': data.get('imageurl')
        }
        user.edit_profile(get_db(), payload)
        return {}
    except ValueError as e:
        return {'error': str(e)}, 400
