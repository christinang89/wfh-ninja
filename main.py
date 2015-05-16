from flask import *
from flask.json import JSONEncoder
from flask.ext.sqlalchemy import SQLAlchemy

import simplejson as json
import os, sys
import datetime


app = Flask(__name__)
app.config.from_object(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL")
if app.config['SQLALCHEMY_DATABASE_URI'] == None:
    print "Need database config"
    sys.exit(1)

db = SQLAlchemy(app)

import models

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/quotes", methods = ['GET'])
def get_quotes():
    d = {"excuseIds": ["1","2"]} 
    return jsonify(**d)

@app.route("/quotes/<int:id>", methods = ['GET'])
def get_quote(id):
    d = {1:{"excuse":"test"}, 2:{"excuse":"boo"}}
    return jsonify(**d[id])

@app.route("/quotes", methods = ['POST'])
def set_quote():
    body = request.get_json()
    conditions = {}
    if "conditions" in body:
        conditions = body['conditions']

    me = models.Quote(text = body['text'], conditions = json.dumps(conditions), date_created = datetime.datetime.utcnow(), view_count = 0)
    db.session.add(me)
    db.session.commit()
    return jsonify(me.serialize)

if __name__ == "__main__":
    app.debug = True    
    app.run()