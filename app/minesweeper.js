let isCreator = false;

function enter_game_room(room_number) {
    // show the game
    document.getElementById("game").style.display = "block";

    // hide the lobby
    document.getElementById("lobby").style.display = "none";

    // show the room number
    document.getElementById("game_room_number").textContent = room_number;
}

function join_room_success(room_number) {
    if (!isCreator) {
        enter_game_room(room_number); // set everything up for player 2
    } else {
        let room_data = create_board();
        room_data['room_number'] = room_number; // send room number together with packet to player 2
        socket.emit("room_data", JSON.stringify(room_data));
    }
}

socket.on('create_room_success', enter_game_room);
socket.on('join_room_success', join_room_success);

socket.on('game_start', message => {
    if (isCreator) {
        myTurn = true;
    } else {
        let room_data = JSON.parse(message);
        let board_data = room_data['board_data'];
        join_room(board_data);
        // myTurn = false; // uncomment this later
    }
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
