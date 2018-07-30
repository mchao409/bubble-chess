function notify_piece_movement() {
    // Notifies server that the piece has moved.
    var info = null;
    if (id == 0) {
    	info = invert_player_piece_positions(get_player_piece_positions());
    }
    else {
    	info = get_player_piece_positions();
    }
    function listen() {
        var source = new EventSource("player_move/?user_id=" + id + "&board_data=" + JSON.stringify(info) + "&round=" + round_num);
        var target = document.getElementById("messages");
        source.onmessage = function(msg) {
            var json_data = JSON.parse(msg.data);
            console.log(json_data["message"]);
            target.innerHTML = json_data["message"] + '<br>';
            if(json_data["stop"] == true) {
            	console.log("STOPPING");
            	round_over = true;
            	source.close();
            	if(id == 0) {
            		set_new_positions(invert_player_piece_positions(json_data["positions"]),
            			invert_player_piece_positions(json_data["other_positions"]));
            	}
            	else set_new_positions(json_data["positions"], json_data["other_positions"]);
            }
        }
    }
    listen();
}