// Deals with what occurs when a piece moves

// Registering what to do when a piece is attempted to be moved
svg_board = document.getElementById("svg_board");
svg_board.onclick = function() {
	var circle_arr = document.getElementsByClassName("selected");
	if(circle_arr.length == 0) {
		console.log("here3");
		return;
	}
	var circle = circle_arr[0];
	var curr_x = circle.getAttribute("cx");
	var curr_y = circle.getAttribute("cy");
	var svg_rect = svg_board.getBoundingClientRect();
	var closest_x = findClosest(event.clientX-svg_rect.left, x_location_vertical_lines);
	var closest_y = findClosest(event.clientY-svg_rect.top, y_location_horizontal_lines);

	// Make sure that the piece can only move one space, not multiple
	if(Math.abs(curr_x - closest_x[0]) >= vertical_lines_separation * 1.5 || Math.abs(curr_y - closest_y[0]) >= horizontal_lines_separation * 1.5) {
		console.log("here");
		return;
	}

	if(closest_x[0] != circle.getAttribute("cx") && closest_y[0] != circle.getAttribute("cy")){
		console.log("here1");
		return;
	} 

	// Now move the piece either left/right, or up/down, and notify server that player's piece was moved
	if(closest_x[0] == circle.getAttribute("cx")) {
		circle.setAttributeNS(null,"cy", closest_y[0]);
		console.log("hihi");
	}

	else {
		circle.setAttributeNS(null,"cx", closest_x[0]);
		console.log('heldsa');
	}
	circle.setAttributeNS(null, "class", "not_selected")
}


function getNewPlayerCoordinates() {

}









