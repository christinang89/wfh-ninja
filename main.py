from flask import *
from flask.json import JSONEncoder
from flask.ext.sqlalchemy import SQLAlchemy

import simplejson as json
import os, sys

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

@app.route("/excuses", methods = ['GET'])
def getExcuses():
    d = {"excuseIds": ["1","2"]} 
    return jsonify(**d)

@app.route("/excuses/<int:id>", methods = ['GET'])
def getExcuse(id):
    d = {1:{"excuse":"test"}, 2:{"excuse":"boo"}}
    return jsonify(**d[id])

if __name__ == "__main__":
    app.debug = True
    app.run()