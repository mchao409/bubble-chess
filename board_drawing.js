// Creates the board using SVG path, rectangle, and circle elements

svgns = "http://www.w3.org/2000/svg";

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

var svg_board = document.getElementById('svg_board');
svg_board.setAttribute("width", board_width + 4 * circle_radius + 3);
svg_board.setAttribute("height", board_height + 4 * circle_radius + 3);

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
console.log(y_location_horizontal_lines);
console.log(x_location_vertical_lines);

// Create boxes and circles on board
for(var i = 0; i < num_horizontal_lines; i++) {
	for(var k = 0; k < num_vertical_lines; k++) {
		if(i >= 5 && i <= num_horizontal_lines-6) { 
		// The middle three rows have no rectangles or circles
			continue;
		}	

		if((i % 2 == 1 && k % 2 == 1) || (i == 2 && k == 2) || (i == num_horizontal_lines - 2 && k == num_vertical_lines - 2)) {
			// Create circles -- "Safe zones"
			var cx = board_left_x + k * vertical_lines_separation;
			var cy = board_upper_y + i * horizontal_lines_separation;
			createCircle(cx, cy, circle_radius,"svg_board", "board_circle");
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




