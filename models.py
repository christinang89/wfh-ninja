from flask import *
from flask.ext.sqlalchemy import SQLAlchemy

import simplejson as json
import datetime

db = SQLAlchemy()

class Quote(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String(500))
    conditions = db.Column(db.Text)
    date_created = db.Column(db.DateTime)
    view_count = db.Column(db.Integer)
    ip = db.Column(db.String(15))
    active = db.Column(db.Boolean)

    def __init__(self, text, conditions, view_count, ip, active):
        self.text = text
        self.conditions = conditions
        self.date_created = datetime.datetime.utcnow()
        self.view_count = view_count
        self.ip = ip
        self.active = active

    def __repr__(self):
        return json.dumps({"id": self.id, "text": self.text, "conditions": self.conditions, "date_created": self.date_created.isoformat(), "view_count": self.view_count, "ip": self.ip, "active": self.active})

    @property
    def serialize(self):
        return {"id": self.id, "text": self.text, "conditions": self.conditions, "date_created": self.date_created.isoformat(), "view_count": self.view_count, "ip": self.ip, "active": self.active}
    

class Vote(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    ip = db.Column(db.String(15))
    value = db.Column(db.Integer)
    date_created = db.Column(db.DateTime)
    quote_id = db.Column(db.Integer, db.ForeignKey('quote.id'))

    def __init__(self, ip, value, quote_id):
        self.ip = ip
        self.value = value
        self.date_created = datetime.datetime.utcnow()
        self.quote_id = quote_id

    def __repr__(self):
        return json.dumps({"id": self.id, "ip": self.ip, "value": self.value, "date_created": self.date_created, "quote_id": self.quote_id})

    @property
    def serialize(self):
        return {"id": self.id, "ip": self.ip, "value": self.value, "date_created": self.date_created.isoformat(), "quote_id": self.quote_id}


class User(db.Model):
    __tablename__ = "users"
    id = db.Column('user_id', db.Integer, primary_key=True)
    email = db.Column('email', db.String(50), unique=True, index=True)
    password = db.Column('password', db.String(10))
    date_created = db.Column('date_created', db.DateTime)
 
    def __init__(self, password, email):
        self.password = password
        self.email = email
        self.date_created = datetime.datetime.utcnow()

    def is_authenticated(self):
        return True
 
    def is_active(self):
        return True
 
    def is_anonymous(self):
        return False
 
    def get_id(self):
        return unicode(self.id)
 
    def __repr__(self):
        return '<User %r>' % (self.email)

    @property
    def serialize(self):
        return {"email": self.email, "password": self.password, "date_created": self.date_created.isoformat()}
 