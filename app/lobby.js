let isCreator = false;

function hide_lobby(room_number) {
    // show the game
    document.getElementById("game").style.display = "block";
    // hide the lobby
    document.getElementById("lobby").style.display = "none";
    // show the room number
    document.getElementById("game_room_number").textContent = room_number;
}

socket.on('create_room_success', (room_number) => {
        hide_lobby(room_number);
});

socket.on('join_room_success', (room_number) => {
    if (!isCreator) {
        hide_lobby(room_number); // set everything up for player 2
    } else {
        let room_data = create_board();
        room_data['room_number'] = room_number; // send room number together with packet to player 2
        socket.emit("room_data", JSON.stringify(room_data));
    }
});

socket.on('game_start', message => {
    let room_data = JSON.parse(message);
    let board_data = room_data['board_data'];
    game_id = room_data['room_number'];
    if (isCreator) {
        myTurn = true;
    } else {
        join_room(board_data);
        myTurn = false; // uncomment this later
    }
    render_turn();
})

socket.on('message', (message) => {
    if (message == "room does not exist" || message === "room is full") {
        document.getElementById("error_message").textContent = message;
    }
});

document.getElementById('button_create_room').onclick = () => {
    socket.emit('create_room', '');
    isCreator = true;
}

document.getElementById('button_join_room').onclick = () => {
    let room_number = document.getElementById("room_id").value;

    // check if number is valid
    if (room_number === "" || room_number.length != 6) {
        alert("Please enter a valid room id");
    } else {
        socket.emit('join_room', room_number);
    }
}
