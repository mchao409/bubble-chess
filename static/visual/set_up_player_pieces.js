// Deals with beginning the game -- setting up the board with the pieces -- 
//  moving the player's pieces from right_svg to board

// console.log("SET UP PLAYER PIECES")
function set_up_board_pieces() {
    // console.log("hi");
    circle = d3.select(".selected");
    // console.log(circle);
    if(circle.empty()) {
        console.log("here3");
        return;
    }
    var svg_rect = svg_board.getBoundingClientRect();
    var closest_x = find_closest(event.clientX-svg_rect.left, x_location_vertical_lines);
    var closest_y = find_closest(event.clientY-svg_rect.top, y_location_horizontal_lines);

    if(Math.abs(event.clientX-svg_rect.left - closest_x[0]) >= vertical_lines_separation * 1.5 
        || Math.abs(event.clientY - svg_rect.top - closest_y[0]) >= horizontal_lines_separation * 1.5) {
        // console.log("here");
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

var svg_board = document.getElementById("svg_board");
svg_board.addEventListener("click", set_up_board_pieces);
// console.log("I AM HERE");






