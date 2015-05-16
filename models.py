from main import app, db
from flask import *

import simplejson as json
import uuid

# class Paste(db.Model):
#     id = db.Column(db.String(36), unique=True, primary_key=True)
#     poster = db.Column(db.String(51))
#     paste = db.Column(db.Text())

#     def __init__(self, text, poster="Anonymous"):
#         self.paste = text
#         self.id = str(uuid.uuid4())

class Quote(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String(500))
    conditions = db.Column(db.Text)
    dateCreated = db.Column(db.DateTime)
    viewCount = db.Column(db.Integer)
    voteIds = db.relationship('vote', backref='quote', lazy='dynamic')

    def __init__(self, id, text, conditions, dateCreated, viewCount):
        self.id = id
        self.text = text
        self.conditions = conditions
        self.dateCreated = dateCreated
        self.viewCount = viewCount

    def __repr__(self):
        return json.dumps({"id": self.id, "text": self.text, "conditions": self.conditions, "dateCreated": self.dateCreated, "viewCount": self.viewCount})


class Vote(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    ip = db.Column(db.String(15))
    value = db.Column(db.Integer)
    quoteId = db.Column(db.Integer, db.ForeignKey('quote.id'))

    def __init__(self, id, ip, value, quoteId):
        self.id = id
        self.ip = ip
        self.value = value
        self.quoteId = quoteId

    def __repr__(self):
        return json.dumps({"id": self.id, "ip": self.ip, "value": self.value, "quoteId": self.quoteId})