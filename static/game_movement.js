// This file deals with what occurs when the player needs to move a piece during the game


function find_closest(num, arr) {
	// Finds the value in arr that is closest to num.
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


// Registering what to do when the player's piece is attempted to be moved
// Set this to svg_board's onclick when game starts
function move_player_piece() {
	svg_board = document.getElementById("svg_board");
	svg_board.addEventListener("click", function() {
		// var circle_arr = document.getElementsByClassName("selected");
		circle = d3.select(".selected");
		console.log(circle);
	   // if(circle_arr.length == 0) {
	   	if(circle.empty()) {
	   		console.log("here3");
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
	   // if(obj_at_coordinates != null && obj_at_coordinates.classList.contains("opponent_piece")) {
	   // 		console.log("COLLISION");
	   // 		console.log(get_player_piece_coordinates());
	   // 	// Now send info to server
	   // }

	   if(curr_x - closest_x[0] == 0 && curr_y - closest_y[0] == 0) {
	   	  // Do nothing, same point
	   		console.log("Same point");
	   		return;
	   	}

	   	else {
	   		// The points are fine, move and send new info to server
	   		circle.attr("cx", closest_x[0]);
	   		circle.attr("cy", closest_y[0]);
	   		var positions = get_player_piece_pos();
	   		console.log(positions);
	   		// var new_positions = convert_player_space_to_opponent_space(positions);
	   		// console.log(new_positions);
	   }
	   // Now move the piece either left/right, or up/down, and notify server that player's piece was moved

	   circle.classed("not_selected", true);
	   circle.classed("selected", false);
	})
}

var space_to_coordinates = {};
var count = 0;
for(var i = 0; i < y_location_horizontal_lines.length; i++) {
	for(var k = 0; k > x_location_vertical_lines.length; k++) {
		var y = y_location_horizontal_lines[i];
		var x = x_location_vertical_lines[k];
		space_to_coordinates[count] = [x,y];
	}
}

function get_player_piece_pos() {
    // Gets all the positions of the player's pieces
    var piece_info = {};
    var svg_rect = svg_board.getBoundingClientRect();
    var count = 0;
    for(var i = 0; i < y_location_horizontal_lines.length; i++) {
    	for(var k = 0; k < x_location_vertical_lines.length; k++) {
    		console.log(count);
    		var y = y_location_horizontal_lines[i];
    		var x = x_location_vertical_lines[k];
    		var obj_at_coordinates = document.elementFromPoint(x + svg_rect.left, y + svg_rect.top);
    		if(obj_at_coordinates != null && obj_at_coordinates.classList.contains("player_piece")) {
    			console.log("heyea");
    			data = {};
    			var obj = d3.select(obj_at_coordinates)
    			data["rank"] = obj.attr("id").replace("_circle", "");
    			// data["coordinates"] = [obj.attr("cx"), obj.attr("cy")];
    			piece_info[count] = data;
    		}
    		count++;
    	}
    }
    return piece_info;
}

// function convert_player_space_to_opponent_space(player_pos) {
// 	// Converts coordinates to the opponent's view of the board
// 	var new_pos = {};
// 	for(var old_position in player_pos) {
// 		var data = player_pos[old_position]
// 		var old_col = old_position % (num_vertical_lines);
// 		var old_row = (old_position - old_col)/ num_vertical_lines;
// 		var new_row = num_vertical_lines - old_row;
// 		var new_col = 5 - old_col;
// 		var new_position = 5 * new_row + new_col;
// 		new_pos[new_position] = player_pos[old_position];
// 	}
// 	return new_pos;
// }














