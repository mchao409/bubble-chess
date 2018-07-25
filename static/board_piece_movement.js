// This js file deals with what occurs when the player needs to move a piece, 
//   whether in setting up the board or during the game


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
	console.log("hi here")
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
	   var curr_x = circle.attr("cx");
	   var curr_y = circle.attr("cy");
	   console.log(curr_x);
	   var svg_rect = svg_board.getBoundingClientRect();

	   var closest_x = find_closest(event.clientX-svg_rect.left, x_location_vertical_lines);

	   var closest_y = find_closest(event.clientY-svg_rect.top, y_location_horizontal_lines);

	   // Make sure that the piece can only move one space, not multiple
	   console.log(vertical_lines_separation);
	   if(Math.abs(curr_x - closest_x[0]) >= vertical_lines_separation * 1.5 || Math.abs(curr_y - closest_y[0]) >= horizontal_lines_separation * 1.5) {
		  console.log("here");
		  return;
	   }

	   // Now move the piece either left/right, or up/down, and notify server that player's piece was moved
	   if(closest_x[0] == circle.attr("cx")) {
	   	  var new_x = circle.attr("cx");
	   	  var new_y = closest_y[0];

	   	  var actual_x = new_x + svg_rect.left;
	   	  var actual_y = new_y + svg_rect.top;
	   	  var obj_at_coordinates = document.elementFromPoint(actual_x, actual_y);
	   	  if(obj_at_coordinates != null && obj_at_coordinates.classList.contains("opponent_piece")) {
	   	  	console.log("COLLISION")
	   	  }

	   	  circle.attr("cy", closest_y[0]);
		  console.log("hihi");
	   } 

	   else {
	   	  var new_x = closest_x[0];
	   	  var new_y = circle.attr("cx");

	   	  var actual_x = new_x + svg_rect.left
	   	  var actual_y = new_y + svg_rect.top
	   	  var obj_at_coordinates = document.elementFromPoint(actual_x, actual_y);
	   	  if(obj_at_coordinates != null && obj_at_coordinates.classList.contains("opponent_piece")) {
	   	  	console.log("COLLISION")
	   	  }
		  circle.attr("cx", closest_x[0]);
	   	  console.log('heldsa');
	   }
	   // circle.classList.add("not_selected");
	   // circle.classList.remove("selected");
	   if(curr_x - circle.attr("cx") == 0 && curr_y - circle.attr("cy") == 0) {
	   	 console.log("Same point");
	   }
	   circle.classed("not_selected", true);
	   circle.classed("selected", false);
    })
}


