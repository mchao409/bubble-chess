function checkBoardValid() {
    var error = "";
    d3.selectAll(".player_piece")
        .each(function(d,i) {
            // console.log(Math.round(this.getAttribute("cx")));
            // console.log(Math.round(this.getAttribute("cy")));
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

var button = document.getElementById("start_button");
button.addEventListener("click", function() {
    var isValid = checkBoardValid();
    if(isValid == false) return;
    svg_board.removeEventListener("click", set_up_board_pieces);
    function listen() {
        var source = new EventSource("/start/?user_id=" + id);
        var target = document.getElementById("messages");
        source.onmessage = function(msg) {
            var json_data = JSON.parse(msg.data);
            target.innerHTML = json_data["message"] + '<br>';
            console.log(json_data["can_start"])
            console.log(msg.data)
            if(json_data["can_start"] == false) {
                console.log("can start is false");
            }
            if(json_data["can_start"] == true) {
                console.log("here should close");
                source.close();
                start_game();
            }
        }
    }
    listen();
})

function start_game() {
    svg_board = d3.select("#svg_board");
    console.log(svg_board);
    var game_is_over == false;
    var round_num = 1;
    while(game_is_over == false) {
        var turn = 0;
        console.log("looping here");
        if(turn == id) {
            var target = document.getElementById("messages");
            target.innerHTML = "Round " + round_num + ": Your turn!";
            move_player_piece();
        }
        else {
            function listen() {
                var source = new EventSource("wait_for_turn/?user_id=" + id + "&round=" + round_num);
            }
            var target = document.getElementById("messages");
            target.innerHTML = "Round " + round_num + ": Waiting for other player to make their choice";
        }


    }
}






















