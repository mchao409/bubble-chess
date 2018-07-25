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
from flask import request
from player import Player
import time

app = Flask(__name__)

# global users
# users = []
# for i in range(10):
#     users.append(False)
player0 = None
player1 = None

@app.route('/')
def index():
    # player1 = False
    # player1_id = -1
    # print(users)
    # for i in range(len(users)):
    #     if users[i] == False:
    #         player1 = Player(i)
    #         users[i] = player1
    #         player1_id = i
    #         break

    # for i in range(len(users)):
    #     if i != player1_id and users[i] != False and users[i].other_id == False:
    #         player2 = users[i]
    #         player2.add_other_player(player1_id)
    #         player1.add_other_player(i)
    #         break
    global player0
    global player1
    if player0 == None:
        player0 = Player(0)
    elif player0 != None and player1 == None:
        player1 = Player(1)
        player1.add_other_player(player0)
        player0.add_other_player(player1)
    if player1 == None:
        # Current player is player 0
        return render_template("board.html", id=0)
    # Current player is player 1
    return render_template("board.html", id=1)

    # return render_template("board.html", id=player1_id)


@app.route('/stream/', methods=['GET', 'POST'])
def stream():
    return Response(event(), mimetype="text/event-stream");


def event():
    """For something more intelligent, take a look at Redis pub/sub
    stuff. A great example can be found here__.

    __ https://github.com/jakubroztocil/chat

    """
    x = 0
    while x < 10:
        yield "data: " + str(x) + "\n\n"
        x += 1
        # yield 'data: ' + json.dumps(random.rand(1000).tolist()) + '\n\n'
        gevent.sleep(0.2)

def pleaseWait(player):
    print("This is " + str(player.user_id))
    print("This is other: " + str(player.other))
    player_other = player.other
    while player.other == None:
        yield "data: " + json.dumps({"message": "Waiting for opponent to enter", "can_start": False}) + "\n\n"
        gevent.sleep(0.2)

    while player.other.is_ready_to_start != True:
        yield "data: " + json.dumps({"message": "Waiting for opponent to be ready", "can_start": False}) + "\n\n"
        gevent.sleep(0.2)

    print(str(player.user_id) + " is finished")
    yield "data: " + json.dumps({"message": "Finished", "can_start": True}) + "\n\n"

    # print(player.is_ready_to_start)
    # print(player.other_id)
    # while player.other_id == False:
    #     print("waiting to enter")
    #     if player.other_id != False:
    #         break
    #     yield 'data: ' + json.dumps("Waiting for player to enter") + "\n\n"
    #     gevent.sleep(0.2)

    # other_player = users[player.other_id]

    # while other_player.is_ready_to_start != True:
    #     print("not ready to start")
    #     yield 'data: ' + json.dumps("Player not ready") + "\n\n"
    #     gevent.sleep(0.2)
    # # print("other player: " + str(player.other_id))
    # # print("ending wait", file=sys.stdout)
    # yield 'data: ' + json.dumps("Finished") + "\n\n"


@app.route('/start/', methods=['GET', 'POST'])
def start():
    # print(request.args)
    # print(request.get_json())
    player_id = int(request.args.get("user_id"));
    current_player = None
    if player_id == 0:
        current_player = player0
        print(current_player)
    elif player_id == 1:
        current_player = player1
    current_player.ready_to_start()
    return Response(pleaseWait(current_player), mimetype="text/event-stream")

    # if(player_id != None):
    #     print(player_id)
    #     print(users)
    #     player = users[player_id]
    #     player.ready_to_start()
    #     return Response(pleaseWait(player), mimetype="text/event-stream")
    # print("hiasdaii", file=sys.stdout)

    # return Response("Not a user");


if __name__ == "__main__":
    app.run(debug=True, threaded=True)
    WSGIServer(('', 5000), app, log=app.logger).serve_forever()
