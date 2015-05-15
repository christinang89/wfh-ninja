from flask import *
from flask.json import JSONEncoder
import simplejson as json
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/excuses", methods = ['GET'])
def getExcuses():
    d = {"excuseIds": ["1","2"]} 
    return jsonify(**d)

if __name__ == "__main__":
    app.debug = True
    app.run()