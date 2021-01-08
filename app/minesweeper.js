// load audio tracks
var audio_bomb = new Audio('/app/Minesweeper_bomb_sound.mp3')
var audio_no_bomb = new Audio('/app/Minesweeper_no_bomb_sound.mp3')

let board_length = 16;
let bomb_number = 40;
let safe_square = board_length*board_length - bomb_number;

let myTurn = false;
let array2d;
let game_id;

// 0 = ended
// 1 = normal
// 2 = not started
let game_state = 2;

let mineTimePenalty = 20000 * 7;
let totalTime = 180;
let startTime;
let totalTimeElapsed = 0;
let turnTimeElapsed = 0;
let opponentStartTime = 0;
let opponentTimeElapsed = 0;
let opponentTurnTimeElapsed = 0;

// struct to hold squares
class Square {
    constructor() {
        this.isOpened = false;
        this.isMine = false;
        this.isFlagged = false;
        this.neighbourCount = 0;
    }
}

// creates a 2d array
function create_array2d(rows, cols) {
    let array2d = new Array(rows);
    for (let i = 0; i < rows; i++) {
        array2d[i] = new Array(cols);
    }
    return array2d;
}

// populates the array with Square objects
function populate_array2d(array2d, rows, cols) {
    for (let i=0; i < rows; i++) {
        for (let j=0; j < cols; j++) {
            array2d[i][j] = new Square();
        }
    }
    //randomly pick 40 squares to be bombs
    for (let i=0; i < bomb_number; i++) {
        rand_row = Math.floor(Math.random() * board_length);
        rand_col = Math.floor(Math.random() * board_length);
        while (array2d[rand_row][rand_col].isMine) {   //if Square is already a Mine, reroll
            rand_row = Math.floor(Math.random() * board_length);
            rand_col = Math.floor(Math.random() * board_length);
        }
        array2d[rand_row][rand_col].isMine = true;
    }

    for (let i=0; i < rows; i++) {
        for (let j=0; j< cols; j++) {
            array2d[i][j].neighbourCount = get_neighbour_count(array2d, i, j, rows, cols);
        }
    }
}

function populate_array2d_from_board_data(array2d, board_data, rows, cols) {
    if (board_data.length != rows * cols) alert ('corrupt message');

    // populate with squares
    for (let i=0; i < rows; i++) {
        for (let j=0; j < cols; j++) {
            array2d[i][j] = new Square();
        }
    }

    let count = 0;

    // populate mines from board data
    for (let i=0; i<rows; i++) {
        for (let j=0; j<cols; j++) {
            array2d[i][j].isMine = (board_data[count] == '1') ? true : false;
            count++;
        }
    }

    // populate neighbour count
    for (let i=0; i < rows; i++) {
        for (let j=0; j< cols; j++) {
            array2d[i][j].neighbourCount = get_neighbour_count(array2d, i, j, rows, cols);
        }
    }
}

function get_array2d_string(array2d, rows, cols) {
    let mineString = '';
    for (let i=0; i<rows; i++) {
        for (let j=0; j<cols; j++) {
            if (array2d[i][j].isMine) mineString += '1';
            else mineString += '0';
        }
    }
    return mineString;
}

function get_neighbour_count(array2d, row, col, rows, cols) {
    let count = 0;
    for (let i=-1; i<=1; i++) {
        for (let j=-1; j<=1; j++) {
            if (row+i >= rows || col+j >= cols || row+i <0 || col+j <0) continue;
            if (i==0 && j==0 ) continue;
            if (array2d[row+i][col+j].isMine) count++;
        }
    }
    return count;
}
function within_board_bounds(i, j) {
    if ((i < board_length) && (i > -1) && (j < board_length) && (j > -1)) {
        return true;
    } else {
        return false;
    }
}

