const socket = io('ws://localhost:8080');

function enter_game_room(room_number) {
    // show the game
    document.getElementById("game").style.display = "block";

    // hide the lobby
    document.getElementById("lobby").style.display = "none";

    // show the room number
    document.getElementById("game_room_number").textContent = room_number;
} 

socket.on('create_room_success', enter_game_room);
socket.on('game_start', enter_game_room);

socket.on('game_start', message => {
    document.getElementById("text").textContent = "game started as someone joined the room";
})

document.getElementById('button_create_room').onclick = () => {
    socket.emit('create_room', '');
}

document.getElementById('button_join_room').onclick = () => {
    const room_number = document.getElementById("room_id").value;
    socket.emit('join_room', room_number);
}