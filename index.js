// const http = require('http').createServer();
const express = require('express');
const socketIO = require('socket.io');
const PORT = process.env.PORT || 8080;

// const io = require('socket.io')(http, {
//     cors: { origin: "*" }
// });

let rooms = {}; // {"room_id":"number of people"}

//set up server
const server = express()
    .use(express.static('./'))
    .use((req, res) => res.sendFile("./app/index.html", { root: __dirname }))
    .use(express.static(__dirname + '/static'))
    .listen(PORT, () => console.log(`listening on ${PORT}`))

const io = socketIO(server);

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
        rooms[room_number] += 1;

        // start the game
        io.to(room_number).emit('join_room_success', room_number);
    })

    socket.on("room_data", message => {
        let room_data = JSON.parse(message);
        let room_number = room_data['room_number'];
        console.log(`${room_number} is starting...`);
        io.to(room_number).emit('game_start', message);
    });

    socket.on("coord", (message) => {
        let data = JSON.parse(message);
        console.log(data);
        console.log(socket.rooms)

        // send it to the other player
        
    })
});

// http.listen(process.env.PORT || 8080, () => console.log(`listening on ${process.env.PORT ? process.env.PORT : '8080'}`) );
