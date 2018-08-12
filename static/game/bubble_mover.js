// This file deals with the movement of pieces in each round

function find_closest(num, arr) {
	// Helper function, finds the value in arr that is closest to num.
	// Returns a size 2 array where the first element is the value
	// 	and the second element is the difference between the value and num.
	var currClosest = arr[0];
	var currDiff = Math.abs(num-currClosest);
	for(var i = 0; i < arr.length; i++) {
		if(Math.abs(arr[i]-num) < currDiff) {
			currDiff = Math.abs(arr[i]-num);
			currClosest = arr[i];
		}
	}
	return[currClosest, currDiff];
}

function move_player_piece() {
	// Determines whether the player's requested placement of a piece is valid. If it is,
	//   the piece is moved, and a function is called to notify the server. Otherwise, nothing happens
	// This is set to #svg_board's onclick to allow the player's pieces to be moved when it is their turn.
	
	circle = d3.select(".selected");
	console.log(circle);
	if(circle.empty()) {
	   return;
	}
	var curr_x = parseInt(circle.attr("cx"));
	var curr_y = parseInt(circle.attr("cy"));
	var svg_rect = svg_board.getBoundingClientRect();

	var closest_x = find_closest(event.clientX-svg_rect.left, x_location_vertical_lines);
	var closest_y = find_closest(event.clientY-svg_rect.top, y_location_horizontal_lines);

	// Make sure that the piece can only move one space, not multiple
	if(Math.abs(curr_x - closest_x[0]) >= vertical_lines_separation * 1.5 || Math.abs(curr_y - closest_y[0]) >= horizontal_lines_separation * 1.5) {
	   	return;
	}

	var actual_x = closest_x[0] + svg_rect.left;
	var actual_y = closest_y[0] + svg_rect.top;
	var obj_at_coordinates = document.elementFromPoint(actual_x, actual_y);
	if(obj_at_coordinates.classList.contains("player_piece")) {
		return;
	}

	if(curr_x - closest_x[0] == 0 && curr_y - closest_y[0] == 0) {
	   	// Do nothing, same point
	   return;
	}


	else {
		// The points are fine, move and send new info to server
	   	circle.attr("cx", closest_x[0]);
	   	circle.attr("cy", closest_y[0]);
	   	notify_piece_movement();
	}
	circle.classed("not_selected", true);
	circle.classed("selected", false);
	document.getElementById("svg_board").removeEventListener("click", move_player_piece);
}

// Create a dictionary that maps each space number to pixel positions
var space_to_coordinates = {};
var count = 0;
for(var i = 0; i < y_location_horizontal_lines.length; i++) {
	for(var k = 0; k > x_location_vertical_lines.length; k++) {
		var y = y_location_horizontal_lines[i];
		var x = x_location_vertical_lines[k];
		space_to_coordinates[count] = [x,y];
	}
}
