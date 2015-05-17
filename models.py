from flask import *
from flask.ext.sqlalchemy import SQLAlchemy

import simplejson as json

db = SQLAlchemy()

class Quote(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String(500))
    conditions = db.Column(db.Text)
    date_created = db.Column(db.DateTime)
    view_count = db.Column(db.Integer)
    active = db.Column(db.Boolean)

    def __init__(self, text, conditions, date_created, view_count, active):
        self.text = text
        self.conditions = conditions
        self.date_created = date_created
        self.view_count = view_count
        self.active = active

    def __repr__(self):
        return json.dumps({"id": self.id, "text": self.text, "conditions": self.conditions, "date_created": self.date_created, "view_count": self.view_count, "active": self.active})

    @property
    def serialize(self):
        return {"id": self.id, "text": self.text, "conditions": self.conditions, "date_created": self.date_created.isoformat(), "view_count": self.view_count, "active": self.active}
    


class Vote(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    ip = db.Column(db.String(15))
    value = db.Column(db.Integer)
    date_created = db.Column(db.DateTime)
    quote_id = db.Column(db.Integer, db.ForeignKey('quote.id'))

    def __init__(self, ip, value, date_created, quote_id):
        self.ip = ip
        self.value = value
        self.date_created = date_created
        self.quote_id = quote_id

    def __repr__(self):
        return json.dumps({"id": self.id, "ip": self.ip, "value": self.value, "date_created": self.date_created, "quote_id": self.quote_id})

    @property
    def serialize(self):
        return {"id": self.id, "ip": self.ip, "value": self.value, "date_created": self.date_created.isoformat(), "quote_id": self.quote_id}