// Deals with what occurs when a piece moves

function findClosest(num, arr) {
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
function playerPiecesLocationsToOpponentPieces() {
	// Gets the coordinates of the current player and transforms them for the opponent's board

}
// Registering what to do when a piece is attempted to be moved
svg_board = document.getElementById("svg_board");
svg_board.onclick = function() {
	// var circle_arr = document.getElementsByClassName("selected");
	circle = d3.select(".selected");
	console.log(circle);
	// if(circle_arr.length == 0) {
	if(circle.empty()) {
		console.log("here3");
		return;
	}
	// var circle = circle_arr[0];
	// var curr_x = circle.getAttribute("cx");
	var curr_x = circle.attr("cx");
	// console.log(curr_x);
	// var curr_y = circle.getAttribute("cy");
	var curr_y = circle.attr("cy");
	console.log(curr_x);
	var svg_rect = svg_board.getBoundingClientRect();
	// console.log(svg_rect);
	// console.log(event.clientX);
	// var closest_x = findClosest(event.clientX-svg_rect.left, x_location_vertical_lines);
	var closest_x = findClosest(event.clientX-svg_rect.left, x_location_vertical_lines);

	// var closest_y = findClosest(event.clientY-svg_rect.top, y_location_horizontal_lines);
	var closest_y = findClosest(event.clientY-svg_rect.top, y_location_horizontal_lines);

	// console.log(closest_x);
	// console.log(closest_y);
	// Make sure that the piece can only move one space, not multiple
	console.log(vertical_lines_separation);
	if(Math.abs(curr_x - closest_x[0]) >= vertical_lines_separation * 1.5 || Math.abs(curr_y - closest_y[0]) >= horizontal_lines_separation * 1.5) {
		console.log("here");
		return;
	}

	if(closest_x[0] != circle.attr("cx") && closest_y[0] != circle.attr("cy")){
		console.log("here1");
		return;
	} 

	// Now move the piece either left/right, or up/down, and notify server that player's piece was moved
	if(closest_x[0] == circle.attr("cx")) {
		circle.attr("cy", closest_y[0]);
		console.log("hihi");
	}

	else {
		circle.attr("cx", closest_x[0]);
		console.log('heldsa');
	}
	// circle.classList.add("not_selected");
	// circle.classList.remove("selected");
	circle.classed("not_selected", true);
	circle.classed("selected", false);
}






// svgns = "http://www.w3.org/2000/svg";

// var defs = document.createElementNS(svgns,"defs");


// var pattern = document.createElementNS(svgns, "pattern");
// pattern.setAttributeNS(null, "id", "testPattern");
// pattern.setAttributeNS(null, "width", 2 * circle_radius);
// pattern.setAttributeNS(null, "height", 2 * circle_radius);
// pattern.setAttributeNS(null, "patternUnits", "userSpaceOnUse");
// defs.appendChild(pattern);


// var img = document.createElementNS(svgns, "img");
// img.setAttributeNS(null, "href", "/img/blue/0blue.png");
// img.setAttributeNS(null, "width", 2 * circle_radius);
// img.setAttributeNS(null, "height", 2 * circle_radius);
// img.setAttributeNS(null, "x", 0);
// img.setAttributeNS(null, "y", 0);

// pattern.appendChild(img);
// svg_board.appendChild(defs);

// var circle = document.createElementNS(svgns, "circle");
// circle.setAttributeNS(null,"cx", circle_radius);
// circle.setAttributeNS(null,"cy", circle_radius);
// circle.setAttributeNS(null,"r", circle_radius);
// circle.style.fill = "#fff";
// circle.style.fill =  "url(#testPattern)";
// svg_board.appendChild(circle);





