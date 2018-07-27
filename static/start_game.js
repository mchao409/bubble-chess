// Waits until opponent is ready to begin
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
                begin_game();
            }
        }
    }
    listen();
})

function begin_game() {
    svg_board = d3.select("#svg_board");
    console.log(svg_board);
    move_player_piece();
    // svg_board.on("click", function() {
    //     console.log("HI SVG CLICKED");
    // })

    // svg_board.addEventListener("click", move_player_piece);
}


function piece_movement() {
    // Deals with what occurs when the player's piece moves
    // Returns true if player's piece wins, false otherwise
    var info = get_player_piece_info();
    function listen() {
        
    }
}




















