// Creates the board using SVG path, rectangle, and circle elements

svgns = "http://www.w3.org/2000/svg";

// Making calculations for the main svg board.
var margin_vertical = 0.15;
var margin_side = 0.3;

var num_horizontal_lines = 13;
var num_vertical_lines = 5;

var board_height = window.innerHeight - 2 * window.innerHeight * margin_vertical;
var horizontal_lines_separation = board_height * 1.0/(num_horizontal_lines-1);

var board_width = window.innerWidth - 2 * window.innerWidth * margin_side;
var vertical_lines_separation = board_width * 1.0/(num_vertical_lines-1);
var circle_radius = Math.floor(horizontal_lines_separation/2.0) - 3;
var board_left_x = circle_radius * 2 + 2;
var board_upper_y = circle_radius * 2 + 2;

var svg_board = d3.select('#svg_board');
svg_board.attr("width", board_width + 4 * circle_radius + 3);
svg_board.attr("height", board_height + 4 * circle_radius + 3);

// Holds y-coordinates of all the horizontal lines
var y_location_horizontal_lines = [];

// Holds x-coordinates of all the vertical lines
var x_location_vertical_lines = [];

// Create the horizontal and vertical lines
for(var i = 0; i <= board_height+1; i += horizontal_lines_separation) {
	var x_1 = board_left_x;
	var y_1 = board_upper_y + i;
	var x_2 = board_width + board_left_x;
	var y_2 = y_1;
	createPath([x_1,y_1], [x_2,y_2], "svg_board", "board_path");
	y_location_horizontal_lines.push(y_1);
}

for(var k = 0; k <= board_width+1; k += vertical_lines_separation) {
	var x_1 = board_left_x + k;
	var y_1 = board_upper_y;
	var x_2 = x_1;
	var y_2 = board_upper_y + board_height;
	createPath([x_1,y_1], [x_2,y_2], "svg_board", "board_path");
	x_location_vertical_lines.push(x_1);
}

// Create the diagonal lines
for(var i = 0; i < x_location_vertical_lines.length-1; i++) {
	for(var k = 0; k < y_location_horizontal_lines.length-1; k++) {
		var x_1 = x_location_vertical_lines[i];
		var x_2 = x_location_vertical_lines[i+1];
		var y_1 = y_location_horizontal_lines[k];
		var y_2 = y_location_horizontal_lines[k+1];
		createPath([x_1,y_1], [x_2,y_2], "svg_board", "board_path");
	}
}

for(var i = 0; i < x_location_vertical_lines.length-1; i++) {
	for(var k = 1; k < y_location_horizontal_lines.length-1; k++) {
		var x_1 = x_location_vertical_lines[i];
		var x_2 = x_location_vertical_lines[i+1];
		var y_1 = y_location_horizontal_lines[k];
		var y_2 = y_location_horizontal_lines[k-1];
		createPath([x_1,y_1], [x_2,y_2], "svg_board", "board_path");
	}
}

// Contains all the safe zones 
var safe_zones = [];
// Create boxes and circles on board
for(var i = 0; i < num_horizontal_lines; i++) {
	for(var k = 0; k < num_vertical_lines; k++) {
		if(i >= 5 && i <= num_horizontal_lines-6) { 
		// The middle three rows have no rectangles or circles
			continue;
		}	

		if((i % 2 == 1 && k % 2 == 1) || (i == 2 && k == 2) || (i == 10 && k == 2)) {
			// Create circles -- "Safe zones"
			var cx = board_left_x + k * vertical_lines_separation;
			var cy = board_upper_y + i * horizontal_lines_separation;
			createCircle(cx, cy, circle_radius,"svg_board", "board_circle");
			safe_zones.push([cx,cy]);
		}

		else {
			// Otherwise, create rectangles
			var x = board_left_x + k * vertical_lines_separation - circle_radius * 2;
			var y = board_upper_y + i * horizontal_lines_separation - circle_radius;
			var height = circle_radius * 2;
			var width = circle_radius * 4;
			createRectangle(x,y,width,height,"svg_board", "board_rect");
		}
	}
}

// SVG on the right for initially storing circles
svg_right = d3.select("#svg_right")
	.attr("height", board_height)
	.attr("width", (window.innerWidth - board_width) / 2 - 100)






