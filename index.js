const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

let rooms = {}; // {"room_id":"number of people"}

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('create_room', (message) => {
        // generate unique room number (spaghetti code)
        let room_number = '' + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
        while (rooms[room_number] !== undefined) {
            room_number = '' + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10) + Math.floor(Math.random() * 10);
        }

        // add socket to room
        socket.join(room_number);
        io.to(room_number).emit('create_room_success', room_number);

        // add to list of rooms
        rooms[room_number] = 1;

        // log
        console.log(`created room ${room_number}`);
    })

    socket.on('join_room', (message) => {
        let room_number = message;

        // check if room exists (guard clause)
        if (rooms[room_number] === undefined) {
            socket.emit('message', "room does not exist");
            return;
        }

        // check if room is at max capacity (guard clause)
        if (rooms[room_number] == 2) {
            socket.emit('message', "room is full");
            return;
        }

        // join the room
        socket.join(room_number);
        io.to(room_number).emit('message', `you joined ${room_number}`)
        rooms[room_number] += 1;

        // start the game
        io.to(room_number).emit('game_start', "someone joined the room and the game started");
    })
});

http.listen(process.env.PORT || 8080, () => console.log(`listening on ${process.env.PORT ? process.env.PORT : '8080'}`) );
