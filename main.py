from flask import *
from flask.json import JSONEncoder
from flask.ext.cors import CORS
from flask.ext.login import LoginManager, login_user , logout_user , current_user , login_required
from werkzeug.contrib.fixers import ProxyFix

import simplejson as json
import os, sys
import datetime

app = Flask(__name__, static_url_path='/static')
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

# renders login page
@app.route('/login', methods=['GET'])
def render_login():
    return app.send_static_file('login.html')


@app.route('/', methods=['GET'])
def render_index():
    return app.send_static_file('index.html')

# user login 
@app.route('/login', methods = ['POST'])
def login():
    body = request.get_json()
    if body:
        email = body['email']
        password = body['password']
    else:
        email = request.form.get('email')
        password = request.form.get('password')
    registered_user = User.query.filter_by(email=email,password=password).first()
    if registered_user is None:
        return jsonify({"Error": "Email or Password invalid"})
    login_user(registered_user)
    return redirect("/admin", code=302)

# renders admin page
@app.route('/admin', methods=['GET'])
def render_admin():
    if current_user.is_authenticated() is False:
        return redirect("/login", code=302)
    return app.send_static_file('admin.html')

# user logout
@app.route('/logout', methods = ['GET'])
def logout():
    logout_user()
    return redirect("/login", code=302)

# renders summary page
@app.route('/summary', methods=['GET'])
def render_summary():
    return app.send_static_file('summary.html')

# get all quotes
@app.route("/quote", methods = ['GET'])
def get_quote():
    results = {}
    if current_user.is_authenticated() is True and request.args and request.args['all'] == "true":
        result = Quote.query.all()
        for item in result:
            results[item.id] = item.serialize
    else:
        # if user is not authenticated, return only quotes that are approved
        result = Quote.query.filter(Quote.active==True).all()
        for item in result:
            results[item.id] = item.serialize
    scores = db.session.query(Vote.quote_id, db.func.sum(Vote.value).label("score")).group_by(Vote.quote_id).join(Quote).filter(Quote.id.in_(results.keys())).all()

    for i in scores:
        results[i[0]]["score"] = i[1]

    return jsonify(results)

# gets details of single quote
@app.route("/quote/<int:id>", methods = ['GET'])
def get_single_quote(id):
    quote = Quote.query.get(id)
    quote.view_count += 1
    quote_score = db.session.query(db.func.sum(Vote.value)).group_by(Vote.quote_id).filter(Vote.quote_id==id).all()
    db.session.commit()
    quote = quote.serialize
    quote["score"] = quote_score[0][0]
    return jsonify(quote)

# submits a new quote
@app.route("/quote", methods = ['POST'])
def post_new_quote():

    body = request.get_json()
    
    conditions = {}
    if "conditions" in body:
        conditions = body['conditions']

    ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
    ip = ip.partition(',')[0]


    quote = Quote(text = body['text'], conditions = json.dumps(conditions), view_count = 1, ip = ip, active = False)
    db.session.add(quote)
    db.session.commit()

    vote = Vote(ip = ip, value = 1, quote_id = quote.id)        #auto upvote every new quote by 1
    db.session.add(vote)
    db.session.commit()

    return jsonify(quote.serialize)

# submits a new vote for a single quote
@app.route("/quote/<int:quote_id>/vote", methods = ['POST'])
def post_new_vote(quote_id):
    body = request.get_json()
    ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
    ip = ip.partition(',')[0]
    vote = Vote(ip = ip, value = body['value'], quote_id = quote_id)
    db.session.add(vote)
    db.session.commit()

    return jsonify(vote.serialize)

# approves/ activates a single quote
@app.route("/quote/<int:id>/approve", methods = ['PUT'])
@login_required
def approve_quote(id):
    quote = Quote.query.get(id)
    quote.active = True
    db.session.commit()
    return jsonify(quote.serialize)

# unapproves/ rejects a single quote
@app.route("/quote/<int:id>/reject", methods = ['PUT'])
@login_required
def reject_quote(id):
    quote = Quote.query.get(id)
    quote.active = False
    db.session.commit()
    return jsonify(quote.serialize)

# deletes a single quote
@app.route("/quote/<int:id>", methods = ['DELETE'])
@login_required
def delete_quote(id):
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


cors = CORS(app)
if __name__ == "__main__":
    
    # app.debug = True    #uncomment to run debug mode
    app.run()
