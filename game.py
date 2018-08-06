class Game:
	def __init__(self, player_1, player_2):
		self.player_1 = player_1
		self.player_2 = player_2
		self.game_rounds = [None]
		self.game_winner = None

	def add_round_winner(self, winner_id):
		self.game_rounds.append(winner_id)

	def get_round_winner(self, round_num):
		if len(self.game_rounds) <= round_num + 1:
			return None
		else:
			return self.game_rounds[round_num]

	def add_winner(self, winner_id):
		self.game_winner = winner_id