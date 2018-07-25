class Player:
	def __init__(self, user_id):
		self.user_id = user_id
		self.is_ready_to_start = False
		self.other = None

	def add_other_player(self, other_player):
		self.other = other_player

	def ready_to_start(self):
		self.is_ready_to_start = True
