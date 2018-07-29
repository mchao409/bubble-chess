// This file deals with what occurs when the player needs to move a piece during the game.

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

// Registering what to do when the player's piece is attempted to be moved
// Set this to svg_board's onclick when game starts
function move_player_piece() {
	svg_board = document.getElementById("svg_board");
	svg_board.addEventListener("click", function() {
		circle = d3.select(".selected");
		console.log(circle);
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

	   if(curr_x - closest_x[0] == 0 && curr_y - closest_y[0] == 0) {
	   	  // Do nothing, same point
	   		console.log("Same point");
	   		return;
	   	}

	   	else {
	   		// The points are fine, move and send new info to server
	   		circle.attr("cx", closest_x[0]);
	   		circle.attr("cy", closest_y[0]);
	   		notify_piece_movement();
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

function get_player_piece_positions() {
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
    			data = {};
    			var obj = d3.select(obj_at_coordinates)
    			data["rank"] = obj.attr("id").replace("_circle", "");
    			piece_info[count] = data;
    		}
    		count++;
    	}
    }
    return piece_info;
}

function notify_piece_movement() {
    // Deals with what occurs when the player's piece moves
    // Returns true if player's piece wins, false otherwise
    var info = null;
    if (id == 0) {
    	info = invert_player_piece_positions(get_player_piece_positions());
    }
    else {
    	info = get_player_piece_positions();
    }
    function listen() {
        var source = new EventSource("player_move/?user_id=" + id + "&board_data=" + JSON.stringify(info) + "&round=0");
        var target = document.getElementById("messages");
        source.onmessage = function(msg) {
            var json_data = JSON.parse(msg.data);
            console.log(json_data["message"]);
            target.innerHTML = json_data["message"] + '<br>';
            if(json_data["stop"] == true) {
            	console.log("STOPPING");
            	source.close();
            	if(id == 0) {
            		set_new_positions(invert_player_piece_positions(json_data["positions"]),
            			invert_player_piece_positions(json_data["other_positions"]));
            	}
            	else set_new_positions(json_data["positions"], json_data["other_positions"]);
            }
        }
    }
    listen();
}

function set_new_positions(player_data, other_data) {
	console.log(player_data);
	console.log(other_data);
	console.log(d3.select('[id="1"]'));
	var count = 0
	console.log(d3.select(".not_updated"));
	console.log(d3.selectAll(".not_updated"));
	for(var i = 0; i < y_location_horizontal_lines.length; i++) {
		for(var k = 0; k < x_location_vertical_lines.length; k++) {
			console.log(i);
			if(count in player_data) {
				console.log("has property player_data")
				var y = y_location_horizontal_lines[i];
    			var x = x_location_vertical_lines[k];
				var rank = player_data[count.toString()]["rank"];
				var circle = d3.select('[id="' + rank + '"]')
								.attr("cx", x)
								.attr("cy", y);
			}
			if(count in other_data) {
				console.log("has property other");
				var y = y_location_horizontal_lines[i];
				var x = x_location_vertical_lines[k];
				var circle = d3.select(".not_updated")
					.attr("cx", x)
					.attr("cy", y)
				circle.classed("updated", false);
					// .classed("updated", true);
				// console.log(circle.classList);
				// circle.classList.remove("not_updated");
				// circle.classList.add("updated");
			}
			count++;
		}
	}

	// d3.selectAll(".not_updated")
	// 	.remove();

	// CONTINUE


}


function invert_player_piece_positions(player_pos) {
	// Converts coordinates to the opponent's view of the board
	var new_pos = {};
	for(var old_position in player_pos) {
		var data = player_pos[old_position]
		var old_col = old_position % (num_vertical_lines);
		var old_row = (old_position - old_col)/ num_vertical_lines;
		var new_row = num_horizontal_lines - old_row - 1;
		var new_col = 5 - old_col - 1;
		var new_position = 5 * new_row + new_col;
		new_pos[new_position] = player_pos[old_position];
	}
	return new_pos;
}















