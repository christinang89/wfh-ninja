from flask import *
from flask.json import JSONEncoder
from flask.ext.cors import CORS
from flask.ext.login import LoginManager, login_user , logout_user , current_user , login_required

import simplejson as json
import os, sys
import datetime

app = Flask(__name__)
sess = Session()
app.config.from_object('config')

if app.config['SQLALCHEMY_DATABASE_URI'] == None:
    print "Need database config"
    sys.exit(1)

from models import db, Quote, Vote, User

db.init_app(app)

login_manager = LoginManager()
login_manager.init_app(app)

login_manager.login_view = 'login'



@app.before_request
def before_request():
    g.user = current_user

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

# registers user
@app.route('/register', methods = ['POST'])
def register():
    body = request.get_json()
    print app.config
    if 'secret' not in body or body['secret'] != app.config['ADMIN_REGISTRATION_SECRET_KEY']:
        return jsonify({"Error": "Secret key is wrong"})

    email = body['email']
    password = body['password']
    user = User(email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize)

# user login 
@app.route('/login', methods = ['POST'])
def login():
    body = request.get_json()
    email = body['email']
    password = body['password']
    registered_user = User.query.filter_by(email=email,password=password).first()
    if registered_user is None:
        return jsonify({"Error": "Email or Password invalid"})
    login_user(registered_user)
    return jsonify({"Success": "User is logged in"})

# user logout
@app.route('/logout', methods = ['GET'])
def logout():
    logout_user()
    return jsonify({"Success": "User is logged out"})

# get all approved/ active quotes and votecount
@app.route("/quote", methods = ['GET'])
def get_quote():
    result = db.session.query(Vote.quote_id, db.func.sum(Vote.value).label("score")).group_by(Vote.quote_id).order_by("score DESC").join(Quote).filter(Quote.active == True).all()
    return jsonify(result)

# submits a new quote
@app.route("/quote", methods = ['POST'])
def post_new_quote():
    body = request.get_json()
    conditions = {}
    if "conditions" in body:
        conditions = body['conditions']

    quote = Quote(text = body['text'], conditions = json.dumps(conditions), view_count = 1, ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr), active = False)
    db.session.add(quote)
    db.session.commit()

    vote = Vote(ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr), value = 1, quote_id = quote.id)        #auto upvote every new quote by 1
    db.session.add(vote)
    db.session.commit()

    return jsonify(quote.serialize)

# get all unapproved/ inactive quotes and votecount
@app.route("/quote/unapproved", methods = ['GET'])
@login_required
def get_unapproved_quotes():
    result = db.session.query(Vote.quote_id, db.func.sum(Vote.value).label("score")).group_by(Vote.quote_id).order_by("score DESC").join(Quote).filter(Quote.active == False).all()
    return jsonify(result)

# gets details of single quote
@app.route("/quote/<int:id>", methods = ['GET'])
def get_single_quote(id):
    quote = Quote.query.get(id)
    quote.view_count += 1
    db.session.commit()
    return jsonify(quote.serialize)

# approves/ activates a single quote
@app.route("/quote/<int:id>/approve", methods = ['PUT'])
@login_required
def approve_quote(id):
    quote = Quote.query.get(id)
    quote.active = True
    db.session.commit()
    return jsonify(quote.serialize)

# deletes a single quote
@app.route("/quote/<int:id>/unapprove", methods = ['DELETE'])
@login_required
def unapprove_quote(id):
    vote = Vote.query.filter_by(quote_id = id).all()
    quote = Quote.query.filter_by(id = id).all()
    if quote == []:
        return jsonify({"Error":"Quote does not exist"})
    for v in vote:
        db.session.delete(v)
    db.session.commit()
    for q in quote:
        db.session.delete(q)
    db.session.commit()
    return jsonify({"Success":"Quote has been deleted"})

# submits a new vote for a single quote
@app.route("/quote/<int:quote_id>/vote", methods = ['POST'])
def post_new_vote(quote_id):
    body = request.get_json()
    vote = Vote(ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr), value = body['value'], quote_id = quote_id)
    db.session.add(vote)
    db.session.commit()

    return jsonify(vote.serialize)

cors = CORS(app)
if __name__ == "__main__":
    
    app.debug = True    
    app.run()
