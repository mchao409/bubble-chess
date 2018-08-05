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
import json
from ast import literal_eval


app = Flask(__name__)

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

def wait_to_start(player):
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


@app.route('/start/', methods=['GET', 'POST'])
def start():
    # print(request.args)
    # print(request.get_json())
    player_id = int(request.args.get("user_id"));
    board = literal_eval(request.args.get("board_data"));
    current_player = find_player(player_id)
    current_player.update_player_bubble_positions(board);

    current_player.ready_to_start()
    return Response(wait_to_start(current_player), mimetype="text/event-stream")
    # if(player_id != None):
    #     print(player_id)
    #     print(users)
    #     player = users[player_id]
    #     player.ready_to_start()
    #     return Response(pleaseWait(player), mimetype="text/event-stream")
    # print("hiasdaii", file=sys.stdout)

    # return Response("Not a user");

def manage_moves(current_player):
    print("This is " + str(current_player.user_id))
    print("This is the current round: " + str(current_player.current_round))
    print("This is other's round: " + str(current_player.other.current_round))
    player_other = current_player.other
    while player_other.current_round != current_player.current_round:
        yield "data: " + json.dumps({"message": "Waiting for opponent to make a move", "stop": False}) + "\n\n"
        gevent.sleep(0.2)
    current_player.manage_collision(player_other)
    yield "data: " + json.dumps({"message": "This round is over.", 
        "positions": current_player.bubble_positions,
         "other_positions": player_other.bubble_positions,"stop":True}) + "\n\n"    


@app.route('/player_move/', methods=['GET', 'POST'])
def player_move():
    # print(request.args)
    player_id = int(request.args.get("user_id"))
    current_player = find_player(player_id)
    print(player_id)

    board_data = literal_eval(request.args.get("board_data"))
    current_player.update_player_bubble_positions(board_data)
    print(board_data)

    game_round = int(request.args.get("round"))
    current_player.update_round(game_round)
    # print(game_round)
    return Response(manage_moves(current_player), mimetype="text/event-stream")

def waiting_for_turn(player):
    other = player.other
    while other.current_round == player.current_round:
        yield "data: " + json.dumps({"message": "Waiting for other player to make a move.", "stop": False}) + "\n\n"
        gevent.sleep(0.2);
    player.manage_collision(other)
    yield "data: " + json.dumps({"message": "It's your turn now.",
        "other_positions": other.bubble_positions,"positions": player.bubble_positions,"stop": True}) + "\n\n"

@app.route('/wait_for_turn/', methods=['GET', 'POST'])
def wait_for_turn():
    player_id = int(request.args.get("user_id"))
    print(str(player_id) + " is waiting")
    round_num = int(request.args.get("round"));
    current_player = find_player(player_id)
    other_player = current_player.other
    print(current_player)
    return Response(waiting_for_turn(current_player), mimetype="text/event-stream")



def find_player(player_id):
    if player_id == 0:
        return player0
    return player1


























if __name__ == "__main__":
    app.run(debug=True, threaded=True)
    WSGIServer(('', 5000), app, log=app.logger).serve_forever()
