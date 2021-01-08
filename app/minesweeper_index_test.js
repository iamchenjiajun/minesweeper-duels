board_length = 16
bomb_number = 40

//making board
array2d = new Array(board_length)
for (i = 0; i < board_length; i++) {
    array2d[i] = new Array(board_length);
}
console.log(array2d.length);
console.log(Math.random());

//putting bombs
//-1 = bomb
for (i = 0; i < bomb_number; i++) {
    row = [Math.floor(Math.random() * 16)]; //find place to put bomb, if already got bomb, find again
    col = [Math.floor(Math.random() * 16)];
    while (array2d[row][col] == 1) {
        row = [Math.floor(Math.random() * 16)];
        col = [Math.floor(Math.random() * 16)];
    }
    array2d[row][col] = -1;
}

//creating the 16x16 buttons
var x = document.getElementById("lobby");
for (i = 0; i < board_length; i++) {
    var row = document.createElement("div");
    x.appendChild(row);
    for (j = 0; j < board_length; j++) {
        var button = document.createElement('BUTTON');
        button.textContent = 'O';
        row.appendChild(button);
    }
}

