// Deals with moving the player's pieces from right_svg to board
function set_up_board_pieces() {
    // console.log("hi");
    circle = d3.select(".selected");
    // console.log(circle);
    if(circle.empty()) {
        console.log("here3");
        return;
    }
    var svg_rect = svg_board.getBoundingClientRect();
    var closest_x = findClosest(event.clientX-svg_rect.left, x_location_vertical_lines);
    var closest_y = findClosest(event.clientY-svg_rect.top, y_location_horizontal_lines);
    // console.log(closest_x);
    // console.log(event.clientX);
    // console.log(vertical_lines_separation * 1.5);
    // console.log(closest_y);
    // console.log(event.clientY);
    // console.log(horizontal_lines_separation * 1.5);

    if(Math.abs(event.clientX-svg_rect.left - closest_x[0]) >= vertical_lines_separation * 1.5 
        || Math.abs(event.clientY - svg_rect.top - closest_y[0]) >= horizontal_lines_separation * 1.5) {
        console.log("here");
        return;
    }

    circle = document.getElementsByClassName("selected")[0];
    svg_board = document.getElementById("svg_board");
    var svg_right = document.getElementById("svg_right");
    if(svg_right.contains(circle)) {
        svg_right.removeChild(circle);
        svg_board.appendChild(circle);
    }

    circle.setAttribute("cx", closest_x[0]);
    circle.setAttribute("cy", closest_y[0]);
    circle.classList.remove("selected");
    circle.classList.add("not_selected");
}

function checkBoardValid() {
    var error = "";
    d3.selectAll(".player_piece")
        .each(function(d,i) {
            console.log(Math.round(this.getAttribute("cx")));
            console.log(Math.round(this.getAttribute("cy")));
            if(board_upper_y + 8 * horizontal_lines_separation >= this.getAttribute("cy")) {
                console.log(this);
                error = "out";
            }
            for(var z = 0; z < safe_zones.length; z++) {
                if(Math.round(safe_zones[z][0]) == Math.round(this.getAttribute("cx")) && Math.round(safe_zones[z][1]) == Math.round(this.getAttribute("cy"))) {
                    console.log("hello")
                    error = "safe";
                }
            }
        })
    if(error.length == 0) return true;
    if(error == "out") {
        alert("One or more pieces is out of bounds. Please readjust your placements.");
        return false;
    }
    if(error == "safe") {
        alert("One or more pieces is in a safe zone. Please readjust your placements");
        return false;
    }

}

var svg_board = document.getElementById("svg_board");
svg_board.addEventListener("click", set_up_board_pieces);

var button = document.getElementById("start_button");
button.addEventListener("click", function() {
    var isValid = checkBoardValid();
});