function open_square(array2d, i, j) {
    // play sounds when clicked
    if (array2d[i][j].isMine) {
        audio_bomb.play();
    } else if (!array2d[i][j].isOpened) {
        audio_no_bomb.play();
    }

    if (!array2d[i][j].isMine && !array2d[i][j].isOpened) {
        safe_square--;
    }
    array2d[i][j].isOpened = true;
    console.log(safe_square);
    if (array2d[i][j].neighbourCount == 0 && array2d[i][j].isMine == false) {
        for (let m=-1; m<=1; m++) {
            for (let n=-1; n<=1; n++) {
                if (!within_board_bounds(i+m, j+n)) {
                    continue;
                }
                if (array2d[i+m][j+n].isOpened == false) {
                    open_square(array2d, i+m, j+n);
                }
            }
        }
    }
}

function check_win() {
    if (safe_square < 1) {
        alert("hello");
    }
}

function render_turn() {
    let turn_elem = document.getElementById("turn");
    turn_elem.textContent = (myTurn) ? "Your turn!" : "Waiting for opponent...";
    turn_elem.style.color = (myTurn) ? "green" : "red";
}

function render(array2d, latest_i, latest_j) {
    render_turn();
    //creating the 16x16 buttons
    let x = document.getElementById("board");
    x.textContent = "";
    for (let i = 0; i < board_length; i++) {
        let row = document.createElement("div");
        row.classList.add("mine-button-row");
        x.appendChild(row);
        for (let j = 0; j < board_length; j++) {
            let button = document.createElement('BUTTON');
            button.classList.add("mine-button");

            // show button as html element
            if (!array2d[i][j].isOpened) {
                button.textContent = "";
                button.classList.add("mine-button-unopened");
                if (array2d[i][j].isFlagged) {
                    button.textContent = "⛳";
                }
            } else if (array2d[i][j].isMine) {
                button.textContent = '💣';
                
            } else {
                numNeighbours = array2d[i][j].neighbourCount;
                button.textContent = numNeighbours;
                switch(numNeighbours) {
                    case 0:
                        button.textContent = "";
                        break;
                    case 1:
                        button.style.color = "#0200FB"; //blue
                        break;
                    case 2:
                        button.style.color = "#017F00"; //dark green
                        break;
                    case 3:
                        button.style.color = "#FA0300"; //brightish red
                        break;
                    case 4:
                        button.style.color = "#010082"; //dark blue
                        break;
                    case 5:
                        button.style.color = "#820003"; //dark red
                        break;
                    case 6:
                        button.style.color = "#00807F"; //teal
                        break;
                    case 7:
                        button.style.color = "#000000"; //black
                        break;
                    case 8:
                        button.style.color = "#808080";  //grey
                        break;
                }
                // switch(numNeighbours) {
                //     case 0:
                //         button.textContent = "";
                //         break;
                //     case 1:
                //         button.textContent = "🍆";
                //         button.style.color = "#0200FB"; //blue
                //         break;
                //     case 2:
                //         button.textContent = "💦";
                //         button.style.color = "#017F00"; //dark green
                //         break;
                //     case 3:
                //         button.textContent = "🍑";
                //         button.style.color = "#FA0300"; //brightish red
                //         break;
                //     case 4:
                //         button.textContent = "🤪";
                //         button.style.color = "#010082"; //dark blue
                //         break;
                //     case 5:
                //         button.textContent = "❤";
                //         button.style.color = "#820003"; //dark red
                //         break;
                //     case 6:
                //         button.textContent = "🍣";
                //         button.style.color = "#00807F"; //teal
                //         break;
                //     case 7:
                //         button.textContent = "💋";
                //         button.style.color = "#000000"; //black
                //         break;
                //     case 8:
                //         button.textContent = "";
                //         button.style.color = "#808080";  //grey
                //         break;
                // }
            }

            // highlight tile by opponent
            if (i == latest_i && j == latest_j) {
                button.style.borderColor = "blue";
                button.style.borderStyle = "dashed";
            }

            // onclick
            button.onclick = () => {
                if (!myTurn) return;
                if (array2d[i][j].isOpened) return;

                // timer
                totalTimeElapsed += turnTimeElapsed;
                opponentStartTime = Date.now();

                open_square(array2d, i, j);

                // check if click bomb
                if (array2d[i][j].isMine) {
                    totalTimeElapsed += mineTimePenalty;
                }
                
                // send data
                let info = {
                    "player": isCreator ? "1" : "2",
                    "action": "click",
                    "room_number": game_id,
                    "x": i,
                    "y": j,
                    "totalTimeElapsed": totalTimeElapsed,
                }
                render(array2d);

                // send coords to server
                socket.emit("coord", JSON.stringify(info));
                check_win();

                myTurn = false;
                render_turn();
            }

            // right click
            button.oncontextmenu = (event) => {
                event.preventDefault();
                array2d[i][j].isFlagged ^= true;
                render(array2d, latest_i, latest_j);
            }
            row.appendChild(button);
        }
    }
}

