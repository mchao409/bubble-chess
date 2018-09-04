import copy

class Player:
	def __init__(self, user_id):
		self.user_id = user_id
		self.is_ready_to_start = False
		self.other = None
		self.current_round = None
		self.bubble_positions = None
		self.turn_over = None

	def add_game(self, game):
		self.game = game

	def add_other_player(self, other_player):
		self.other = other_player

	def ready_to_start(self):
		self.is_ready_to_start = True

	def update_round(self, game_round):
		self.current_round = game_round

	def update_player_bubble_positions(self, arr):
		self.bubble_positions = arr

	def manage_collision(self, other):
		other_positions = other.bubble_positions
		for position, data in self.bubble_positions.items():
			rank = data["rank"]
			for other_position, other_data in other.bubble_positions.items():
				other_rank = other_data["rank"]
				print("Other_rank: " + str(other_rank) + "  rank: " + str(rank))
				if position == other_position:
					if rank == -1:
						del self.bubble_positions[position]
						print("COLLISION DETECTED, FLAG CAPTURED BY " + str(other.user_id))
						return other.user_id

					elif other_rank == -1:
						del other.bubble_positions[position]
						print("COLLISION DETECTED. FLAG CAPTURED BY " + str(self.user_id))
						return self.user_id

					elif rank > other_rank:
						del other.bubble_positions[other_position]
						print("COLLISION DETECTED. PLAYER " + str(self.user_id) + " wins")

					elif other_rank > rank:
						del self.bubble_positions[position]
						print("COLLISION DETECTED. " + str(other.user_id) + " wins")

					else:
						del self.bubble_positions[position]
						del other.bubble_positions[other_position]
						print("COLLISION DETECTED. BOTH EQUAL, BOTH DELETED")
					return







