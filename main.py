from flask import *
from flask.json import JSONEncoder
from flask.ext.cors import CORS
from flask.ext.login import LoginManager, login_user , logout_user , current_user , login_required

import simplejson as json
import os, sys
import datetime

app = Flask(__name__)
app.config['SESSION_TYPE'] = 'memcached'
app.config['SECRET_KEY'] = 'super secret key'
sess = Session()
app.config.from_object(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
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

@app.route("/")
def hello():
    return "Hello World!"

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

@app.route('/register', methods = ['POST'])
def register():
    body = request.get_json()
    email = body['email']
    password = body['password']
    user = User(email=email, password=password)
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize)
 
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

@app.route('/logout')
def logout():
    logout_user()
    return jsonify({"Success": "User is logged out"})

@app.route("/quote", methods = ['GET'])
def get_quote():

    result = db.session.query(Vote.quote_id, db.func.sum(Vote.value).label("score")).group_by(Vote.quote_id).order_by("score DESC").join(Quote).filter(Quote.active == True).all()
    return jsonify(result)

@app.route('/approval', methods = ['GET'])
@login_required
def get_unapproved_quotes():
    return "123"

@app.route("/quote/<int:id>", methods = ['GET'])
def get_single_quote(id):
    quote = Quote.query.get(id)
    quote.view_count += 1
    db.session.commit()
    return jsonify(quote.serialize)

@app.route("/quote", methods = ['POST'])
def post_new_quote():
    body = request.get_json()
    conditions = {}
    if "conditions" in body:
        conditions = body['conditions']

    quote = Quote(text = body['text'], conditions = json.dumps(conditions), date_created = datetime.datetime.utcnow(), view_count = 1, ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr), active = False)
    db.session.add(quote)
    db.session.commit()

    vote = Vote(ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr), value = 1, date_created = datetime.datetime.utcnow(), quote_id = quote.id)        #auto upvote every new quote by 1
    db.session.add(vote)
    db.session.commit()

    return jsonify(quote.serialize)

@app.route("/quote/<int:quote_id>/vote", methods = ['POST'])
def post_new_vote(quote_id):
    body = request.get_json()

    vote = Vote(ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr), value = body['value'], date_created = datetime.datetime.utcnow(), quote_id = quote_id)
    db.session.add(vote)
    db.session.commit()

    return jsonify(vote.serialize)

cors = CORS(app)
if __name__ == "__main__":
    app.debug = True    
    app.run()
