const socket = io('ws://localhost:8080');

socket.on('message', text => {

    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el)

});

document.querySelector('button').onclick = () => {

    const text = document.querySelector('input').value;
    socket.emit('message', text)
    
}

document.getElementById('button_create_room').onclick = () => {
    socket.emit('create_room', '');
}

document.getElementById('button_join_room').onclick = () => {
    const room_number = document.querySelector('input').value;
    socket.emit('join_room', room_number);
}