socket.on('receive_coord', (message) => {
    console.log('received packet');

    let info = JSON.parse(message);
    if (isCreator) {
        if (info['player'] === "2") { // check whether the packet is from the other player
            myTurn = true;
            open_square(array2d, info['x'], info['y']);
            startTime = Date.now();
            opponentTimeElapsed = info['totalTimeElapsed'];
        }
    } else {
        if (info['player'] === "1") { // check whether the packet is from the other player
            myTurn = true;
            open_square(array2d, info['x'], info['y']);
            startTime = Date.now();
            opponentTimeElapsed = info['totalTimeElapsed'];
        }
    }
    render(array2d, info['x'], info['y']);
})

socket.on('game_end', message => {
    let info = JSON.parse(message);
    let winner = info['winner'];
    game_state = 0;
    if (isCreator && winner === "1") {
        document.getElementById("self-time").textContent = "WIN";
        document.getElementById("other-time").textContent = "LOSE";
    } else if (!isCreator && winner === "2") {
        document.getElementById("self-time").textContent = "WIN";
        document.getElementById("other-time").textContent = "LOSE";
    } else {
        document.getElementById("self-time").textContent = "LOSE";
        document.getElementById("other-time").textContent = "WIN";
    }
})

// for player 1
function create_board() {
    // create board
    array2d = create_array2d(board_length, board_length);
    populate_array2d(array2d, board_length, board_length);

    // get board data and send to player 2
    let room_data = {};
    room_data['board_data'] = get_array2d_string(array2d, board_length, board_length);

    render(array2d);

    // timer
    startTime = Date.now();

    // game state
    game_state = 1;

    return room_data;
}

// for player 2
function join_room(board_data) {
    console.log(`received ${board_data} from player 1`);
    array2d = create_array2d(board_length, board_length);
    populate_array2d_from_board_data(array2d, board_data, board_length, board_length);

    render(array2d);
    startTime = Date.now();

    // game state
    game_state = 1;

    // timer
    opponentStartTime = Date.now();
}

function loseGame() {
    let info = {
        "winner": (isCreator) ? "2" : "1",
        "room_number": game_id,
    }
    socket.emit("game_end", JSON.stringify(info));
}

setInterval(() => {
    if (game_state === 0 || game_state === 2) return;
    if (myTurn) {
        // update opponent time (simple)
        document.getElementById("other-time").textContent = parseFloat(totalTime - opponentTimeElapsed/1000).toFixed(2);

        // update self time
        turnTimeElapsed = Date.now() - startTime;
        document.getElementById("self-time").textContent = parseFloat(totalTime - (totalTimeElapsed + turnTimeElapsed)/1000).toFixed(2);
        if (totalTime - (totalTimeElapsed + turnTimeElapsed)/1000 <= 0) loseGame();
    } else {
        // update opponent time
        opponentTurnTimeElapsed = Date.now() - opponentStartTime;
        document.getElementById("other-time").textContent = parseFloat(totalTime - (opponentTimeElapsed + opponentTurnTimeElapsed)/1000).toFixed(2);

        // update self time (simple)
        document.getElementById("self-time").textContent = parseFloat(totalTime - (totalTimeElapsed)/1000).toFixed(2);
        if (totalTime - totalTimeElapsed/1000 <= 0) loseGame();
    }
}, 10);
