// Start button
var button = document.getElementById("start_button");
button.addEventListener("click", function() {
    var isValid = checkBoardValid();
    if(isValid == false) return;
    svg_board.removeEventListener("click", set_up_board_pieces);
    function listen() {
        var source = new EventSource("/start/?user_id=" + id + "&board_data=" 
             + JSON.stringify(get_player_piece_positions()));
        var target = document.getElementById("messages");
        source.onmessage = function(msg) {
            var json_data = JSON.parse(msg.data);
            target.innerHTML = json_data["message"] + '<br>';
            // console.log(json_data["can_start"])
            // console.log(msg.data)
            if(json_data["can_start"] == false) {
                console.log("can start is false");
            }
            if(json_data["can_start"] == true) {
                console.log("here should close");
                source.close();
                // new_round(0);
                start_game();
            }
        }
    }
    listen();
})

function checkBoardValid() {
    // Checks that none of the pieces are out of bounds on the board.
    
    var error = "";
    d3.selectAll(".player_piece")
        .each(function() {
            if(board_upper_y + 7 * horizontal_lines_separation >= this.getAttribute("cy")) {
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


















