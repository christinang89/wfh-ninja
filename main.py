from flask import *
from flask.json import JSONEncoder
from flask.ext.cors import CORS

import simplejson as json
import os, sys
import datetime

app = Flask(__name__)
app.config.from_object(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
if app.config['SQLALCHEMY_DATABASE_URI'] == None:
    print "Need database config"
    sys.exit(1)

from models import db, Quote, Vote

db.init_app(app)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/quote", methods = ['GET'])
def get_quote():
    result = db.session.query(Vote.quote_id, db.func.sum(Vote.value).label("score")).filter_by(active=True).group_by(Vote.quote_id).order_by("score DESC").all()
    return jsonify(result)

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

    quote = Quote(text = body['text'], conditions = json.dumps(conditions), date_created = datetime.datetime.utcnow(), view_count = 1, active = False)
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
