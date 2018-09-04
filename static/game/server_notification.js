function get_player_piece_positions() {
    // Gets all the pixel positions of the player's pieces

    var piece_info = {}; 
    var svg_rect = svg_board.getBoundingClientRect();
    var count = 0;
    for(var i = 0; i < y_location_horizontal_lines.length; i++) {
        for(var k = 0; k < x_location_vertical_lines.length; k++) {
            var y = y_location_horizontal_lines[i];
            var x = x_location_vertical_lines[k];
            var obj_at_coordinates = document.elementFromPoint(x + svg_rect.left, y + svg_rect.top);
            if(obj_at_coordinates != null) {
                // console.log(obj_at_coordinates)
                if(obj_at_coordinates.classList.contains("player_piece")) {
                    console.log(obj_at_coordinates.getAttribute("id"));
                    data = {};
                    var obj = d3.select(obj_at_coordinates);
                    if(obj.attr("id") == "flag"){
                        data["rank"] = -1;
                    } 
                    else {
                        data["rank"] = obj.attr("id").replace("_circle", "");
                    }
                    // var data = {};
                    // var obj = d3.select(obj_at_coordinates)
                    // if(safe_zone_board_numbers[count]) {
                    //     data["safe"] = true;
                    // }
                    // else data["safe"] = false;
                    // data["rank"] = obj.attr("id").replace("_circle", "");
                    piece_info[count] = data;  
                }
                // else if(obj_at_coordinates.getAttribute("id") == "flag") {
                //     console.log("ADDING FLAG")
                //     var data = {};
                //     var obj = d3.select(obj_at_coordinates);
                //     data["rank"] = -1;
                //     // data["safe"] = false;
                //     piece_info[count] = data;
                // }
            }
            count++;
        }
    }
    return piece_info;
}

function set_new_positions(player_data, other_data) {
    // Sets the positions of all the pieces on the board.

    var count = 0
    console.log(d3.select(".not_updated"));
    console.log(d3.selectAll(".not_updated"));
    for(var i = 0; i < y_location_horizontal_lines.length; i++) {
        for(var k = 0; k < x_location_vertical_lines.length; k++) {

            if(count in player_data) {
                var y = y_location_horizontal_lines[i];
                var x = x_location_vertical_lines[k];
                var rank = player_data[count.toString()]["rank"];
                if(rank >= 0) {
                    var circle = d3.select('[id="' + rank + '"]')
                        .attr("cx", x)
                        .attr("cy", y)
                        .classed("updated", true)
                        .classed("not_updated", false);
                }
                else {
                    var circle = d3.select("#flag")
                        .attr("cx", x)
                        .attr("cy", y)
                        .classed("updated", true)
                        .classed("not_updated", false)
                }
            }

            if(count in other_data) {
                // console.log("has property other");
                var y = y_location_horizontal_lines[i];
                var x = x_location_vertical_lines[k];
                var circle = d3.select(".not_updated")
                    .attr("cx", x)
                    .attr("cy", y)
                circle.classed("not_updated", false);
                circle.classed("updated", true);
            }
            count++;
        }
    }
    d3.selectAll(".not_updated")
        .remove();

    d3.selectAll(".updated")
        .classed("updated", false)
        .classed("not_updated", true);

    if(d3.select("#flag").empty()) {
        var target = document.getElementById("messages");
        target.innerHTML = "Sorry, you lost the game.";
    }

    // if(game_is_over) {
    //     var target = document.getElementById("messages");
    //     if(parseInt(game_winner) != id) {
    //         target.innerHTML = "Sorry, you lost.";
    //     }
    //     else {
    //         target.innerHTML = "You won the game!";
    //     }
    // }
    else if(round_over == true) {
        round_over = false;
        round_num++;
        start_game();
    }
}

function invert_player_piece_positions(player_pos) {
    // Converts piece numbers to match the opponent's view of the board. 
    var new_pos = {};
    for(var old_position in player_pos) {
        var data = player_pos[old_position]
        var old_col = old_position % (num_vertical_lines);
        var old_row = (old_position - old_col)/ num_vertical_lines;
        var new_row = num_horizontal_lines - old_row - 1;
        var new_col = 5 - old_col - 1;
        var new_position = 5 * new_row + new_col;
        new_pos[new_position] = player_pos[old_position];
    }
    return new_pos;
}

function notify_piece_movement() {
    d3.select("#svg_board").on("click", null);
    // Notifies server that the piece has moved.
    var info = null;
    if (id == 0) {
        // Only one player's board is inverted. Makes it easier to compare for collisions of pieces
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
            console.log(json_data);
            // console.log(json_data["message"]);
            target.innerHTML = json_data["message"] + '<br>';
            if(json_data["stop"] == true) {
            	// console.log("STOPPING");
            	round_over = true;
                if(json_data["game_winner"] != null) {
                    var game_winner = json_data["game_winner"];
                    if(game_winner != id) {
                        target.innerHTML = "Sorry, you lost.";
                    }
                    else {
                        target.innerHTML = "You won the game!";
                    }
                    source.close();
                    return;
                }
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