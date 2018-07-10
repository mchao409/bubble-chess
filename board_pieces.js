// Creates the chess pieces on the board -- temporary for testing

// Create opponent pieces (blue)
for(var i = 0; i < 5; i++) {
	for(var k = 0; k < 5; k++) {
		if((i % 2 == 1 && k % 2 == 1) || (i == 2 && k == 2) || (i == num_horizontal_lines - 2 && k == num_vertical_lines - 2)) {
			// "Safe zones", cannot initially put a circle
		}
		else {
			// Create circle
			var cx = board_left_x + k * vertical_lines_separation;
			var cy = board_upper_y + i * horizontal_lines_separation;
			var circle = createCircle(cx, cy, circle_radius,"svg_board", "opponent_piece");
		}
	}
}

// Create player pieces (black)
for(var i = num_horizontal_lines-5; i < num_horizontal_lines; i++) {
	for(var k = 0; k < 5; k++) {
		if((i % 2 == 1 && k % 2 == 1) || (i == 2 && k == 2) || (i == num_horizontal_lines - 2 && k == num_vertical_lines - 2)) {
			// "Safe zones", cannot initially put a circle
		}
		else {
			// Create circle
			var cx = board_left_x + k * vertical_lines_separation;
			var cy = board_upper_y + i * horizontal_lines_separation;
			var circle = createCircle(cx, cy, circle_radius,"svg_board", "player_pieces");
			circle.setAttributeNS(null, "class", "not_selected");
			circle.onclick = function(e) {
				e.stopImmediatePropagation();
				if(this.getAttribute("class") == "selected") {
					this.setAttribute("class", "not_selected");
				}
				else this.setAttribute("class", "selected");
				console.log("selected");
			}

		}
	}
}