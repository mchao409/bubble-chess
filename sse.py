"""
gunicorn -b 127.0.0.1:5000 -k gevent sse:app
"""
import sys
import gevent
from gevent.pywsgi import WSGIServer
from gevent import monkey
monkey.patch_all()
from numpy import random
from flask import Flask, json, Response, render_template

app = Flask(__name__)

global user_ids
user_ids = []
for i in range(10):
    user_ids.append(-2)

@app.route('/')
def index():
	this_id = False
	other_id = False
	print(user_ids, file=sys.stdout)
	for i in range(len(user_ids)):
		if user_ids[i] == -2:
			user_ids[i] = -1
			this_id = i
			break
	for i in range(len(user_ids)):
		if user_ids[i] == -1 and i != other_id:
			user_ids[other_id] = i
			this_id = i
			user_ids[this_id] = other_id
			break
	if other_id == False:
		return render_template("board.html", id=this_id)

	return render_template("board.html", id=this_id, other_id=other_id)

@app.route('/stream/', methods=['GET', 'POST'])
def stream():
	return Response("Hello stream ", mimetyoe="text/event-stream")

@app.route('/exit/'. methods=['POST'])
def exit():
	pass




if __name__ == "__main__":
    app.run(debug=True)
    WSGIServer(('', 5000), app).serve_forever()
