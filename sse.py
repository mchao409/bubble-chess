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
from game import Game
import time
import json
from ast import literal_eval

app = Flask(__name__)

player0 = None
player1 = None

@app.route('/')
def index():
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
    game = Game(player0, player1)
    player0.add_game(game)
    player1.add_game(game)
    return render_template("board.html", id=1)

@app.route('/stream/', methods=['GET', 'POST'])
def stream():
    return Response(event(), mimetype="text/event-stream");

def event():
    x = 0
    while x < 10:
        yield "data: " + str(x) + "\n\n"
        x += 1
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
    player_id = int(request.args.get("user_id"));
    board = literal_eval(request.args.get("board_data"));
    current_player = find_player(player_id)
    current_player.update_player_bubble_positions(board);

    current_player.ready_to_start()
    return Response(wait_to_start(current_player), mimetype="text/event-stream")


def manage_moves(current_player, round_num):
    print("This is " + str(current_player.user_id))
    print("This is the current round: " + str(current_player.current_round))
    print("This is other's round: " + str(current_player.other.current_round))
    player_other = current_player.other
    winner = current_player.manage_collision(player_other)
    if winner != None:
        yield "data: " + json.dumps({"message": "Game Over", "stop": True, "game_winner": winner}) + "\n\n"
    winner = current_player.manage_collision(player_other)
    if winner != None:
        current_player.game.add_winner(winner)
    current_player.update_round(round_num)
    while player_other.current_round != current_player.current_round:

        # winner = current_player.game.game_winner
        # if winner != None:
        #     current_player.game.add_winner(winner)
        #     yield "data: " + json.dumps({"message": "Waiting for opponent to make a move", "stop": True, "game_winner": winner}) + "\n\n"
        # else:
        yield "data: " + json.dumps({"message": "Waiting for opponent to make a move", "stop": False}) + "\n\n"
        gevent.sleep(0.2)
    winner = current_player.manage_collision(player_other)
    if winner != None:
        current_player.game.add_winner(winner)
    yield "data: " + json.dumps({"message": "This round is over.", 
        "positions": current_player.bubble_positions,
         "other_positions": player_other.bubble_positions,"stop":True, "game_winner": winner}) + "\n\n"    


@app.route('/player_move/', methods=['GET', 'POST'])
def player_move():
    player_id = int(request.args.get("user_id"))
    current_player = find_player(player_id)

    board_data = literal_eval(request.args.get("board_data"))
    current_player.update_player_bubble_positions(board_data)

    game_round = int(request.args.get("round"))
    # current_player.update_round(game_round)
    return Response(manage_moves(current_player, game_round), mimetype="text/event-stream")

def waiting_for_turn(player):
    other = player.other
    while other.current_round == player.current_round:
        yield "data: " + json.dumps({"message": "Waiting for other player to make a move.", "stop": False}) + "\n\n"
        gevent.sleep(0.2);
    gevent.sleep(0.2)
    winner = player.manage_collision(other)
    if winner != None:
        player.game.add_winner(winner)
        yield "data: " + json.dumps({"message": "Game Over", "stop": True, "game_winner": player.game.game_winner}) + "\n\n"
    while other.current_round != player.current_round:
        yield "data: " + json.dumps({"message": "It's your turn now.",
        "other_positions": other.bubble_positions,"positions": player.bubble_positions,"stop": True, "game_winner": winner}) + "\n\n"
    if player.game.game_winner != None:
        print("someone has won")
    yield "data: " + json.dumps({"message": "This round is over.", 
        "positions": current_player.bubble_positions,
         "other_positions": player_other.bubble_positions,"stop":True, "game_winner": winner}) + "\n\n"    



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
