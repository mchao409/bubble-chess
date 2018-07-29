// Creates the bubble pieces on the board

// Create opponent pieces
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
			circle.classed("not_updated", true);
		}
	}
}

// Create player pieces, put them in the svg on the right
var svg_right = d3.select("#svg_right");
var num_circles_horizontal = Math.floor(svg_right.attr("width")/(circle_radius * 2 + 4));
console.log(num_circles_horizontal);
var count = 0;
var row_num = 0;

// while_loop:
// while(count <= 19) {
// 	var cy = circle_radius + 2 * circle_radius * row_num + 2 * row_num + 2;
// 	for(var i = 0; i < num_circles_horizontal-1; i++) {
// 		if(count > 19) break while_loop;
// 		var cx = circle_radius + 2 * circle_radius * i + 2 * i + 2;
// 		var circle = createCircle(cx,cy,circle_radius,"svg_right", "player_piece");
// 		circle.classed("not_selected", true);
// 		// circle.onclick = function(e) {
// 		// createPattern(circle, count, "svg_right");
// 		circle.on("click", function(){
// 			console.log("hihi");
// 			d3.event.stopPropagation();
// 			if(this.classList.contains("selected")) {
// 				this.classList.add("not_selected");
// 				this.classList.remove("selected");
// 			}
// 			else {
// 				if(document.getElementsByClassName("selected").length == 1) return;
// 				this.classList.add("selected");
// 				this.classList.remove("not_selected");
// 			}
// 		})
// 		count++;
// 	}
// 	row_num++;
// }
 

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
			circle = createPattern(circle, count, "svg_board");
			circle.classed("not_selected", true);
			circle.on("click", function(){
				// e.stopImmediatePropagation();
				if(this.classList.contains("selected")) {
					d3.event.stopPropagation();
					console.log("STOPPING PROP")
					this.classList.add("not_selected");
					this.classList.remove("selected");
				}
				else {
					var circles = document.getElementsByClassName("selected");

					console.log("HERE CIRCLES")
					if(circles.length == 0) {
						d3.event.stopPropagation();
						console.log(this);
						this.classList.add("selected");
						this.classList.remove("not_selected");
					}
				}
			})
			count++;
		}
	}
}

function changePosition(arr) {
	// Updates the pieces to new positions, given by 'arr'
	// arr: a 2D array, where 'i' is the piece number (0-19) and arr[i]
	// 	represents the pixel coordinates for that piece. 
	for(var i = 0; i < arr.length; i++) {
		var coor = arr[i];
		var circle = d3.select("#" + i)
			.attr("cx", coor[0])
			.attr("cy", coor[1]);
	}
	return;
}


// function convertPointToPixelPositions(nums) {
// 	// Number all of the points on the graph from left to right, top to bottom,
// 	return;
// }


