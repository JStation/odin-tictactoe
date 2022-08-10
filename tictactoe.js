console.log("tictactoe.js loaded")

/* 
Note from project page:
Minimize global code by using modules and factories
If there is one of something use a module
If there are multiples create them with factories
*/

// IIFE - Immediately Invoked Function Expression
// Module pattern carves namespace for gameBoard operations/data
const Gameboard = (() => {
    const board = new Array(9).fill(null);

    const getBoard = () => board;

    // for TESTING
    const randomizeBoard = () => {
        for (let i=0;i<board.length;i++) {
            let roll = Math.random();
            if (roll < .4) {
                board[i] = "X";
            } else if (roll < .8) {
                board[i] = "O";
            } else {
                board[i] = null;
            }
        }
    }

    // return exposed functions and data (public)
    return {
        getBoard,
        randomizeBoard,
    };
})();

const DisplayController = (() => {
    const grid = document.querySelector(".grid-container");

    const createGridCells = () => {
        for (let i = 0;i<9;i++) {
            let cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.index = i;
            grid.appendChild(cell);
        }
    };

    const drawCell = (index) => {
        // loop through gameboard and update cells
        let board = Gameboard.getBoard();
        let state = board[index];
        console.log(state);
        if (state == "X") {
            // update class on cell
            // draw mark
            console.log("Draw X")
        } else if (state == "O") {
            // update class on cell
            // draw mark
            console.log("Draw O");
        } else {
            // update class on cell
            // remove marks
            console.log("Clear cell");
        }
    }

    return {
        createGridCells,
        drawCell,
    };
})();

// Build board
DisplayController.createGridCells();