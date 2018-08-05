game_is_over = false; 
round_over = false;
round_num = 0;

function start_game() {
    var svg_board = d3.select("#svg_board");
    svg_board.on("click", null);
    // console.log(svg_board);
    var game_is_over = false;
    var msg = document.getElementById("messages");
    // console.log(id);
    if(id == 0) {
        msg.innerHTML = "Your turn!";
        svg_board.on("click", move_player_piece);
        console.log("added");
    }
    if(id == 1) {
        function listen() {
            var source = new EventSource("/wait_for_turn/?user_id=" + id + "&round=" + round_num);
            var target = document.getElementById("messages");
            source.onmessage = function(msg) {
                console.log("message received");
                var json_data = JSON.parse(msg.data)
                target.innerHTML = json_data["message"];
                if(json_data["stop"] == true) {
                    source.close();
                    console.log(json_data["other_positions"]);
                    set_new_positions(json_data["positions"], json_data["other_positions"])
                    svg_board.on("click", move_player_piece);
                }
                console.log(json_data);
            }
        }
        listen();
    }
}