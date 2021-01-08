// const { Socket } = require("socket.io");

board_length = 16;
bomb_number = 40;
safe_square = board_length*board_length - bomb_number;

let myTurn = true;
let array2d;

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

function render(array2d) {
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
            } else if (array2d[i][j].isMine) {
                button.textContent = 'X';
            } else {
                button.textContent = array2d[i][j].neighbourCount;
            }

            // onclick
            button.onclick = () => {
                if (!myTurn) return;
                
                open_square(array2d, i, j);
                info = {
                    "player": socket.id,
                    "x": i,
                    "y": j,
                }
                render(array2d);

                // send coords to server
                socket.emit("coord", JSON.stringify(info));
                check_win();
            }
            row.appendChild(button);
        }
    }
}

// for player 1
function create_board() {
    // create board
    array2d = create_array2d(board_length, board_length);
    populate_array2d(array2d, board_length, board_length);

    // get board data and send to player 2
    let room_data = {};
    room_data['board_data'] = get_array2d_string(array2d, board_length, board_length);

    render(array2d);

    return room_data;
}

// for player 2
function join_room(board_data) {
    console.log(`received ${board_data} from player 1`);
    array2d = create_array2d(board_length, board_length);
    populate_array2d_from_board_data(array2d, board_data, board_length, board_length);

    render(array2d);
}
