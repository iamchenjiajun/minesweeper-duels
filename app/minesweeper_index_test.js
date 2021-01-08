board_length = 16
bomb_number = 40

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
            //removed %50 chance to be bomb
            //array2d[i][j].isMine = (Math.random() > 0.5) ? true: false; // 50% chance to be a mine
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
    console.log(i, j);
    array2d[i][j].isOpened = true;
    console.log(array2d[i][j].neighbourCount);
    if (array2d[i][j].neighbourCount == 0 && array2d[i][j].isMine == false) {
        for (let m=-1; m<=1; m++) {
            for (let n=-1; n<=1; n++) {
                if ((array2d[i+m][j+n].isOpened == false) && (within_board_bounds(i+m, j+n)) ) {
                    open_square(array2d, i+m, j+n);
                    //render(array2d);
                }
            }
        }
    }
}

function render(array2d) {
    //creating the 16x16 buttons
    let x = document.getElementById("board");
    x.textContent = "";
    for (let i = 0; i < board_length; i++) {
        let row = document.createElement("div");
        x.appendChild(row);
        for (let j = 0; j < board_length; j++) {
            let button = document.createElement('BUTTON');

            // show button as html element
            if (!array2d[i][j].isOpened) {
                button.textContent = "U";
            } else if (array2d[i][j].isMine) {
                button.textContent = 'X';
            } else {
                button.textContent = array2d[i][j].neighbourCount;
            }

            // onclick
            button.onclick = () => {
                //array2d[i][j].isOpened = true;
                open_square(array2d, i, j);
                render(array2d);
            }
            row.appendChild(button);
        }
    }
}

let array2d = create_array2d(board_length, board_length);
populate_array2d(array2d, board_length, board_length);
render(array2d);
