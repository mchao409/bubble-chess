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

// Create player pieces 

var count = 0;
for(var i = num_horizontal_lines-5; i < num_horizontal_lines; i++) {
	for(var k = 0; k < 5; k++) {
		if((i % 2 == 1 && k % 2 == 1) || (i == 2 && k == 2) || (i == 10 && k == 2)) {
			// "Safe zones", cannot initially put a circle
		}
		else {
			// Create circle
			var cx = board_left_x + k * vertical_lines_separation;
			var cy = board_upper_y + i * horizontal_lines_separation;
			var circle = createCircle(cx, cy, circle_radius,"svg_board", "player_piece");
			createPattern(circle, count, "svg_board");
			circle.classed("not_selected", true);
			// circle.classList.add("not_selected");
			// Create pattern for circle

			// circle.onclick = function(e) {
			circle.on("click", function(d,e){
				d3.event.stopPropagation();
				// e.stopImmediatePropagation();
				if(this.classList.contains("selected")) {
					this.classList.add("not_selected");
					this.classList.remove("selected");
				}
				else {
					this.classList.add("selected");
					this.classList.remove("not_selected");
					console.log(this.classList);

				}
			})
			count++;

		}
	}
}